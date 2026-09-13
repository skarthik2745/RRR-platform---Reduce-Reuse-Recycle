import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateResponse(userMessage: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are EcoAI, a friendly environmental companion chatbot for the RRR (Reduce-Reuse-Recycle) platform. 
          
          Your role:
          - Help users with sustainability questions
          - Provide eco-friendly tips and advice
          - Answer questions about reducing waste, reusing items, and recycling
          - Give practical, actionable environmental solutions
          - Be encouraging and supportive about eco-friendly lifestyle changes
          
          Keep responses concise (2-3 sentences max), friendly, and focused on practical environmental advice.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 150
    });

    return chatCompletion.choices[0]?.message?.content || "I'm here to help with sustainability questions!";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble connecting right now. Please try again later!";
  }
}