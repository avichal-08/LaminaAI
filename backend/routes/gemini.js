import express from 'express';
import geminiConfig from '../config/geminicon.js';
const router=express.Router();

router.post('/',async(req,res)=>{
    try{
    const mdl=req.body.model;
    const conversation=req.body.conversation;
    const gemCon=conversation.map(m=>({
      role:m.role,
      parts:[{text:m.text}]
    }))

    const model=geminiConfig.getGenerativeModel({model:`${mdl}`});
    const result=await model.generateContent({contents:gemCon});
 
    let output = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output && typeof result.response?.text === 'function') {
      output = result.response.text();
    }

    const feedback = result.response?.promptFeedback;
    if (feedback && feedback.blockReason) {
      console.error(`Prompt blocked: ${feedback.blockReason}`);
      return res.json({
        response: `The model blocked this request: ${feedback.blockReason}`
      });
    }

    if (!output) {
      console.error('No text returned from Gemini Pro.');
      return res.json({
        response: 'Gemini Pro did not return any text. Check logs.'
      });
    }

    res.json({ response: output });
}catch(error){
    console.log(`error:${error}`);
    res.json({response:"Unfortunatley there is some internal error. Please try again later"});
}
});

export default router;