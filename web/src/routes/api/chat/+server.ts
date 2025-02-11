import { json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";

export const config = {
    maxDuration: 60
  };

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        console.log('API Chat endpoint hit');
        const { messages } = await request.json();

        // Ensure the system message is always included
        const systemMessage = {
            role: "system",
            content: `
            You are an Internal Family Systems (IFS) therapist.
            Your goal is to help the user explore their inner parts (like Protectors, Firefighters, and Exiles) with compassion.
            Ask gentle, open-ended questions to guide them in understanding their parts' emotions, fears, and needs.
            Encourage curiosity rather than judgment. Keep your responses warm, non-directive, and trauma-informed.
        
            ⚡ **Key Objective:**
            - When the user describes a part (e.g., its emotions, role, fears, or needs), take note of it as a "potential part."
            - Once the user has identified or worked with the part, ask:
                "Would you like me to save this part to your Notes?"
            - If yes, guide the user to confirm the part's name, type, qualities, and relationships.
        
            ⚙ **Process for Saving a Part:**
            1. When the user confirms saving, ask:
                - "What would you like to call this part?" (Suggest names if they are unsure.)
                - "Would you like to assign this part a color?" (Suggest a color if needed.)
            2. Confirm the part's details:
                - Summarize the part's qualities, fears, and relationships.
                - Ask: "Does this look correct to you?"
            3. Once confirmed, generate a JSON object with the following structure:
            {
                "name": "<part_name>",
                "color": "<color>",
                "type": "<type>", // protector, firefighter, exile
                "location": "<location>" // head, shoulder, stomach, chest
                "qualities": ["<quality1>", "<quality2>"],
                "relationships": ["<relationship1>", "<relationship2>"]
            }
            Return the JSON object as part of the response so the frontend can save it.
            In your language to the user, don't mention the JSON object.
            Just say that this part is now saved to their notes and that they can click on it below to view it.
        
            ⚠ **IFS Guidelines & Safety:** 
            - Do not directly engage with deep childhood exiles—advise working with a therapist.  
            - If severe trauma is mentioned, recommend speaking with a licensed therapist.  
            - If self-harm or harm to others is mentioned, advise contacting emergency services.
        
            Keep responses concise, interactive, and trauma-informed, ensuring user safety and privacy.
            `
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
        console.log("shortResponses: ", shortResponses)

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
    let chunks: string[] = [];

    // ✅ 1️⃣ Capture introduction text before a list (if any)
    let match = text.match(/^(.*?)(?=\n\d+\.)/s); // ✅ Capture everything before "1."
    if (match && match[1].trim()) {
        chunks.push(match[1].trim()); // ✅ Add introduction as its own message
    }

    // ✅ 2️⃣ Capture numbered list items individually
    let numberedListItems = text.match(/\d+\..+?(?=\n\d+\.|\n*$)/gs);
    if (numberedListItems) {
        chunks.push(...numberedListItems.map(item => item.trim())); // ✅ Each number stays in its own message
    } else {
        // ✅ 3️⃣ If no numbered list, fall back to sentence-based splitting
        let sentences = text.split(/(?<!\d)\. /);
        let currentChunk = "";

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length < maxLength) {
                currentChunk += sentence + ". ";
            } else {
                chunks.push(currentChunk.trim());
                currentChunk = sentence + ". ";
            }
        }

        if (currentChunk.trim()) chunks.push(currentChunk.trim());
    }

    return chunks;
}
