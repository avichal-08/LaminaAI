import { useState,useRef} from 'react';
import axios from 'axios';
import { FaArrowUp } from "react-icons/fa";
import Loader from '../utils/loader';
export default function Gemini(){
    const [model,setModel]=useState('gemini-2.5-flash');
    const [prompt,setPrompt]=useState('');
    const [response,setResponse]=useState('');
    const [loading, setLoading] = useState(false);
    const promptRef=useRef("");
    const api_url=import.meta.env.VITE_API_URL;
    const models=["Gemini 2.5 Pro","Gemini 2.5 Flash","Gemini 2.5 Flash-Lite"];

    const handleUpload=async()=>{
        if((promptRef.current.value.trim()).length!=0){
            console.log(model);
            setResponse('');
            setPrompt(promptRef.current.value);
            setLoading(true);

            try{
                const response= await axios.post(`${api_url}/api/v1/gemini`,{
                    model:`${model}`,
                    query:`${promptRef.current.value.trim()}`
                });
                setLoading(false);
                setResponse(response.data.response);
            }catch(error){
                setLoading(false);
                console.log(`error:${error}`);
                setResponse("Please try again");
            }
        }
    };

    const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpload();
    }
  };

    return(
        <div className='bg-black/40 h-[95vh] w-full max-w-4xl relative shadow shadow-white rounded-2xl px-4 pt-2 items-center'>
            <div className='h-[80%] overflow-y-auto relative overflow-x-hidden flex flex-col gap-4 px-4 border border-b-gray-300'>
            {prompt&&<div className='bg-gray-800 break-all [overflow-wrap:anywhere] w-fit flex self-end p-4 rounded-4xl text-white'>{prompt}</div>}
            {loading&&<div className='self-center absolute top-[50%] right-[55%]'><Loader/></div>}
            {response&&<div className='bg-gray-800 break-all [overflow-wrap:anywhere] w-fit max-w-[95%] flex p-4 rounded-4xl text-white'>{response}</div>}
            </div>
            <div className='flex gap-4 text-white rounded-4xl justify-between py-2 px-5'>
                {models.map((mdl)=>(
                    <button onKeyDown={handleKeyDown} onClick={()=>setModel(mdl.split(" ").join("-").toLowerCase())} className={`${model===(mdl.split(" ").join("-").toLowerCase()) ?"bg-gray-100 text-black":""} p-1 rounded-4xl shadow shadow-white cursor-pointer`}>{mdl}</button>
                ))}
            </div>
            <div className="bg-black/10 w-[95%] rounded-4xl absolute bottom-2 items-center shadow shadow-white flex">
                <input type='text' placeholder="Ask anything" ref={promptRef} onKeyDown={handleKeyDown} className='h-full w-[87%] md:w-[95%] py-3 pl-4 tracking-wider text-white focus:outline-none focus:bg-black/10 rounded-l-4xl'/>
                <div onClick={handleUpload} className='bg-white rounded-full text-xl flex items-center justify-center w-8 h-8 cursor-pointer'>
                    <FaArrowUp />
                </div>
            </div>
        </div>
    )
}