import { EXPO_PUBLIC_GIMINI_API_KEY } from '@env';
import {
    GoogleGenerativeAI
} from "@google/generative-ai";

const apiKey = "AIzaSyDZ6wr0LUBofm7LvhZHvLald_XucayfFiA";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const GenerateTopicsAImodel = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Learn Python : :As your are coaching teacher\n- User want to learn about the topic\n- Generate 5-7 Course title for study (Short)\n- Make sure it is related to description\n- Output will be ARRAY of string in JSON FORMAT only\n- Do not add any plain text in output," },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n{\n  \"course_titles\": [\n    \"Python Basics: A Beginner's Guide\",\n    \"Data Structures & Algorithms in Python\",\n    \"Object-Oriented Programming with Python\",\n    \"Web Development with Python (Flask/Django)\",\n    \"Data Science & Machine Learning with Python\",\n    \"Python for Automation & Scripting\",\n    \"Advanced Python: Concurrency & Async\"\n  ]\n}\n```\n" },
            ],
        },
    ],
});
export const GenerateCourseAImodel = model.startChat({
    generationConfig,
    history: [

    ]
});

export const chatbot = model.startChat({
    generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    },
    history: []
})
