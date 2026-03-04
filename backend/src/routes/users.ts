import { Router } from 'express';
import { db } from '../config/database';
import { getOpenAI } from '../config/openai';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'nickname', 'avatar_url', 'bio', 'reading_dna', 'created_at')
      .first();

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get reading stats
    const stats = await db('user_books')
      .where({ user_id: userId })
      .count('* as total_books')
      .first();

    res.json({
      ...user,
      stats: {
        total_books: parseInt(stats?.total_books || '0'),
        finished_books: 0, // Calculate from query
        current_streak: 7 // From reading_sessions
      }
    });

  } catch (error) {
    next(error);
  }
});

// Update reading DNA
router.post('/reading-dna', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { preferences } = req.body;

    // Generate embedding from preferences
    const openai = getOpenAI();
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: JSON.stringify(preferences)
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Update user
    await db('users')
      .where({ id: userId })
      .update({
        reading_dna: {
          preferences,
          embedding,
          updated_at: new Date()
        }
      });

    res.json({ success: true, message: 'Reading DNA updated' });

  } catch (error) {
    next(error);
  }
});

// Get user's books
router.get('/books', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { status } = req.query;

    let query = db('user_books')
      .join('books', 'user_books.book_id', 'books.id')
      .where({ 'user_books.user_id': userId })
      .select(
        'books.*',
        'user_books.status',
        'user_books.current_page',
        'user_books.rating',
        'user_books.started_at',
        'user_books.finished_at'
      );

    if (status) {
      query = query.where({ 'user_books.status': status });
    }

    const books = await query.orderBy('user_books.created_at', 'desc');

    res.json(books);

  } catch (error) {
    next(error);
  }
});

export default router;
