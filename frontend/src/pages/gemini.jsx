import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp } from "react-icons/fa";
import Loader from '../utils/loader';

export default function Gemini() {
    const [model, setModel] = useState('gemini-2.5-flash');
    const [messages, setMessages] = useState([]); 
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
            setLoading(false);
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
        <div className="bg-black/50 h-[95vh] w-[98%] max-w-4xl relative shadow-lg shadow-white/30 rounded-2xl px-4 pt-2 flex flex-col">
            
            {/* Chat window */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-4 px-4 py-2 border border-b-white/40 rounded-xl hide-scrollbar">
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`break-all [overflow-wrap:anywhere] max-w-[80%] px-5 py-3 rounded-2xl text-white transition-all duration-300
                            ${msg.role === 'user' 
                                ? 'self-end bg-gradient-to-r from-blue-500 to-blue-700 shadow-md' 
                                : 'self-start bg-gray-700 shadow-inner'}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && (
                    <div className="self-center mt-4"><Loader /></div>
                )}
                <div ref={bottomRef}></div>
            </div>

            {/* Model buttons */}
            <div className="flex gap-3 text-white rounded-2xl justify-center py-2 px-4 mt-2 bg-black/30 shadow-inner">
                {models.map((mdl) => {
                    const mdlValue = mdl.split(" ").join("-").toLowerCase();
                    const active = model === mdlValue;
                    return (
                        <button 
                            key={mdl}
                            onKeyDown={handleKeyDown}
                            onClick={() => setModel(mdlValue)}
                            className={`px-3 py-1 rounded-3xl cursor-pointer text-sm transition 
                                ${active 
                                    ? "bg-white text-black font-semibold" 
                                    : "bg-gray-800 hover:bg-gray-600"}`}>
                            {mdl}
                        </button>
                    );
                })}
            </div>

            {/* Input box */}
            <div className="bg-black/40 w-[95%] rounded-full absolute bottom-3 left-1/2 -translate-x-1/2 items-center shadow-md shadow-white/30 flex">
                <input 
                    type="text" 
                    placeholder="Ask anything..." 
                    ref={promptRef} 
                    onKeyDown={handleKeyDown} 
                    className="h-12 w-full py-2 pl-5 tracking-wide text-white bg-transparent focus:outline-none placeholder-gray-300 rounded-l-full"
                />
                <div 
                    onClick={handleUpload} 
                    className="bg-white rounded-full text-xl flex items-center justify-center w-10 h-10 mx-2 cursor-pointer hover:scale-105 active:scale-95 transition">
                    <FaArrowUp />
                </div>
            </div>
        </div>
    );
}
