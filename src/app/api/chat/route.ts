import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
    You are a friendly onboarding assistant... (your prompt here)
  `;

  const result = await streamText({
    model: google('gemini-2.5-flash'), 
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse(); 
}