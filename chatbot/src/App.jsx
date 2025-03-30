import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../supabaseClient";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [userEmail, setUserEmail] = useState("Loading...");
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Check authentication session and fetch user email
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login"); // Redirect to login if no active session
          return;
        }
        setUserEmail(session.user.email);
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/login"); // Redirect to login on error
      }
    };
    checkSession();
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login"); // Redirect to login after logout
  };

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
      <h2>Welcome, {userEmail}!</h2>
      <button onClick={handleLogout}>Logout</button>
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
