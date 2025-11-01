// import { addMessage } from "./fetches"
import { authFetch } from './authFetches';
const API_URL = import.meta.env.VITE_BACKEND_URL;

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
//     model: "gemini-2.5-flash",
//     input: message,
//   })
//   console.log(res.output[0].content[0].text)
//   return res.output[0].content[0].text;
// }

export async function generateAiClientStream(message, signal) {
  const res = await authFetch(`${API_URL}/ai/stream`, {
    method: "POST",
    body: JSON.stringify({ message }),
    signal
  }, true);
// const text = await res.text(); // temporarily get raw text
// console.log(text);
return res;
}

export async function generateAiName(input, signal) {
  const message = `what is the topic (1-3 words): ${input}`;
  const res = await authFetch(`${API_URL}/ai/chatname`, {
    method: "POST",
    body: JSON.stringify({ message }),
    signal
  });
// const text = await res.text(); // temporarily get raw text
// console.log(text);
return res;
}