import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaUser, FaRobot } from "react-icons/fa";
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
    <div className="h-[95vh] w-[98%] max-w-4xl flex flex-col mx-auto rounded-2xl overflow-hidden bg-neutral-900 shadow-lg border border-gray-700">
      
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.role === 'bot' && (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <FaRobot className="text-green-400"/>
              </div>
            )}
            
            <
