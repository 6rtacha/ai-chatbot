import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAIResponse = async (prompt: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I'm not sure how to respond to that."
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get response from AI service");
  }
};
