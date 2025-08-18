import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import mainRoute from './routes/index.js';

const app=express();
app.use(express.json());

app.use(cors());
app.use('/api/v1',mainRoute);

app.get('/ping',(req,res)=>{
    res.send("Active");
});

const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Server running at port:${port}`)
})