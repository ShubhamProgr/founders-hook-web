'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

interface BioChatbotProps {
  onClose: () => void;
  qaData: Record<string, string | string[]>;
}

export default function BioChatbot({
  onClose,
  qaData,
}: BioChatbotProps) {
  const {
    messages,
    sendMessage,
    status,
  } = useChat();

  const [input, setInput] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    const initialContext = `
Here are my answers to the onboarding questions:

${JSON.stringify(qaData, null, 2)}

Ask me a few follow-up questions and then write a professional bio.
`;

    sendMessage({
      text: initialContext,
    });
  }, [qaData, sendMessage]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input,
    });

    setInput('');
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-ink-900/95 border border-white/10 rounded-2xl shadow-card backdrop-blur-xl flex flex-col overflow-hidden z-50">

      <div className="border-b border-white/10 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-white">
          AI Bio Generator
        </h3>

        <button
          onClick={onClose}
          className="text-xl text-white"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === 'user'
                  ? 'bg-gold-500/20'
                  : 'bg-white/10'
              }`}
            >
              {message.parts?.map((part, i) =>
                part.type === 'text' ? (
                  <p key={i}>{part.text}</p>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-white/10 p-4 flex gap-2"
      >
        <input
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
        />

        <button
          type="submit"
          disabled={status === 'streaming'}
          className="btn-gold px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>

    </div>
  );
}