import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../supabaseClient";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [userEmail, setUserEmail] = useState("Loading...");
  const [userId, setUserId] = useState(null); // Store user ID
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }
        setUserEmail(session.user.email);
        setUserId(session.user.id);
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const isMentalHealthQuestion = (text) => {
    const keywords = ["stress", "anxiety", "depression", "mental health", "emotions", "therapy"];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const fetchResponse = async () => {
    if (!isMentalHealthQuestion(input)) {
      setResponse("I'm here to support mental health topics. Please ask about stress, emotions, or mindfulness.");
      return;
    }

    try {
      const result = await model.generateContent(input);
      const textResponse = await result.response.text();
      setResponse(textResponse || "No response from AI.");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from("search_history").insert([
        { user_id: session.user.id, prompt: input, response: textResponse }
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error fetching response. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {userEmail}!</h2>
      <button onClick={handleLogout}>Logout</button>
      <h1>MindPal AI Chatbot</h1>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something about mental health..."
      />
      <button onClick={fetchResponse}>Send</button>
      <p><strong>Response:</strong> {response}</p>
    </div>
  );
}

export default App;
