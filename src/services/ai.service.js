
const Groq = require('groq-sdk');


const groq = new Groq({
     apiKey: process.env.GROQ_API_KEY 
    });



async function getAIResponse(prompt) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
           
            model: "llama-3.1-8b-instant", 
        });

        return chatCompletion.choices[0]?.message?.content || "Existing with blank response.";

    } catch (error) {
        console.error(" Groq Service Error:", error);
        return "API call failed.";
    }
}

async function getChatSummary(chatHistory) {
    try {
        const prompt = `
        You are a smart assistant. Summarize the following discord chat conversation in 3-4 bullet points. 
        Keep it funny and casual (Hinglish preferred).
        
        Chat History:
        ${chatHistory}
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gemma2-9b-it",
        });

        return chatCompletion.choices[0]?.message?.content || "Error generating Summary.";
    } catch (error) {
        console.error("Summary Error:", error);
        return "Error generating Summary.";
    }
}


module.exports = { getAIResponse, getChatSummary };