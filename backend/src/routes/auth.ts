import { Router } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { db } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// WeChat Mini Program Login
router.post('/wechat-login', async (req, res, next) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      throw new AppError(400, 'Authorization code is required');
    }

    // Exchange code for openid and session_key
    const wxResponse = await axios.get(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        params: {
          appid: process.env.WECHAT_APPID,
          secret: process.env.WECHAT_SECRET,
          js_code: code,
          grant_type: 'authorization_code'
        }
      }
    );

    const { openid, unionid, session_key } = wxResponse.data;

    if (!openid) {
      throw new AppError(401, 'WeChat authentication failed');
    }

    // Find or create user
    let user = await db('users').where({ openid }).first();

    if (!user) {
      // Create new user
      const [newUser] = await db('users')
        .insert({
          openid,
          unionid,
          nickname: userInfo?.nickName || `读者${Date.now().toString().slice(-4)}`,
          avatar_url: userInfo?.avatarUrl,
          last_login_at: new Date()
        })
        .returning('*');
      user = newUser;
    } else {
      // Update last login
      await db('users')
        .where({ id: user.id })
        .update({ last_login_at: new Date() });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, openid: user.openid },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        is_new_user: !user.reading_dna
      }
    });

  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw new AppError(400, 'Token is required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db('users').where({ id: decoded.userId }).first();

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const newToken = jwt.sign(
      { userId: user.id, openid: user.openid },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token: newToken });

  } catch (error) {
    next(error);
  }
});

export default router;
