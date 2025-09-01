import { GoogleGenAI, Type } from "@google/genai";
import { SocialProvider, ChatMessage } from '../types';

// IMPORTANT: In a real application, the API key must be handled securely
// and not exposed on the client-side. This is a placeholder.
// The key is expected to be in the environment variable `process.env.API_KEY`.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI tools will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const callGemini = async (prompt: string, isJson: boolean = false): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("AI functionality is disabled. Please configure your API key.");
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.95,
                responseMimeType: isJson ? "application/json" : "text/plain",
                maxOutputTokens: 1024,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `An error occurred while generating content: ${error.message}`;
        }
        return "An unknown error occurred while generating content.";
    }
};

export const getAIAssistantReply = async (query: string, history: ChatMessage[], currentPage: string): Promise<string> => {
    const formattedHistory = history
        .slice(-4) // Get last 4 messages for context
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join('\n');

    const systemPrompt = `You are Orbit AI, a helpful and friendly assistant for the "Orbit" social media management platform. 
    Your goal is to help users by answering their questions about the app, offering social media strategy tips, and providing guidance.

    The user is currently on the "${currentPage}" page of the Orbit app. Use this context to provide relevant answers.
    Keep your responses concise, helpful, and use Markdown for formatting if it improves readability.

    Here is the recent conversation history:
    ${formattedHistory}
    
    Now, answer the user's latest message.
    user: ${query}`;

    return callGemini(systemPrompt);
};

export const generateCaption = async (prompt: string, tone: string, platform: string, brandVoice?: string): Promise<string> => {
    const brandVoiceInstruction = brandVoice ? `
    Your writing style MUST adhere to the following Brand Voice Profile:
    ---
    ${brandVoice}
    ---
    ` : 'Your writing style should be engaging and clear.';

    const fullPrompt = `You are a social media expert creating a caption for the ${platform} platform.
    ${brandVoiceInstruction}
    The tone should be ${tone}.
    The topic is: "${prompt}".
    
    Provide only the caption text, without any introductory phrases like "Here is a caption:".`;
    return callGemini(fullPrompt);
};

export const rewriteCaption = async (caption: string, style: string): Promise<string> => {
    const fullPrompt = `You are an expert social media copywriter. Rewrite the following caption to be "${style}".
    
    Original Caption: "${caption}"

    Provide only the rewritten caption text.`;
    return callGemini(fullPrompt);
}

export const generateHashtags = async (topic: string, platform: string): Promise<string> => {
    const fullPrompt = `Generate a list of relevant and effective hashtags for a social media post on ${platform}.
    The topic of the post is: "${topic}".
    Provide a mix of popular, niche, and specific hashtags.
    Return the hashtags as a single line of space-separated text (e.g., #hashtag1 #hashtag2 #hashtag3).
    Do not include any other text or explanation.`;
    return callGemini(fullPrompt);
};

export const generateContentIdeas = async (topic: string, platform: string): Promise<string> => {
    const fullPrompt = `You are a creative social media content strategist.
    Generate a list of 5 engaging and creative content ideas for the ${platform} platform based on the following topic: "${topic}".
    For each idea, provide a catchy title and a brief description of the content.
    Present the ideas in a numbered list format using Markdown.`;
    return callGemini(fullPrompt);
};

export const trainBrandVoice = async (posts: string): Promise<string> => {
    const fullPrompt = `You are a branding expert. Analyze the following social media posts to create a "Brand Voice Profile".
    
    Posts:
    ---
    ${posts}
    ---
    
    Based on the posts, determine the following:
    - Tone (e.g., Humorous, Formal, Inspirational)
    - Personality (e.g., Witty, Authoritative, Friendly)
    - Common Phrases or Emojis used
    - Key Themes or Topics
    
    Summarize your findings in a concise "Brand Voice Profile" using Markdown.`;
    return callGemini(fullPrompt);
}

export const generateProposal = async (client: string, scope: string, price: string): Promise<string> => {
    const fullPrompt = `You are an assistant for a social media marketing agency.
    Generate a professional but friendly proposal for a new client.
    
    Client Name: ${client}
    Project Scope: ${scope}
    Total Price: $${price}
    
    The proposal should include a brief introduction, a summary of services based on the scope, the pricing, and a call to action. Format it using Markdown.`;
    return callGemini(fullPrompt);
}

