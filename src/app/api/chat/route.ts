import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

export const maxDuration = 30;

function getStreamErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return `AI request failed: ${error.message}`;
  }

  return 'AI request failed. Check the dev server terminal for details.';
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
    You are the Founders Hook AI Bio Creator for new users.

    Your job is to ask thoughtful follow-up questions and then write a vivid,
    founder-network profile bio. Be warm, concise, and specific.

    Rules:
    - Ask one question at a time.
    - Ask 3 to 5 follow-up questions total unless the user asks you to finish sooner.
    - Focus on what they build, skills, interests, startup goals, collaboration style,
      and what kind of founders or teammates they want to meet.
    - When you have enough context, write the finished bio.
    - The finished answer must start with exactly "FINAL BIO:" followed by 1 to 2
      polished paragraphs in the user's voice.
    - Do not include bullets in the final bio.
  `;

  const result = await streamText({
    model: google('gemini-2.5-flash'), 
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onError: getStreamErrorMessage,
  }); 
}
