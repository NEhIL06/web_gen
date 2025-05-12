require("dotenv").config();
import cors from "cors";
//const key = process.env.CLAUDE_API
import express,{ Request,response,Response} from "express";
import { getSystemPrompt,BASE_PROMPT,CONTINUE_PROMPT} from "./prompts";
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");  
import fs from "fs";
import { basePrompt, basePrompt as NodeBasePrompt } from "./defaults/node";
import { basePrompt as ReactBasePrompt } from "./defaults/react";
//API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
//express setup
const app = express(); 
app.use(express.json());

  //LLM setup
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: getSystemPrompt,
});
  //LLM config
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};  

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

  //Template Endpoint to decide which Template to choose Node or React
  app.post("/template", async (req, res) => {
      try {
        const Prompt: string = req.body.prompt;
    
        if (!Prompt) {
          res.status(400).json({ message: "Prompt is required" });
          return;
        }
    
        const response = await model.generateContent(
          `${Prompt} based on the prompt tell me whether the project will be react or node project. Just return answer in ONLY one word which can ONLY be "React" or "Node".`
        );
    
        console.log("Full Response:", JSON.stringify(response, null, 2));
    
        let result: string | undefined;
        if (response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          result = response.response.candidates[0].content.parts[0].text.trim();
        } else {
          res.status(500).json({ message: "Invalid response format from LLM" });
          return;
        }
    
        console.log(result);
    
        if (result === "React") {
          res.status(200).json({
            prompts: [
              BASE_PROMPT,
              `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [ReactBasePrompt],
          });
          return;
        }
    
        if (result === "Node") {
          res.status(200).json({
            prompts: [
              `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${NodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [NodeBasePrompt],
          });
          return;
        }
    
        res.status(403).json({ message: "Error" });
      } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    });
    

  //for the LLM code generation
app.post("/chat", async (req,res) => {

  const message = req.body.message;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const messages = `${BASE_PROMPT} ${getSystemPrompt} ${message} `;
  const input = {
    contents: [{ role: "user", parts: [{ text: messages }] }]
  };
  let chunkText = '';
  const result = await model.generateContentStream(input);
  //const result = await chatSession.sendMessage(CONTINUE_PROMPT,basePrompt,messages);
  for await (const chunk of result.stream) {
    chunkText += chunk.text();
    console.log(chunkText);
  }

  res.json({response : chunkText});
  
  
});


app.listen(3000);
// async function main() {
//   const chat = await model.generateContent({
//     contents: [
//         {
//           role: 'user',
//           parts: [
//             {
//               text: "Explain how AI works",
//             }
//           ],
//         }
//     ],
//     generationConfig: {
//       maxOutputTokens: 1000,
//       temperature: 0.1,
//     }
// });
//     let result = await chat.sendMessageStream(`generate a simple code for todo web app and and foramtiing text like backticks for indetify the code`);
//     for await (const chunk of result.stream) {
//       const chunkText = chunk.text();
//       function removeCodeBlockMarkers(text: string): string {
//         // Use regular expressions for robust removal
//         text = text.replace(/```(?:json)?\n?/g, ""); // Remove opening markers (global replace)
//         text = text.replace(/```/g, ""); // Remove closing markers (global replace)
//         return text.trim(); // Remove leading/trailing whitespace
//     }
    
//     const completion = removeCodeBlockMarkers(chunkText);
//       process.stdout.write(completion);
//     }
// }

// main();