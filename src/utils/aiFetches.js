// import { addMessage } from "./fetches"
import OpenAI from 'openai';

export const generateRes = async (message, signal, stream) => {
  const res = await fetch("http://localhost:11434/api/generate",{
  method: "POST",
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    model: "gpt-oss:120b-cloud",
    prompt: message,
    stream
  }),
  signal
})
  if (stream) {
    // Якщо хочемо потокову відповідь, просто повертаємо res
    return res;
  } else {
    const data = await res.json().catch(err => ({error: err.message}));
    if (!res.ok) {
      console.error("Server error:", data);
    }
    return data;
  }

 
  
}

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // або встав свій ключ прямо для тесту
// });
// export const generateAiRes = async (message) => {
//   const res = await openai.responses.create({
//     model: "gpt-4.1-mini",
//     input: message,
//   })
//   console.log(res.output[0].content[0].text)
//   return res.output[0].content[0].text;
// }

export async function generateAiRes(message, signal) {
  const res = await fetch('/api/ai', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    signal
  });
// const text = await res.text(); // temporarily get raw text
// console.log(text);
return res;
}