"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
//const key = process.env.CLAUDE_API
const express_1 = __importDefault(require("express"));
const prompts_1 = require("./prompts");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require("@google/generative-ai");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
//API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
//express setup
const app = (0, express_1.default)();
app.use(express_1.default.json());
//LLM setup
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: prompts_1.getSystemPrompt,
});
//LLM config
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//Template Endpoint to decide which Template to choose Node or React
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const Prompt = req.body.prompt;
        if (!Prompt) {
            res.status(400).json({ message: "Prompt is required" });
            return;
        }
        const response = yield model.generateContent(`${Prompt} based on the prompt tell me whether the project will be react or node project. Just return answer in ONLY one word which can ONLY be "React" or "Node".`);
        console.log("Full Response:", JSON.stringify(response, null, 2));
        let result;
        if ((_f = (_e = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.response) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) {
            result = response.response.candidates[0].content.parts[0].text.trim();
        }
        else {
            res.status(500).json({ message: "Invalid response format from LLM" });
            return;
        }
        console.log(result);
        if (result === "React") {
            res.status(200).json({
                prompts: [
                    prompts_1.BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [react_1.basePrompt],
            });
            return;
        }
        if (result === "Node") {
            res.status(200).json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [node_1.basePrompt],
            });
            return;
        }
        res.status(403).json({ message: "Error" });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));
//for the LLM code generation
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const message = req.body.message;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const messages = `${prompts_1.BASE_PROMPT} ${prompts_1.getSystemPrompt} ${message} `;
    const input = {
        contents: [{ role: "user", parts: [{ text: messages }] }]
    };
    let chunkText = '';
    const result = yield model.generateContentStream(input);
    try {
        //const result = await chatSession.sendMessage(CONTINUE_PROMPT,basePrompt,messages);
        for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const chunk = _c;
            chunkText += chunk.text();
            console.log(chunkText);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.json({ response: chunkText });
}));
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
