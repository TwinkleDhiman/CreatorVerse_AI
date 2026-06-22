import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { callAIModel } from './aiService';
import axios from 'axios';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Mock user endpoint
app.get('/api/me', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'mock@creatorverse.ai' },
            include: { creatorProfile: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Dashboard Unified Endpoint (Dynamic AI Generation)
app.post('/api/dashboard', async (req, res) => {
    const model = (req.query.model as string) || 'gemini';
    const platform = (req.query.platform as string) || 'youtube';
    const { sourceUrl, contextData, name, niche } = req.body;
    try {
        const existingAnalysis = await prisma.platformAnalysis.findFirst({
            where: { sourceUrl: sourceUrl || 'none', platform: platform },
            orderBy: { createdAt: 'desc' }
        });

        if (existingAnalysis && new Date() < existingAnalysis.cacheExpiry) {
            const data = JSON.parse(existingAnalysis.analysisData);
            data._metadata = { generatedFrom: 'Cache', platform, timestamp: existingAnalysis.createdAt };
            return res.json(data);
        }

        let scrapedContext = '';
        if (sourceUrl) {
            try {
                // Perform a basic scrape to give the AI real context for unknown URLs
                const htmlRes = await axios.get(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                const html = htmlRes.data;
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) || html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
                
                scrapedContext = `We scraped this target URL. Found Title: "${titleMatch ? titleMatch[1] : 'Unknown'}". Found Meta Description: "${descMatch ? descMatch[1] : 'Unknown'}".`;
            } catch (scrapeErr) {
                console.error("Could not scrape URL:", sourceUrl);
                scrapedContext = `Could not directly scrape the URL. Rely on your internal knowledge for: ${sourceUrl}`;
            }
        }

        const urlText = sourceUrl ? `Target URL: ${sourceUrl}\nURL Context: ${scrapedContext}` : '';
        const rawDataText = contextData ? `Raw Analytics Context:\n${contextData}` : '';

        const prompt = `You are a world-class creator economy analyst. Generate a dynamic, hyper-realistic analytics dashboard for a creator on ${platform}.
${name ? `Creator Name: ${name}` : ''}
${niche ? `Niche: ${niche}` : ''}
${urlText}
${rawDataText}

CRITICAL INSTRUCTION: If a Target URL or Raw Analytics Context is provided, you MUST base ALL of your generated data explicitly on the realities of that specific URL or raw data. Deduce the exact Creator Name, Niche, and Audience demographics from the scraped URL context or your internal knowledge of the URL.
CRITICAL INSTRUCTION 2: You MUST determine the 'audience' segments uniquely for EVERY creator. DO NOT use generic segments. Base them strictly on the niche and content style inferred from the URL.

Model Personality: You are ${model}. Reflect your unique analytical style in the insights and scenarios. If you are 'hybrid', state that you combine Gemini, GPT-4, and Claude.

You MUST return ONLY a valid JSON object matching this exact structure:
{
  "creator": {
    "name": "${name}",
    "followers": number (e.g. 150000),
    "monthlyRevenue": number (e.g. 25000),
    "engagementRate": number (e.g. 8.5),
    "growthScore": number (0-100, this represents the Creator Health Score based on Growth Momentum, Engagement, Consistency, and Audience Quality)
  },
  "insight": {
    "title": "string (2-4 words)",
    "recommendation": "string (1 sentence actionable advice)",
    "confidenceScore": number,
    "reasoning": "string (why you recommend this)",
    "dataSources": ["string"]
  },
  "audience": [
    { "name": "Segment 1", "value": number (percentage) },
    { "name": "Segment 2", "value": number },
    { "name": "Segment 3", "value": number }
  ],
  "scenarios": [
    { "title": "string", "type": "Educational|Community|Product|B2B|Growth", "revenue": "High Impact|Medium Impact|Low Impact", "growth": "Strong Fit|Medium Fit|Weak Fit", "probability": number (0-100) },
    { "title": "string", "type": "Educational|Community|Product|B2B|Growth", "revenue": "High Impact|Medium Impact|Low Impact", "growth": "Strong Fit|Medium Fit|Weak Fit", "probability": number (0-100) },
    { "title": "string", "type": "Educational|Community|Product|B2B|Growth", "revenue": "High Impact|Medium Impact|Low Impact", "growth": "Strong Fit|Medium Fit|Weak Fit", "probability": number (0-100) }
  ],
  "analytics": {
    "growth": [{ "month": "Jan", "followers": number }, { "month": "Feb", "followers": number }, { "month": "Mar", "followers": number }, { "month": "Apr", "followers": number }, { "month": "May", "followers": number }, { "month": "Jun", "followers": number }],
    "engagement": [{ "format": "Shorts", "rate": number }, { "format": "Reels", "rate": number }, { "format": "Long-form", "rate": number }, { "format": "Posts", "rate": number }],
    "revenue": [{ "name": "Sponsorships", "value": number }, { "name": "Courses", "value": number }, { "name": "AdSense", "value": number }, { "name": "Affiliates", "value": number }],
    "retention": [{ "time": "0%", "viewers": 100 }, { "time": "10%", "viewers": number }, { "time": "25%", "viewers": number }, { "time": "50%", "viewers": number }, { "time": "75%", "viewers": number }, { "time": "100%", "viewers": number }]
  },
  "oracle": {
    "perception": [
      { "subject": "Educational", "A": number (0-100), "fullMark": 100 },
      { "subject": "Trustworthy", "A": number, "fullMark": 100 },
      { "subject": "Technical", "A": number, "fullMark": 100 },
      { "subject": "Entertaining", "A": number, "fullMark": 100 },
      { "subject": "Accessible", "A": number, "fullMark": 100 },
      { "subject": "Authoritative", "A": number, "fullMark": 100 }
    ],
    "expansion": [
      { "title": "string", "desc": "string (include reasoning and confidence)", "match": number, "expectedRevenue": "$Xk/mo", "expectedGrowth": "+X%" },
      { "title": "string", "desc": "string", "match": number, "expectedRevenue": "$Xk/mo", "expectedGrowth": "+X%" },
      { "title": "string", "desc": "string", "match": number, "expectedRevenue": "$Xk/mo", "expectedGrowth": "+X%" }
    ],
    "competitors": [
      { "name": "string", "gap": "string", "opportunity": "High|Medium|Low" },
      { "name": "string", "gap": "string", "opportunity": "High|Medium|Low" }
    ],
    "healthScore": {
      "score": number,
      "text": "string (brand analysis summary, include projected revenue and growth expectations for the niche here)"
    }
  }
}
Return only the raw JSON. No markdown tags like \`\`\`json.`;

        const aiRes = await callAIModel(prompt, model as any);
        const jsonMatch = aiRes.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || aiRes.match(/{[\s\S]*}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiRes;
        
        try {
            const data = JSON.parse(jsonStr);
            data._metadata = { generatedFrom: 'AI Simulation', platform };
            
            try {
                let profile = await prisma.creatorProfile.findFirst();
                if (!profile) {
                    const user = await prisma.user.findFirst() || await prisma.user.create({ data: { name: 'Mock', email: 'mock@creatorverse.ai' } });
                    profile = await prisma.creatorProfile.create({ data: { userId: user.id } });
                }
                const expiry = new Date();
                expiry.setHours(expiry.getHours() + 24);
                
                await prisma.platformAnalysis.upsert({
                    where: { creatorProfileId_platform: { creatorProfileId: profile.id, platform: platform } },
                    update: { analysisData: JSON.stringify(data), sourceUrl: sourceUrl || 'none', cacheExpiry: expiry },
                    create: { creatorProfileId: profile.id, platform: platform, sourceUrl: sourceUrl || 'none', analysisData: JSON.stringify(data), cacheExpiry: expiry }
                });
            } catch (cacheErr) {
                console.error("Cache save error:", cacheErr);
            }

            return res.json(data);
        } catch (e) {
            console.error("JSON parse error:", e);
            throw new Error('AI returned invalid JSON');
        }
    } catch (error: any) {
        console.error("Dashboard AI Error:", error.message || error);
        
        // Rule-Based Fallback Engine
        console.log("AI API Error hit. Falling back to rule-based fallback engine.");
        const fallbackName = name || (sourceUrl ? sourceUrl.replace(/.*@/, '').replace(/\/.*/, '') : 'Creator');
        const niches = ['AI', 'Finance', 'Fitness', 'Gaming', 'Business', 'Education', 'Cooking', 'Travel', 'Lifestyle'];
        const inferredNiche = niches.find(n => niche?.toLowerCase().includes(n.toLowerCase())) || 'AI';
        
        const ruleData: any = {
            'AI': {
                audience: [{ name: 'Developers', value: 45 }, { name: 'Early Adopters', value: 35 }, { name: 'Students', value: 20 }],
                scenarios: [
                    { title: 'AI Developer Course', type: 'Educational', revenue: 'High Impact', growth: 'Strong Fit', probability: 85 },
                    { title: 'SaaS Tool Newsletter', type: 'Product', revenue: 'Medium Impact', growth: 'Strong Fit', probability: 75 },
                    { title: 'B2B Consulting', type: 'B2B', revenue: 'High Impact', growth: 'Medium Fit', probability: 60 }
                ],
                expansion: [
                    { title: 'AI Coding Tools', desc: 'Build tools for developers. High confidence (90%) because your technical audience has high intent to buy.', match: 90, expectedRevenue: '$15k/mo', expectedGrowth: '+20%' },
                    { title: 'Prompt Engineering Guide', desc: 'Create a paid guide. Confidence 85% based on engagement with tutorials.', match: 85, expectedRevenue: '$5k/mo', expectedGrowth: '+10%' }
                ]
            },
            'Finance': {
                audience: [{ name: 'Investors', value: 50 }, { name: 'Professionals', value: 30 }, { name: 'Beginners', value: 20 }],
                scenarios: [
                    { title: 'Trading Masterclass', type: 'Educational', revenue: 'High Impact', growth: 'Strong Fit', probability: 80 },
                    { title: 'Premium Discord', type: 'Community', revenue: 'High Impact', growth: 'Strong Fit', probability: 85 },
                    { title: 'Budgeting App', type: 'Product', revenue: 'Medium Impact', growth: 'Medium Fit', probability: 65 }
                ],
                expansion: [
                    { title: 'Financial Modeling Course', desc: 'Deep dive into valuation. High confidence (88%) based on audience request.', match: 88, expectedRevenue: '$25k/mo', expectedGrowth: '+15%' },
                    { title: 'Crypto Newsletter', desc: 'Weekly market analysis. 75% confidence due to market volatility.', match: 75, expectedRevenue: '$8k/mo', expectedGrowth: '+12%' }
                ]
            }
        };

        const activeRules = ruleData[inferredNiche] || ruleData['AI'];

        return res.json({
            "_metadata": { "generatedFrom": "Rule Engine", "platform": platform },
            "creator": {
              "name": fallbackName,
              "followers": 150000,
              "monthlyRevenue": 25000,
              "engagementRate": 8.5,
              "growthScore": 87
            },
            "insight": {
              "title": "Rule-Based Insight",
              "recommendation": `Based on the ${inferredNiche} niche rules, you should focus on owned products like courses or newsletters.`,
              "confidenceScore": 95,
              "reasoning": "Determined via static fallback rules.",
              "dataSources": ["Rule Engine"]
            },
            "audience": activeRules.audience,
            "scenarios": activeRules.scenarios,
            "analytics": {
              "growth": [{ "month": "Jan", "followers": 100000 }, { "month": "Feb", "followers": 110000 }, { "month": "Mar", "followers": 125000 }, { "month": "Apr", "followers": 135000 }, { "month": "May", "followers": 142000 }, { "month": "Jun", "followers": 150000 }],
              "engagement": [{ "format": "Shorts", "rate": 12.5 }, { "format": "Reels", "rate": 8.0 }, { "format": "Long-form", "rate": 6.5 }, { "format": "Posts", "rate": 4.0 }],
              "revenue": [{ "name": "Sponsorships", "value": 45 }, { "name": "Courses", "value": 35 }, { "name": "AdSense", "value": 15 }, { "name": "Affiliates", "value": 5 }],
              "retention": [{ "time": "0%", "viewers": 100 }, { "time": "10%", "viewers": 85 }, { "time": "25%", "viewers": 60 }, { "time": "50%", "viewers": 45 }, { "time": "75%", "viewers": 30 }, { "time": "100%", "viewers": 15 }]
            },
            "oracle": {
              "perception": [
                { "subject": "Educational", "A": 95, "fullMark": 100 },
                { "subject": "Trustworthy", "A": 88, "fullMark": 100 },
                { "subject": "Technical", "A": 90, "fullMark": 100 },
                { "subject": "Entertaining", "A": 70, "fullMark": 100 },
                { "subject": "Accessible", "A": 85, "fullMark": 100 },
                { "subject": "Authoritative", "A": 92, "fullMark": 100 }
              ],
              "expansion": activeRules.expansion,
              "competitors": [
                { "name": "Top Competitor A", "gap": "Weaker technical depth", "opportunity": "High" },
                { "name": "Top Competitor B", "gap": "Less frequent uploads", "opportunity": "Medium" }
              ],
              "healthScore": {
                "score": 87,
                "text": `${fallbackName}'s brand is highly recognizable in ${inferredNiche}. Best revenue opportunity is ~$15k/mo with +20% expected growth.`
              }
            }
        });
    }
});

// Opportunities Engine
app.post('/api/opportunities', async (req, res) => {
    try {
        const model = (req.query.model as string) || 'gemini';
        const { name, niche, sourceUrl, contextData } = req.body;
        const fallbackName = name || (sourceUrl ? sourceUrl.replace(/.*@/, '').replace(/\/.*/, '') : 'Creator');

        const prompt = `You are a world-class creator monetization expert. Generate 5 unique, hyper-specific revenue opportunities for a creator.
Creator Name: ${fallbackName}
Niche: ${niche || 'General'}
URL: ${sourceUrl || 'N/A'}
${contextData ? `Raw Data: ${contextData.slice(0, 800)}` : ''}

Return ONLY a valid JSON array of 5 opportunities. No markdown. Schema:
[
  { "id": 1, "title": "string", "description": "string (2 sentences, specific to this creator. Include reasoning and confidence here.)", "type": "course|community|newsletter|sponsorship|product", "demandScore": number(60-99), "estimatedRevenue": "$Xk/mo", "timeToLaunch": "X weeks", "actionUrl": "https://...(relevant platform link)", "confidence": number, "supportingFactors": ["string"] },
  ...
]`;

        const aiRes = await callAIModel(prompt, model as any);
        const jsonMatch = aiRes.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || aiRes.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiRes;
        const data = JSON.parse(jsonStr);
        res.json(data);
    } catch (error: any) {
        console.error("Opportunities Error:", error.message);
        const { name, niche, sourceUrl } = req.body;
        const fallbackName = name || (sourceUrl ? sourceUrl.replace(/.*@/, '').replace(/\/.*/, '') : 'Creator');
        // Always return a useful fallback
        res.json([
            { id: 1, title: `${fallbackName} Masterclass`, description: `Launch a premium video course teaching your core expertise. Your audience already trusts you as an authority.`, type: 'course', demandScore: 95, estimatedRevenue: '$15k/mo', timeToLaunch: '6 weeks', actionUrl: 'https://teachable.com', confidence: 92, supportingFactors: ['High audience trust', 'Educational content demand'] },
            { id: 2, title: 'Private Community', description: `Create a paid Skool or Discord community for your top fans. Community is the highest-retention product in creator economy.`, type: 'community', demandScore: 88, estimatedRevenue: '$8k/mo', timeToLaunch: '2 weeks', actionUrl: 'https://skool.com', confidence: 85, supportingFactors: ['Strong community sentiment', 'Retention trends'] },
            { id: 3, title: 'Weekly Newsletter', description: `Launch a premium newsletter with deep-dives exclusive to paid subscribers. Low overhead, high margin.`, type: 'newsletter', demandScore: 82, estimatedRevenue: '$5k/mo', timeToLaunch: '1 week', actionUrl: 'https://beehiiv.com', confidence: 88, supportingFactors: ['High email open rates generally', 'Direct audience access'] },
            { id: 4, title: 'Brand Sponsorships', description: `Partner with brands aligned to your niche. Your engaged audience makes you highly valuable to sponsors.`, type: 'sponsorship', demandScore: 78, estimatedRevenue: '$12k/mo', timeToLaunch: '3 weeks', actionUrl: 'https://creatoriq.com', confidence: 75, supportingFactors: ['Niche specificity', 'Engagement metrics'] },
            { id: 5, title: 'Digital Templates / Tools', description: `Sell Notion templates, Figma kits, or custom tools your audience uses daily. One-time build, recurring passive income.`, type: 'product', demandScore: 72, estimatedRevenue: '$3k/mo', timeToLaunch: '2 weeks', actionUrl: 'https://gumroad.com', confidence: 80, supportingFactors: ['Passive income potential', 'Low maintenance'] }
        ]);
    }
});

// 1. Creator Brain
app.get('/api/creator/profile', async (req, res) => {
    try {
        const profile = await prisma.creatorProfile.findFirst();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.post('/api/creator/profile/generate', async (req, res) => {
    try {
        const { posts, model = 'gemini' } = req.body;
        const prompt = `Based on these posts, generate a creator profile with niche, contentStyle, expertise, personality, and audienceType. Return JSON. Posts: ${posts}`;
        const aiRes = await callAIModel(prompt, model);
        
        // Extract JSON from AI response (assuming it's formatted as markdown JSON)
        const jsonMatch = aiRes.match(/```json\n([\s\S]*)\n```/) || aiRes.match(/{[\s\S]*}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : {};

        const profile = await prisma.creatorProfile.findFirst();
        if (profile) {
            const updated = await prisma.creatorProfile.update({
                where: { id: profile.id },
                data: {
                    niche: data.niche || profile.niche,
                    contentStyle: data.contentStyle || profile.contentStyle,
                    expertise: data.expertise || profile.expertise,
                    personality: data.personality || profile.personality,
                    audienceType: data.audienceType || profile.audienceType,
                }
            });
            res.json(updated);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate profile' });
    }
});

// 2. Audience Council
app.get('/api/audience/personas', async (req, res) => {
    try {
        const personas = await prisma.audiencePersona.findMany();
        res.json(personas.map(p => ({
            ...p,
            goals: JSON.parse(p.goals),
            painPoints: JSON.parse(p.painPoints)
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch personas' });
    }
});

// 3. Creator Multiverse
app.post('/api/multiverse/simulate', async (req, res) => {
    try {
        const { action, model = 'consensus' } = req.body;
        const prompt = `Simulate the outcome of a creator doing the following action: "${action}". 
        Provide Best Case, Expected Case, and Worst Case scenarios.
        For each, provide "Revenue" (e.g. "High Impact", "Medium Impact") and "Growth" (e.g. "Strong Fit", "Weak Fit"). Do NOT provide exact monetary numbers. Provide qualitative Scenario Analysis.
        Return JSON with bestRevenue, bestGrowth, expectedRevenue, expectedGrowth, worstRevenue, worstGrowth.`;

        const aiRes = await callAIModel(prompt, model);
        
        const jsonMatch = aiRes.match(/```json\n([\s\S]*)\n```/) || aiRes.match(/{[\s\S]*}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : {
            bestRevenue: 'High Impact', bestGrowth: 'Strong Fit',
            expectedRevenue: 'Medium Impact', expectedGrowth: 'Medium Fit',
            worstRevenue: 'Low Impact', worstGrowth: 'Weak Fit'
        };

        res.json({ action, ...data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to simulate' });
    }
});


// 5a. Brand Oracle Expansion Ideas (model-specific, live-refresh)
app.post('/api/oracle/expansion', async (req, res) => {
    try {
        const { model = 'gemini', creatorName = 'Creator', niche = 'General', sourceUrl = '', contextData = '' } = req.body;
        const urlText = sourceUrl ? `Target URL: ${sourceUrl}` : '';
        const rawText = contextData ? `Analytics Context: ${contextData}` : '';
        const prompt = `You are ${model}, an elite creator economy strategist with a unique analytical perspective.
Creator: ${creatorName}, Niche: ${niche}
${urlText}
${rawText}

Based on your unique ${model} perspective and the creator's profile, generate 3 brand expansion ideas.
Each idea should reflect YOUR model's specific analytical style and priorities:
- gemini: Focus on scale, trend analysis, and data-driven opportunities
- claude: Focus on creative depth, audience psychology, and community-first approaches  
- gpt4: Focus on market gaps, monetization sequences, and business model innovation
- hybrid: Combine all perspectives for the most comprehensive view

Return ONLY a valid JSON array:
[
  { "title": "string", "desc": "string (2 sentences. Include confidence % and reasoning specific to your model perspective.)", "match": number (0-100), "expectedRevenue": "$Xk/mo", "expectedGrowth": "+X%" },
  { "title": "string", "desc": "string", "match": number, "expectedRevenue": "$Xk/mo", "expectedGrowth": "+X%" },
  { "title": "string", "desc": "string", "match": number, "expectedRevenue": "$Xk/mo", "expectedGrowth": "+X%" }
]
No markdown. Raw JSON only.`;

        const aiRes = await callAIModel(prompt, model);
        const jsonMatch = aiRes.match(/```json\n([\s\S]*)\n```/) || aiRes.match(/\[[\s\S]*\]/);
        const data = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : [
            { title: 'Premium Course', desc: `High-confidence opportunity (90%) for ${creatorName}. Your audience has strong purchase intent for structured learning.`, match: 90, expectedRevenue: '$15k/mo', expectedGrowth: '+20%' },
            { title: 'Brand Partnerships', desc: `Strong match (80%) based on ${niche} audience demographics and engagement quality.`, match: 80, expectedRevenue: '$10k/mo', expectedGrowth: '+12%' },
            { title: 'Community Platform', desc: `Emerging opportunity (72%) driven by high comment engagement indicating desire for deeper connection.`, match: 72, expectedRevenue: '$6k/mo', expectedGrowth: '+15%' },
        ];
        res.json(data);
    } catch (error) {
        console.error('Oracle expansion error:', error);
        res.json([
            { title: 'Premium Course', desc: 'High-confidence expansion into structured education. Your audience trusts you as an authority.', match: 88, expectedRevenue: '$12k/mo', expectedGrowth: '+18%' },
            { title: 'Community Platform', desc: 'Build a private community for your most engaged followers. Strong fit based on engagement signals.', match: 78, expectedRevenue: '$7k/mo', expectedGrowth: '+14%' },
            { title: 'Brand Collaborations', desc: 'Partner with complementary brands. High demand from your niche-specific audience.', match: 72, expectedRevenue: '$9k/mo', expectedGrowth: '+10%' },
        ]);
    }
});

// 5. Brand Oracle Chat
app.post('/api/oracle/chat', async (req, res) => {
    try {
        const { question, context, model = 'gemini' } = req.body;
        
        const urlText = context.sourceUrl ? `Target URL: ${context.sourceUrl}` : '';
        const rawDataText = context.contextData ? `Raw Analytics Context:\n${context.contextData}` : '';

        const prompt = `You are an elite Creator Economy AI Advisor.
Creator Context: Name: ${context.name}, Niche: ${context.niche}
${urlText}
${rawDataText}

The creator asks: "${question}"

Provide a strategic, actionable answer leveraging their specific URL context or raw data if provided.
Return ONLY a valid JSON object matching this exact structure: { "recommendation": "string", "confidenceScore": number, "projectedRevenue": "string", "risks": ["string"], "reasoning": "string", "supportingFactors": ["string"] }`;

        const aiRes = await callAIModel(prompt, model);
        
        const jsonMatch = aiRes.match(/```json\n([\s\S]*)\n```/) || aiRes.match(/{[\s\S]*}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : {
            recommendation: "Focus on building your core audience first before launching a paid course.",
            confidenceScore: 85,
            projectedRevenue: "₹50k/month initially",
            risks: ["Audience burnout", "High competition"],
            reasoning: "Audience engagement shows strong preference for free content.",
            supportingFactors: ["Historical performance", "Audience size"]
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to chat with Oracle' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
