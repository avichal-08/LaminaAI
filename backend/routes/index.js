import express from 'express';
import geminiRoute from './gemini.js';
const router=express.Router();

router.use('/gemini',geminiRoute);

export default router;