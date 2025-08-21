import express from 'express';
import client from '../config/openRouterCon.js';
const router=express.Router();

router.post('/',async(req,res)=>{
    try{
        const {model,conversation}=req.body;
        const messages=conversation.map(m=>({
          role:m.role,
          content:m.text
        }));

        const completion = await client.chat.completions.create({
            model,
            messages,
        });
        res.json({response:completion.choices[0].message.content});
    }catch(error){
        console.log(`error:${error}`);
        res.json({response:"Unfortunatley there is some internal error. Please try again later"});
    }
});

export default router;