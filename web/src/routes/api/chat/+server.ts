import { json, type RequestHandler } from '@sveltejs/kit';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY
});

function splitMessage(content: string, maxLength: number = 140): string[] {
    if (content.length <= maxLength) return [content];

    let sentences = content.match(/[^.!?]+[.!?]/g) || [content]; // ✅ Split at sentence boundaries
    let parts = [];
    let currentPart = "";

    for (let sentence of sentences) {
        if ((currentPart + " " + sentence).length > maxLength) {
            parts.push(currentPart.trim());
            currentPart = sentence;
        } else {
            currentPart += " " + sentence;
        }
    }
    parts.push(currentPart.trim());
    return parts;
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { messages } = await request.json();

        // Ensure the system message is always included
        const systemMessage = {
            role: "system",
            content: `You are an Internal Family Systems (IFS) therapist.
            Your goal is to help the user explore their inner parts (like Protectors, Firefighters, and Exiles) with compassion.
            Ask gentle, open-ended questions to guide them in understanding their parts' emotions, fears, and needs.
            Encourage curiosity rather than judgment. Keep your responses warm, non-directive, and trauma-informed.
            Follow IFS best practices and give IFS-centered suggestions for exercises when needed.
            
            ⚡  **Be Concise:** Keep responses clear and concise when possible.  
            🔄 **Encourage Back-and-Forth:** Keep replies **clear and interactive** to promote natural conversation flow.  
            
            ⚠ **IFS Guidelines & Safety:**  
            - Do not directly engage with deep childhood exiles—advise working with a therapist.  
            - If severe trauma is mentioned, recommend speaking with a licensed therapist.  
            - If self-harm or harm to others is mentioned, advise contacting emergency services.`
        };

        // Ensure system message is first in the chat history
        const chatMessages = [systemMessage, ...messages];

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: chatMessages
        });

        // ✅ Ensure response is a string, or default to an empty message
        const aiMessage = response.choices?.[0]?.message?.content ?? "";

        if (!aiMessage) {
            throw new Error("OpenAI returned an empty or null response");
        }

        // ✅ Now safely split the message
        const shortResponses = splitMessage(aiMessage, 500);

        // ✅ Return them as separate responses
        return json(shortResponses.map(text => ({ role: "assistant", content: text })));

    } catch (error: any) {
        console.error("Server error:", error);
        return json({ error: error.message }, { status: 500 });
    }
};

