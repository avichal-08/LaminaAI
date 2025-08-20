import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp } from "react-icons/fa";
import Loader from '../utils/loader';

export default function Gemini() {
    const [model, setModel] = useState('gemini-2.5-flash');
    const [messages, setMessages] = useState([]); // Store chat history
    const [loading, setLoading] = useState(false);
    const promptRef = useRef("");
    const bottomRef = useRef();
    const api_url = import.meta.env.VITE_API_URL;
    const models = ["Gemini 2.5 Pro", "Gemini 2.5 Flash", "Gemini 2.5 Flash-Lite"];

    const handleUpload = async () => {
        const query = promptRef.current.value.trim();
        if (query.length === 0) return;

        setMessages(prev => [...prev, { role: 'user', text: query }]);
        promptRef.current.value = '';
        setLoading(true);

        try {
            const res = await axios.post(`${api_url}/api/v1/gemini`, {
                model: `${model}`,
                query
            });
            setLoading(false)
            setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
        } catch (error) {
            setLoading(false);
            console.log(`error: ${error}`);
            setMessages(prev => [...prev, { role: 'bot', text: "Please try again" }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleUpload();
        }
    };
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='bg-black/40 h-[95vh] w-[98%] max-w-4xl relative shadow shadow-white rounded-2xl px-4 pt-2 items-center'>
            

            <div className='h-[80%] overflow-y-auto relative overflow-x-hidden flex flex-col gap-4 px-4 border border-b-white'>
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`bg-gray-800 break-all [overflow-wrap:anywhere] w-fit max-w-[95%] flex p-4 rounded-4xl text-white 
                            ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && <div className='self-center absolute top-[50%] right-[68%] md:right-[55%]'><Loader/></div>}
                <div ref={bottomRef}></div>
            </div>

            <div className='flex gap-4 text-white rounded-4xl justify-between py-2 px-5'>
                {models.map((mdl) => {
                    const mdlValue = mdl.split(" ").join("-").toLowerCase();
                    return (
                        <button 
                            key={mdl}
                            onKeyDown={handleKeyDown}
                            onClick={() => setModel(mdlValue)}
                            className={`${model === mdlValue ? "bg-gray-100 text-black" : ""} p-1 rounded-4xl shadow shadow-white cursor-pointer`}>
                            {mdl}
                        </button>
                    );
                })}
            </div
            <div className="bg-black/10 w-[95%] rounded-4xl absolute bottom-2 items-center shadow shadow-white flex">
                <input 
                    type='text' 
                    placeholder="Ask anything" 
                    ref={promptRef} 
                    onKeyDown={handleKeyDown} 
                    className='h-full w-[87%] md:w-[95%] py-3 pl-4 tracking-wider text-white focus:outline-none focus:bg-black/10 rounded-l-4xl'
                />
                <div onClick={handleUpload} className='bg-white rounded-full text-xl flex items-center justify-center w-8 h-8 cursor-pointer'>
                    <FaArrowUp />
                </div>
            </div>
        </div>
    );
}
