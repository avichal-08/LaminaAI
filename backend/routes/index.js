import express from 'express';
import openRoute from './openRouter.js'
const router=express.Router();

router.use('/openRouter',openRoute);

export default router;