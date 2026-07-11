import { type NextRequest } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

/**
 * POST /api/chat
 * Streams AI responses based strictly on the provided Investment Analysis report.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, reportContext } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!reportContext) {
      return new Response(JSON.stringify({ error: 'Report context is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    logger.info(`Starting streamed chat reply`, {
      ticker: reportContext.ticker || 'unknown',
      length: message.length,
    });

    const model = new ChatGoogleGenerativeAI({
      model: process.env.GEMINI_MODEL_NAME ?? 'gemini-2.0-flash',
      temperature: 0.15,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemPrompt = `You are a helpful, senior investment research co-pilot.
Your task is to answer follow-up questions about the following Investment Analysis report:
---
${JSON.stringify(reportContext, null, 2)}
---
CRITICAL INSTRUCTIONS:
1. Answer the user's question ONLY using the facts, scores, metrics, SWOT, risks, and findings in the provided report.
2. If the user asks a question that cannot be answered using the provided report, reply honestly that you do not have that information in the report. Do not speculate.
3. NEVER invent, extrapolate, or hallucinate any facts, statistics, historical returns, or company actions.
4. Keep your responses structured, clear, and professional. Use markdown elements (lists, bold words, code text, or tables) to convey information clearly.`;

    const chatMessages = [
      new SystemMessage(systemPrompt),
      ...(history || []).map((msg: any) => {
        if (msg.role === 'user') return new HumanMessage(msg.content);
        return new AIMessage(msg.content);
      }),
      new HumanMessage(message),
    ];

    const stream = await model.stream(chatMessages);
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.content;
            if (typeof text === 'string' && text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          logger.error('Error during streaming chunk execution', { error: String(err) });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    logger.error('Failed to execute chat stream API', { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
