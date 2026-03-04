import { Router } from 'express';
import { db } from '../config/database';
import { redis } from '../config/redis';
import { getOpenAI } from '../config/openai';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Find matches for current user
router.get('/find', async (req, res, next) => {
  try {
    const userId = req.user?.id;

    // Get user's reading DNA
    const user = await db('users')
      .where({ id: userId })
      .select('reading_dna')
      .first();

    if (!user?.reading_dna?.embedding) {
      throw new AppError(400, 'Please complete reading DNA test first');
    }

    const userEmbedding = user.reading_dna.embedding;

    // Get potential matches (users who haven't been matched yet)
    const potentialMatches = await db('users')
      .whereNot({ id: userId })
      .whereNotNull('reading_dna')
      .select('id', 'nickname', 'avatar_url', 'reading_dna');

    // Calculate similarity scores
    const matches = potentialMatches
      .map((candidate) => {
        const candidateEmbedding = candidate.reading_dna?.embedding;
        if (!candidateEmbedding) return null;

        // Cosine similarity
        const similarity = cosineSimilarity(userEmbedding, candidateEmbedding);
        
        return {
          user_id: candidate.id,
          nickname: candidate.nickname,
          avatar_url: candidate.avatar_url,
          similarity: Math.round(similarity * 100),
          reading_dna: candidate.reading_dna?.preferences
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.similarity || 0) - (a?.similarity || 0))
      .slice(0, 5);

    // Generate AI matching reasons for top matches
    const openai = getOpenAI();
    const matchesWithReasons = await Promise.all(
      matches.map(async (match) => {
        if (!match) return null;

        const prompt = `两位读者的阅读DNA相似度为 ${match.similarity}%。
读者A的偏好：${JSON.stringify(user.reading_dna.preferences)}
读者B的偏好：${JSON.stringify(match.reading_dna)}

请用一句话浪漫地描述他们为什么适合成为书友（30字内）。`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: '你是一位浪漫的阅读红娘，善于发现灵魂书友之间的共鸣。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 100
        });

        return {
          ...match,
          match_reason: completion.choices[0].message.content
        };
      })
    );

    res.json({
      success: true,
      matches: matchesWithReasons.filter(Boolean)
    });

  } catch (error) {
    next(error);
  }
});

// Accept a match
router.post('/accept', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { targetUserId } = req.body;

    // Check if match exists
    const existingMatch = await db('matches')
      .where({
        user1_id: targetUserId,
        user2_id: userId
      })
      .orWhere({
        user1_id: userId,
        user2_id: targetUserId
      })
      .first();

    if (existingMatch) {
      // Update status
      await db('matches')
        .where({ id: existingMatch.id })
        .update({ status: 'accepted' });

      // Create chat room
      const [room] = await db('chat_rooms')
        .insert({
          type: 'direct',
          match_id: existingMatch.id,
          participants: [userId, targetUserId]
        })
        .returning('*');

      res.json({
        success: true,
        room_id: room.id,
        message: 'Match accepted! Chat room created.'
      });
    } else {
      // Create new match
      const [match] = await db('matches')
        .insert({
          user1_id: userId,
          user2_id: targetUserId,
          status: 'pending',
          similarity_score: 0 // Will be calculated
        })
        .returning('*');

      res.json({
        success: true,
        match_id: match.id,
        message: 'Match request sent'
      });
    }

  } catch (error) {
    next(error);
  }
});

// Helper: Calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default router;
