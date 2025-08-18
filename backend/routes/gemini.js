import express from 'express';
import geminiConfig from '../config/geminicon.js';
const router=express.Router();

router.post('/',async(req,res)=>{
    try{
    const mdl="gemini-1.5-flash";
    const query=req.body.query;
    if(!query){
        res.json({response:"Please Enter Prompt"});
    };

    const model=geminiConfig.getGenerativeModel({model:`${mdl}`});
    const result=await model.generateContent(query);
    res.json({response: result.response.text()});
}catch(error){
    console.log(`error:${error}`);
    res.json({response:"Unfortunatley there is some internal error. Please try again later"});
}
});

export default router;