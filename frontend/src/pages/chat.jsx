import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { FaGithub } from "react-icons/fa";

export default function Chat() {
    const [model, setModel] = useState('mistralai/mistral-small-3.2-24b-instruct:free');
    const [messages, setMessages] = useState([]);
    const [button, setButton] = useState(true);
    const [slider,setSlider]=useState(false);
    const promptRef = useRef("");
    const bottomRef = useRef();
    const api_url = import.meta.env.VITE_API_URL;
    const models = [{"Mistral 3.2 ":"mistralai/mistral-small-3.2-24b-instruct:free"},{"DeepSeek R1":"deepseek/deepseek-r1:free"},
        {"OpenAI gpt oss-20b":"openai/gpt-oss-20b:free"},{"MoonshotAI Kimi K2 ":"moonshotai/kimi-k2:free"},
        {"DeepSeek R1T2 Chimera":"tngtech/deepseek-r1t2-chimera:free"},
        {"Google Gemma 2":"google/gemma-2-9b-it:free"},
        {"ArliAI":"arliai/qwq-32b-arliai-rpr-v1:free"},
        {"Agentica Deepcoder":"agentica-org/deepcoder-14b-preview:free"},
        {"Microsoft DS R1":"microsoft/mai-ds-r1:free"},
        {"Qwen 2.5 VL":"qwen/qwen2.5-vl-72b-instruct:free"}];

    const handleUpload = async () => {
        const query = promptRef.current.value.trim();
        if (query.length === 0) return;

        const updatedMessages=[...messages,{role:'user',text:query}];
        setMessages(updatedMessages);
        promptRef.current.value = '';
        setButton(false);
        try {
            const res = await axios.post(`${api_url}/api/v1/openRouter`,{
                model,
                conversation:updatedMessages
            });
            setButton(true);
            let cleanText = res.data.response.replace(/\*/g, "");
            setMessages(prev=>[...prev,{role:'system',text:cleanText}]);
        }catch(error){
            setButton(true);
            console.log(`error:${error}`);
            setMessages(prev=>[...prev,{role:'system',text:"Please try again later"}]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleUpload();
        }
    };

    useEffect(() => {
        promptRef.current?.focus();
        bottomRef.current?.scrollIntoView({behavior:'smooth'});
    }, [messages]);

    return (
        <div className='flex w-full lg:gap-20 relative'>
            <div className='hidden lg:flex flex-col lg:w-80 text-white rounded-4xl justify-between py-2 px-5'>
                {models.map((mdl) => {
                    return (
                        <button 
                            key={Object.values(mdl)[0]}
                            onKeyDown={handleKeyDown}
                            onClick={() => setModel(Object.values(mdl)[0])}
                            className={`${model===Object.values(mdl)[0]?"bg-pink-300 text-black":"bg-gray-100/10"} p-1 rounded-4xl shadow shadow-white cursor-pointer`}>
                            {Object.keys(mdl)}
                        </button>
                    );
                })}
            </div>

            <div className='w-full'>
            <div className='flex justify-between px-2 pt-2 lg:pt-0 lg:mb-1 lg:ml-[82%]'>
            {!slider&&<div className='text-white lg:hidden cursor-pointer' onClick={()=>setSlider(!slider)}><RxHamburgerMenu size={30}/></div>}
            {slider&&<div className='text-white ml-2 lg:hidden cursor-pointer' onClick={()=>setSlider(!slider)}><RxCross2 size={30}/></div>}
            <a href="https://github.com/avichal-08/LaminaAI" target="_blank" rel="noopener noreferrer" className='text-white cursor-pointer'><FaGithub size={35}/></a>
            </div>
            
            

            {slider&&<div className='absolute lg:hidden bg-black h-[95%] flex flex-col lg:w-80 w-60 text-white rounded-4xl justify-between py-8 px-5 z-10'>
                {models.map((mdl) => {
                    return (
                        <button 
                            key={Object.values(mdl)[0]}
                            onKeyDown={handleKeyDown}
                            onClick={() => setModel(Object.values(mdl)[0])}
                            className={`${model===Object.values(mdl)[0]?"bg-pink-300 text-black":"bg-gray-100/10"} p-1 rounded-4xl shadow shadow-white cursor-pointer`}>
                            {Object.keys(mdl)}
                        </button>
                    );
                })}
            </div>}

           <div className='bg-black/40 h-[91vh] w-[98%] max-w-4xl  relative shadow shadow-white rounded-2xl px-4 pt-2 mt-4 lg:mt-0 items-center'>
              <div className='h-[86%] overflow-y-auto relative overflow-x-hidden flex flex-col gap-4 px-4 border border-b-white'>
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`w-fit max-w-[95%] flex p-3 rounded-4xl 
                            ${msg.role==='user'?'self-end  bg-blue-300 break-all [overflow-wrap:anywhere] w-fit':'self-start bg-pink-300 whitespace-pre-wrap leading-relaxed w-auto'}`}>  
                    {msg.text}</div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="w-[95%] rounded-4xl absolute bottom-2 items-center bg-gray-100/10 shadow shadow-white flex">
                <input 
                    type='text' 
                    placeholder="Ask anything" 
                    ref={promptRef} 
                    onKeyDown={handleKeyDown} 
                    className='h-full w-[87%] md:w-[95%] py-3 pl-4 tracking-wider text-white focus:outline-none rounded-l-4xl'
                />
                {button&&<div onClick={handleUpload} className='bg-white rounded-full text-xl flex items-center justify-center w-8 h-8 cursor-pointer'>
                    <FaArrowUp />
                </div>}
            </div>
        </div>
        </div>
        </div>
    );
}
