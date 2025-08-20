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
    const output=result.response.text();
    res.json({response:output});
}catch(error){
    console.log(`error:${error}`);
    res.json({response:"Unfortunatley there is some internal error. Please try again later"});
}
});

export default router;