import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // або встав свій ключ прямо для тесту
});

export const generateAiRes = async (req, res) => {

  try {
    const {message} = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await openai.chat.completions.stream({
      model: "gpt-4.1-mini",
      input: message,
    })

    // for await (const event of stream) {
    //   if (event.type === "output_text.delta") {
    //     res.write(JSON.stringify({ response: event.delta }) + "\n");
    //   }
    // }

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(JSON.stringify({ response: content }) + "\n");
      }
    }

    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.end();
  }

}