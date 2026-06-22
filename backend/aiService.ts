import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

// OpenAI-compatible client for Gemini and GPT-4 via OpenRouter
const getOpenRouterClient = () => new OpenAI({
    baseURL: OPENROUTER_BASE,
    apiKey: process.env.OPENROUTER_API_KEY || 'missing_key',
    timeout: 10000,
    maxRetries: 0,
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CreatorVerse AI',
    }
});

// Anthropic-compatible client for Claude via OpenRouter
const getAnthropicClient = () => new Anthropic({
    baseURL: OPENROUTER_BASE,
    apiKey: process.env.OPENROUTER_API_KEY || 'missing_key',
    timeout: 10000,
    maxRetries: 0,
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CreatorVerse AI',
    }
});

type ModelType = 'gemini' | 'claude' | 'gpt4' | 'hybrid';

const callGemini = async (prompt: string): Promise<string> => {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your_')) throw new Error('OpenRouter API key missing');
    const res = await getOpenRouterClient().chat.completions.create({
        model: 'google/gemma-4-26b-a4b-it:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
    } as any);
    return (res.choices[0].message as any).content || '';
};

const callGPT4 = async (prompt: string): Promise<string> => {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your_')) throw new Error('OpenRouter API key missing');
    const res = await getOpenRouterClient().chat.completions.create({
        model: 'openai/gpt-oss-120b:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
    } as any);
    return (res.choices[0].message as any).content || '';
};

const callClaude = async (prompt: string): Promise<string> => {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your_')) throw new Error('OpenRouter API key missing');
    const res = await getOpenRouterClient().chat.completions.create({
        model: 'qwen/qwen3-next-80b-a3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
    } as any);
    return (res.choices[0].message as any).content || '';
};

export const callAIModel = async (prompt: string, model: ModelType = 'gemini'): Promise<string> => {
    switch (model) {
        case 'gemini':
            return callGemini(prompt);

        case 'gpt4':
            return callGPT4(prompt);

        case 'claude':
            return callClaude(prompt);

        case 'hybrid': {
            // Fire all three models in parallel
            const [geminiResult, gpt4Result, claudeResult] = await Promise.allSettled([
                callGemini(prompt),
                callGPT4(prompt),
                callClaude(prompt),
            ]);

            const responses = [
                { label: 'Gemini (gemma-4)', result: geminiResult },
                { label: 'GPT-4 (gpt-oss-120b)', result: gpt4Result },
                { label: 'Claude (qwen3-next-80b)', result: claudeResult },
            ]
                .filter(r => r.result.status === 'fulfilled')
                .map(r => `### ${r.label}:\n${(r.result as PromiseFulfilledResult<string>).value}`)
                .join('\n\n---\n\n');

            if (!responses) throw new Error('All models failed in hybrid mode');

            // Synthesize consensus using GPT-4 (or Gemini as fallback)
            const consensusPrompt = `You are the Hybrid AI Consensus Engine. Three independent AI models (Gemini, GPT-4, and Claude) each responded to the same analytical prompt.

ORIGINAL PROMPT:
${prompt}

INDIVIDUAL MODEL RESPONSES:
${responses}

Your task: Synthesize a single, superior response that combines the strongest insights from all three models. Merge the best data points, correct any inconsistencies, and output the final result. The output must be a SINGLE valid JSON object — no markdown, no explanation.`;

            try {
                return await callGPT4(consensusPrompt);
            } catch {
                return await callGemini(consensusPrompt);
            }
        }

        default:
            throw new Error(`Unsupported model: ${model}`);
    }
};
