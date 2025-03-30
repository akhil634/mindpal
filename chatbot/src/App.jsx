import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Initialize Gemini AI SDK
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fetchResponse = async () => {
    try {
      const result = await model.generateContent(input);
      const textResponse = await result.response.text();
      setResponse(textResponse || "No response from AI.");
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error fetching response. Please try again.");
    }
  };

  return (
    <div>
      <h1>MindPal AI Chatbot</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={fetchResponse}>Send</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default App;
