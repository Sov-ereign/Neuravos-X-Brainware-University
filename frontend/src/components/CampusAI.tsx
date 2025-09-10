import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { GraduationCap, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

type ChatMessage = { role: 'user' | 'assistant'; content: string; time: string };

const motto = 'CREATE SOLUTIONS THAT MAKE LEARNING AND CAMPUS LIFE SMARTER. FROM CLASSROOM SCHEDULING TO STUDENT HELPDESK CHATBOTS, DIGITAL NOTES, AND SKILL SHOWCASE HUBS — THE OPPORTUNITIES ARE LIMITLESS.';

const CampusAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: 'Hi! I\'m Campus-AI, your intelligent campus assistant. Ask me about your class schedule, subjects, room locations, or any campus-related questions!',
    time: new Date().toLocaleTimeString()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    
    const now = new Date().toLocaleTimeString();
    const userMsg: ChatMessage = { role: 'user', content: trimmed, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://neuravos-x-brainware-university.onrender.com//chat', {
        message: trimmed
      }, {
        timeout: 30000
      });

      const reply: ChatMessage = {
        role: 'assistant',
        content: response.data.response || 'Sorry, I couldn\'t process your request.',
        time: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, reply]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorReply: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting to the server. Please try again later.',
        time: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-[#003399] rounded-2xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#003399] mb-4">Campus-AI Chat</h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          {motto}
        </p>
      </div>

      {/* Chat */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[420px] overflow-y-auto space-y-4 pr-1">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} px-4 py-3 rounded-2xl max-w-[80%] shadow-sm`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  <div className={`${m.role === 'user' ? 'text-blue-100' : 'text-gray-500'} text-[10px] mt-1 text-right`}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSend(); }}
              placeholder="Ask about your class schedule, subjects, room locations..."
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="bg-[#E60023] hover:bg-[#cc001f] text-white disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampusAI;