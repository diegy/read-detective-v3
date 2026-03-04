import OpenAI from 'openai';

let openai: OpenAI | null = null;

export function setupOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  OPENAI_API_KEY not set. AI features will be disabled.');
    return;
  }

  openai = new OpenAI({ apiKey });
  console.log('✅ OpenAI client initialized');
}

export function getOpenAI(): OpenAI {
  if (!openai) {
    throw new Error('OpenAI not initialized');
  }
  return openai;
}
