import React, { useEffect, useRef, useState, useCallback } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Send } from "lucide-react";

export default function ChatRoom({ roomId, title }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const fetchMessages = useCallback(async () => {
    try { const { data } = await api.get(`/rooms/${roomId}/messages`); setMessages(data); } catch {} finally { setLoading(false); }
  }, [roomId]);
  useEffect(() => { fetchMessages(); const i = setInterval(fetchMessages, 5000); return () => clearInterval(i); }, [fetchMessages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const send = async (e) => { e.preventDefault(); if (!text.trim()) return; try { const { data } = await api.post(`/rooms/${roomId}/messages`, { content: text }); setMessages((p) => [...p, data]); setText(""); } catch {} };
  if (!user) return <div className="p-6 text-center text-muted-foreground">سجّل دخولك للمشاركة</div>;
  return (<div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden" style={{height:"500px"}}><div className="px-4 py-3 border-b border-border font-semibold text-sm">{title}</div><div className="flex-1 overflow-y-auto p-4 space-y-3">{loading && <p className="text-center text-sm">جاري التحميل...</p>}{messages.map((msg) => { const isMe = msg.sender_id === user?.id; return (<div key={msg.id} className={`flex gap-2 ${isMe?"flex-row-reverse":""}`}><div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">{msg.sender_name?.[0]?.toUpperCase()}</div><div className={`px-3 py-2 rounded-xl text-sm ${isMe?"bg-primary text-primary-foreground":"bg-accent"}`}>{msg.content}</div></div>);})}<div ref={bottomRef}/></div><form onSubmit={send} className="p-3 border-t border-border flex gap-2"><input value={text} onChange={(e)=>setText(e.target.value)} placeholder="اكتب رسالة..." className="flex-1 bg-accent rounded-lg px-3 py-2 text-sm outline-none" dir="rtl"/><button type="submit" className="bg-primary text-primary-foreground px-3 py-2 rounded-lg"><Send className="w-4 h-4"/></button></form></div>);
}
