'use client';

import { useChat } from '@ai-sdk/react';
import { CheckCircle2, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

interface BioChatbotProps {
  onClose: () => void;
  qaData: Record<string, string | string[]>;
}

function textFromMessage(message: { parts?: Array<{ type: string; text?: string }> }) {
  return message.parts
    ?.map((part) => (part.type === 'text' ? part.text || '' : ''))
    .join('')
    .trim() || '';
}

function extractFinalBio(text: string) {
  const marker = 'FINAL BIO:';
  const index = text.toUpperCase().indexOf(marker);

  if (index === -1) return '';

  return text.slice(index + marker.length).trim();
}

export default function BioChatbot({ onClose, qaData }: BioChatbotProps) {
  const router = useRouter();
  const { messages, sendMessage, status, error: chatError } = useChat();
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const initialized = useRef(false);

  const finalBio = useMemo(() => {
    const assistantMessages = messages.filter((message) => message.role === 'assistant');

    for (let i = assistantMessages.length - 1; i >= 0; i -= 1) {
      const bio = extractFinalBio(textFromMessage(assistantMessages[i]));
      if (bio) return bio;
    }

    return '';
  }, [messages]);

  const displayError = error || chatError?.message || '';

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    const initialContext = `
Here are my onboarding answers:

${JSON.stringify(qaData, null, 2)}

Start by asking a useful follow-up question. When you have enough detail, write my profile bio using the required FINAL BIO format.
`;

    sendMessage({ text: initialContext });
  }, [qaData, sendMessage]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!input.trim()) return;

    await sendMessage({ text: input });
    setInput('');
  }

  async function saveBio() {
    if (!finalBio || saving) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/profile/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: finalBio }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not save your bio yet.');
        return;
      }

      router.push('/profile');
      router.refresh();
    } catch {
      setError('Network error. Please try saving again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="fixed inset-0 z-50 flex min-h-screen flex-col bg-ink-radial text-mist-100">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-ink-950">
            <Sparkles size={20} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-semibold text-white">
              AI Bio Creator
            </h1>
            <p className="truncate text-sm text-mist-400">
              Answer a few questions, review the result, then publish it to your profile.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-mist-300 transition-colors hover:text-white"
          aria-label="Close bio creator"
        >
          <X size={18} />
        </button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-h-0 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {messages
                .filter((message) => message.role !== 'system')
                .map((message) => {
                  const text = textFromMessage(message);
                  const displayText = message.role === 'assistant'
                    ? text.replace(/^FINAL BIO:\s*/i, '')
                    : text;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-card sm:max-w-[78%] ${
                          message.role === 'user'
                            ? 'bg-gold-400/15 text-gold-50'
                            : 'border border-white/10 bg-white/[0.05] text-mist-100'
                        }`}
                      >
                        {displayText}
                      </div>
                    </div>
                  );
                })}

              {status === 'submitted' && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-mist-300">
                    <Loader2 size={16} className="animate-spin" />
                    Thinking through the next question...
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit} className="shrink-0 border-t border-white/10 bg-ink-950/80 px-5 py-4 sm:px-8">
            <div className="mx-auto flex max-w-3xl gap-3">
              <input
                className="field-input min-w-0 flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
              />

              <button
                type="submit"
                disabled={!input.trim() || status === 'streaming' || status === 'submitted'}
                className="btn-gold shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send answer"
              >
                {status === 'streaming' || status === 'submitted' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>

        <aside className="border-t border-white/10 bg-ink-900/70 p-5 lg:border-l lg:border-t-0 lg:p-6">
          <div className="sticky top-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
                Profile Preview
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                Your generated bio
              </h2>
            </div>

            <div className="min-h-52 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-mist-300">
              {finalBio ? (
                <p className="whitespace-pre-wrap text-mist-100">{finalBio}</p>
              ) : (
                <p>
                  The finished bio will appear here after the assistant asks enough questions.
                </p>
              )}
            </div>

            {displayError && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {displayError}
              </p>
            )}

            <button
              type="button"
              onClick={saveBio}
              disabled={!finalBio || saving}
              className="btn-gold w-full justify-center disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Save to Profile
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