export const generateSupportReply = async (subject: string, message: string): Promise<string> => {
    const fullPrompt = `You are an expert customer support agent for "Orbit", a social media management platform.
    A user has submitted a support ticket. Your goal is to provide a helpful, empathetic, and professional response.

    Ticket Subject: "${subject}"
    Ticket Message: "${message}"

    Based on the ticket, draft a suitable reply. Address the user's issue, offer a solution or next steps, and maintain a positive tone.
    Provide only the reply text.`;
    return callGemini(fullPrompt);
};

export const generateSmartReply = async (message: string): Promise<string> => {
     const fullPrompt = `You are an AI assistant helping a social media manager reply to a message. The goal is to be helpful and engaging.
    
    Analyze the following message and generate exactly three distinct reply suggestions: a positive/enthusiastic one, a neutral/informative one, and a short/quick one.
    
    Message: "${message}"
    
    Return the suggestions as a JSON object with the keys "positive", "neutral", and "quick".
    
    Example response format:
    {
      "positive": "We're so glad you love it! 🎉 It will be available next week!",
      "neutral": "Thank you for your interest. The product is scheduled for release next week.",
      "quick": "Next week! Stay tuned!"
    }`;
    return callGemini(fullPrompt, true);
};

export const fetchTrendRadar = async (niche: string, platform: SocialProvider): Promise<string> => {
    const fullPrompt = `You are an AI Trend Spotter for social media.
    Analyze the current trends for the "${niche}" niche on the ${platform} platform.
    
    Provide a report covering the top 2-3 trends in each of the following categories:
    - Trending Hashtags
    - Trending Sounds/Audio
    - Trending Content Formats (e.g., "Day in the life" videos, "Point of view" content)
    
    For each trend, give its name and a brief description of why it's popular.
    Format the response using Markdown with clear headings for each category.`;
    return callGemini(fullPrompt);
};

export const buildAudiencePersona = async (analyticsData: string): Promise<string> => {
    const fullPrompt = `You are a data analyst and marketing strategist.
    Based on the following (mock) social media analytics data, create a detailed "Ideal Follower Persona".

    Analytics Data Summary:
    ---
    ${analyticsData}
    ---

    Your persona should be a fictional individual that represents the core audience. Include the following sections, and be creative and descriptive:
    - **Name & Photo:** (Just suggest a name, e.g., "Marketing Maya")
    - **Demographics:** (Age, Location, Occupation, Income Level)
    - **Goals & Motivations:** (What are they trying to achieve?)
    - **Pain Points & Challenges:** (What problems do they face that our content can solve?)
    - **Watering Holes:** (What other social media accounts, blogs, or websites do they frequent?)
    - **A Quote:** A short quote that summarizes their perspective.

    Format the entire response using Markdown.`;
    return callGemini(fullPrompt);
};

export const generateSEOTips = async (topic: string, content: string, platform: string): Promise<string> => {
    let platformSpecificInstructions = '';
    switch (platform) {
        case SocialProvider.YouTube:
            platformSpecificInstructions = `- **Title Keywords:** Suggest 3-5 high-traffic keywords.\n- **Description Optimization:** Write a compelling, keyword-rich video description.\n- **Video Tags:** Provide a comma-separated list of 10-15 relevant video tags.`;
            break;
        case SocialProvider.Instagram:
            platformSpecificInstructions = `- **Hashtag Strategy:** Provide 15-20 relevant hashtags.\n- **Caption Hook:** Suggest 2-3 engaging opening lines.\n- **Call-to-Action (CTA):** Recommend a clear and effective CTA.\n- **Alt Text:** Suggest a descriptive alt text.`;
            break;
        default:
             platformSpecificInstructions = `- **Headline/Title:** Suggest compelling headlines.\n- **Hashtags:** Provide relevant hashtags.\n- **Call-to-Action:** Recommend a clear CTA.`;
    }

    const fullPrompt = `You are an expert social media SEO strategist. Analyze the following post details for ${platform} and provide actionable SEO recommendations.

**Topic:** "${topic}"
**Content:** "${content}"

Provide expert suggestions for:
${platformSpecificInstructions}

Format your response using Markdown for clear readability.`;
    return callGemini(fullPrompt);
};
