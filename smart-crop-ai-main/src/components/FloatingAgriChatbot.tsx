import { useState } from "react";
import { askAgriBot } from "@/services/geminiService";
import { MessageCircle, X } from "lucide-react";

const FloatingAgriChatbot = () => {

  const [open,setOpen] = useState(false);
  const [messages,setMessages] = useState<any[]>([]);
  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);

  const sendMessage = async () => {

    if(!input.trim()) return;

    const user = {role:"user",text:input};

    setMessages(prev=>[...prev,user]);

    setInput("");
    setLoading(true);

    const reply = await askAgriBot(user.text);

    setMessages(prev=>[...prev,{role:"bot",text:reply}]);

    setLoading(false);
  };

  return (
    <>
      {/* Chat Button */}

      <button
        onClick={()=>setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#B7410E] text-white flex items-center justify-center shadow-lg z-50"
      >
        {open ? <X/> : <MessageCircle/>}
      </button>

      {/* Chat Window */}

      {open && (

        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-xl border z-50">

          <div className="bg-[#5C3A21] text-white px-4 py-2 rounded-t-xl font-semibold">
            🌱 AI Farm Assistant
          </div>

          <div className="h-64 overflow-y-auto p-3 space-y-2">

            {messages.map((m,i)=>(
              <div key={i} className={m.role==="user" ? "text-right":"text-left"}>
                <span className="bg-gray-100 px-3 py-1 rounded text-sm inline-block">
                  {m.text}
                </span>
              </div>
            ))}

            {loading && <p className="text-xs text-gray-500">AI thinking...</p>}

          </div>

          <div className="flex border-t">

            <input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Ask farming question..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={sendMessage}
              className="px-4 bg-[#B7410E] text-white text-sm"
            >
              Send
            </button>

          </div>

        </div>

      )}

    </>
  );
};

export default FloatingAgriChatbot;