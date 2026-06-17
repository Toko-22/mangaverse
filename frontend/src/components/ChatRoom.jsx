import React, { useEffect, useRef, useState } from "react";
import api, { fmtError } from "../api";
import { Send } from "lucide-react";

export default function ChatRoom({ roomId, title }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [me, setMe] = useState(null);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/chat/${roomId}/messages`);
      setMessages(data);
    } catch {
      // ignore polling errors silently
    }
  };

  useEffect(() => {
    api.get("/users/me").then(({ data }) => setMe(data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchMessages();
    const id = setInterval(fetchMessages, 5000);
    return () => clearInterval(id);
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setSending(true);
    try {
      await api.post(`/chat/${roomId}/messages`, { body });
      setText("");
      await fetchMessages();
    } catch (err) {
      console.error(fmtError(err?.response?.data?.detail));
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="flex flex-col bg-[#0F111A] border border-border rounded-xl overflow-hidden"
      style={{ height: "520px" }}
      data-testid="chat-room"
    >
      <div className="px-4 py-3 border-b border-border bg-[#0a0c14] flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-semibold text-sm text-foreground">{title}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            لا توجد رسائل بعد. كن أول من يبدأ المحادثة!
          </p>
        )}
        {messages.map((msg) => {
          const isMine = me && (msg.user_id === me.id || msg.sender_id === me.id);
          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className="w-8 h-8 rounded-full bg-primary/20 text-primary grid place-items-center text-xs font-bold shrink-0"
                title={msg.user?.name || msg.sender?.name || "؟"}
              >
                {(msg.user?.name || msg.sender?.name || "؟")[0]}
              </div>
              <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                {!isMine && (
                  <span className="text-xs text-muted-foreground px-1">
                    {msg.user?.name || msg.sender?.name}
                  </span>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-secondary text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.body || msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="px-3 py-3 border-t border-border bg-[#0a0c14] flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك…"
          disabled={sending}
          className="flex-1 bg-[#0F111A] border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition disabled:opacity-50"
          dir="auto"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          aria-label="إرسال"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
