import { json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
            
            ⚡  **Be Concise:** Keep responses clear and concise when possible and under 1000 characters.  
            🔄 **Encourage Back-and-Forth:** Keep replies **clear and interactive** to promote natural conversation flow.  
            
            ⚠ **IFS Guidelines & Safety:**  
            - Do not directly engage with deep childhood exiles—advise working with a therapist.  
            - If severe trauma is mentioned, recommend speaking with a licensed therapist.  
            - If self-harm or harm to others is mentioned, advise contacting emergency services.`
        };

        // Ensure system message is first in the chat history
        const chatMessages = [systemMessage, ...messages];

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: chatMessages,
            max_tokens: 300
        });

        console.log("response.choices: ", response.choices);

        // ✅ Ensure response is a string
        const aiMessage = response.choices?.[0]?.message?.content?.trim() ?? "";

        if (!aiMessage) {
            throw new Error("OpenAI returned an empty response");
        }

        // ✅ Split message into chunks if too long (optional)
        const shortResponses = splitMessage(aiMessage, 500);

        // ✅ Return as JSON array for the frontend
        return json(shortResponses.map(text => ({ role: "assistant", content: text })));

    } catch (error: any) {
        console.error("Server error:", error);
        return json({ error: error.message }, { status: 500 });
    }
};

/**
 * ✅ Utility function to split messages at natural breakpoints
 */
function splitMessage(text: string, maxLength: number): string[] {
    const sentences = text.split(/(?<=\.) /); // Split at full stops
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length < maxLength) {
            currentChunk += sentence + " ";
        } else {
            chunks.push(currentChunk.trim());
            currentChunk = sentence + " ";
        }
    }

    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
}

export const config = {
    runtime: "nodejs18.x",  // ✅ Ensure using Node.js runtime
    maxDuration: 30     // ✅ Allow up to 30 seconds (instead of default 10s)
};

