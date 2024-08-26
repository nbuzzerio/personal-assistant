const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
});

async function openAIResponse(query) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: query }],
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
  });
  return chatCompletion;
}

module.exports = openAIResponse;
