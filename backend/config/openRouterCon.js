import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY2,
  baseURL: 'https://openrouter.ai/api/v1',
});

export default client;