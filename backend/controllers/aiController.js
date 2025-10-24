// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const generateAiRes = async (req, res) => {

//   try {
//     const {message} = req.body;
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");
//     res.flushHeaders();

//     const stream = openai.chat.completions.create({
//       model: "gemini 2.5 flash",
//       input: message,
//     })

//     for await (const chunk of stream) {
//       const content = chunk.choices[0]?.delta?.content;
//       if (content) {
//         res.write(JSON.stringify({ response: content }) + "\n");
//       }
//     }

//     res.end();
//   } catch (error) {
//     console.error("Streaming error:", error);
//     res.end();
//   }

// }

import {GoogleGenAI} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function generateAiStream(req, res) {
  try {
    const {message} = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const streamRes = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: message,
    });

  
    // const candidate = streamRes.candidates?.[0];
    // if(candidate && candidate.content?.parts){
      for await (const chunk of streamRes) {
        if (chunk) {
          const words = chunk.text.split(' ');
          for (const word of words) {
            res.write(JSON.stringify({ response: `${word} ` }) + "\n");
          }
          
        }
    }


    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(JSON.stringify({ error: error.message }) + "\n");
    res.end();
  }

  // console.log(response.text);
}

export const generateAiName = async (req, res) => {
  try {
    const {message} = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    const candidate = response.candidates?.[0];
    let text = "";

    if (candidate?.content?.parts?.length) {
      text = candidate.content.parts.map(p => p.text).join("");
    }
    
    console.log('Gemini raw response:', response);
    res.json({ response: text });
  } catch (error) {
    console.error("ai name error:", error);
    res.status(500).json({ error: error.message });
  }
}

