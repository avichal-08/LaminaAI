import express from 'express';
import geminiConfig from '../config/geminicon.js';
const router=express.Router();

router.post('/',async(req,res)=>{
    try{
    const mdl=req.body.model;
    const query=req.body.query;

    const model=geminiConfig.getGenerativeModel({model:`${mdl}`});
    const result=await model.generateContent(query);
    res.json({response: result.response.text()});
}catch(error){
    console.log(`error:${error}`);
    res.json({response:"Unfortunatley there is some internal error. Please try again later"});
}
});

export default router;