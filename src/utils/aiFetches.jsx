// import { addMessage } from "./fetches"

export const generateRes = async (message, signal) => {
  const res = await fetch("http://localhost:11434/api/generate",{
  method: "POST",
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    model: "gemma:2b",
    prompt: message
  }),
  signal
})
return res;
}