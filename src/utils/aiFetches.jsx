import { addMessage } from "./fetches";

  export const fetchRes = async (message, curBodId, chatId) => {
    const newController = new AbortController();
    setController(newController);
    setLoading(true);
    try {
    const res = await generateRes(message, newController.signal);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      let chunk = decoder.decode(value, { stream: true });

      chunk = chunk
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line).response)
        .join('');

      fullText += chunk;
      setMessages(prev => 
        prev.map((msg) => {

         return msg.id === curBodId?
          {...msg, message: (msg.message || '') + chunk, loading: true}
          : msg
        }))
    }

    setMessages((prev) =>
      prev.map((msg) =>{

        return msg.id === curBodId ? { ...msg, message: fullText, loading: false } : msg
      }));

    await addMessage(chatId, "robot", fullText, curBodId, true);
    console.log('Bot повідомлення збережено для chatId:', chatId);
    return fullText;

    } catch (error) {
      
      if(error.name === "AbortError"){
        console.log("canceled fetch");
        return;
      }
      console.log('error in fetching '+ error);
    } finally{
      setLoading(false);
      setController(null);
    }
  }

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