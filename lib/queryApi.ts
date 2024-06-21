import { OpenAIError } from "openai";
import openai from "./chatgpt";

const query = async (prompt: string, chatId: string, model: string) => {
    try{
        const res = await openai.completions.create({
            model,    
            prompt,
            temperature: 0.9, // To tweak the creativity of the model
            top_p: 1, // Top-p is a probability mass. Probability is 0.0-1.0 1.00 = 100% of all token logits can be selected from. There's nothing higher than “all”. 0 is technically not allowed, as that would exclude all tokens, so it just represents a small value in practice. Think of it as a measure of how much of the total possibilities you're considering. Imagine you're picking fruits, and "top-p" helps you decide how many different types of fruits to consider from all available types.
            max_tokens: 1000, // The maximum number of tokens (words or parts of words) the AI can generate in one response.
            frequency_penalty: 0, // A setting that reduces the likelihood of the AI repeating the same token (word or phrase) within the generated text.
            presence_penalty: 0, // A setting that encourages the AI to include new tokens that haven't appeared yet in the generated text.
        });
        return res.choices[0].text;
        } catch (err) {
            console.error(`OpenAI API error: ${err}`);
            if (err instanceof OpenAIError) {
                return `Sorry man, I got nothing. (Error: ${err.message})`;
            } else {
                return `Sorry man, an unexpected error occurred.`;
            }
        }
    };

export default query;