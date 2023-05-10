import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

export default function askGpt() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const [chat, setChat] = useState([]);

  const config = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_APIKEY,
    headers: {
      "User-Agent": "Brrilliant/0.8 Beta (OpenAI API Client)",
    },
  });

  const openai = new OpenAIApi(config);

  async function askAi(prompt) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "My name is Nova. I am your AI virtual assistant and I am here to help you. You can ask me anything and I will always respond in a polite and helpful manner while providing the best, most accurate answer possible. Your messages should be no longer than 3 sentences unless absolutely necessary. Keep responses brief and to the point while maintaining their integrity.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return completion.data.choices[0].message.content;
  }

  return {
    askAi,
    prompt,
    setPrompt,
    response,
    setResponse,
    setChat,
    chat,
  };
}
