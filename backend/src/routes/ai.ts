import { Router } from 'express';
import { getOpenAI } from '../config/openai';
import { db } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// AI Book Summary
router.post('/summary', async (req, res, next) => {
  try {
    const { bookId, style = 'concise' } = req.body;
    const userId = req.user?.id;

    // Get book info
    const book = await db('books').where({ id: bookId }).first();
    if (!book) {
      throw new AppError(404, 'Book not found');
    }

    const openai = getOpenAI();

    const prompt = `请为《${book.title}》生成一个${style === 'detailed' ? '详细的' : '简洁的'}书评摘要。
作者：${book.author}
${book.description ? `简介：${book.description}` : ''}

要求：
1. 核心观点提炼
2. 适合人群
3. 阅读建议
${style === 'detailed' ? '4. 章节要点\n5. 金句摘录' : ''}

语气：像一位资深的读书人在向朋友推荐这本书。`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '你是一位博学的阅读导师，善于用简洁优美的语言总结书籍精髓。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: style === 'detailed' ? 1500 : 500
    });

    const summary = completion.choices[0].message.content;

    // Save to conversation history
    await db('ai_conversations').insert({
      user_id: userId,
      book_id: bookId,
      session_id: req.body.sessionId || `summary_${Date.now()}`,
      messages: [{ role: 'assistant', content: summary }],
      type: 'book_summary'
    });

    res.json({
      success: true,
      summary,
      book: {
        id: book.id,
        title: book.title,
        author: book.author
      }
    });

  } catch (error) {
    next(error);
  }
});

// AI Chat (Reading Assistant)
router.post('/chat', async (req, res, next) => {
  try {
    const { message, bookId, sessionId = `chat_${Date.now()}` } = req.body;
    const userId = req.user?.id;

    const openai = getOpenAI();

    // Get conversation history
    const conversation = await db('ai_conversations')
      .where({ session_id: sessionId })
      .first();

    let messages: any[] = [
      { 
        role: 'system', 
        content: `你是「书页间」的 AI 读书助手。你是一位博览群书的智者，善于：
1. 深入解读书籍内容
2. 提供个性化的阅读建议
3. 与用户进行有深度的文学对话
4. 推荐相关书籍

请用温暖、睿智的语气回答，像一位老朋友在分享阅读心得。` 
      }
    ];

    if (conversation) {
      messages = [...messages, ...conversation.messages];
    }

    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.8,
      max_tokens: 1000
    });

    const reply = completion.choices[0].message.content;

    // Update conversation
    const updatedMessages = [
      ...messages.slice(1), // Skip system message
      { role: 'assistant', content: reply }
    ];

    if (conversation) {
      await db('ai_conversations')
        .where({ session_id: sessionId })
        .update({ messages: updatedMessages });
    } else {
      await db('ai_conversations').insert({
        user_id: userId,
        book_id: bookId,
        session_id: sessionId,
        messages: updatedMessages,
        type: 'general'
      });
    }

    res.json({
      success: true,
      reply,
      sessionId
    });

  } catch (error) {
    next(error);
  }
});

// AI Book Recommendation
router.post('/recommend', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { context, count = 3 } = req.body;

    // Get user's reading history
    const userBooks = await db('user_books')
      .join('books', 'user_books.book_id', 'books.id')
      .where({ 'user_books.user_id': userId })
      .select('books.title', 'books.author', 'user_books.rating')
      .limit(10);

    const openai = getOpenAI();

    const prompt = `基于以下阅读历史和用户偏好，推荐 ${count} 本书。

用户的阅读历史：
${userBooks.map(b => `- 《${b.title}》${b.author} ${b.rating ? `(评分: ${b.rating})` : ''}`).join('\n')}

当前场景/需求：${context || '寻找下一本好书'}

请用以下 JSON 格式返回：
{
  "recommendations": [
    {
      "title": "书名",
      "author": "作者",
      "reason": "推荐理由（50字内）",
      "genre": "类型"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '你是一位专业的图书推荐师，善于根据读者口味精准推荐书籍。只返回JSON格式，不要其他内容。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    res.json({
      success: true,
      recommendations: result.recommendations || []
    });

  } catch (error) {
    next(error);
  }
});

export default router;
