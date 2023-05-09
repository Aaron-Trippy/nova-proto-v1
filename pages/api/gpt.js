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
