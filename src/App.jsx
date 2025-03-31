import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../supabaseClient";
import ReactMarkdown from "react-markdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const isMentalHealthQuestion = (text) => {
    const keywords = ["stress", "stressed", "stressing", 
                    "anxiety", "anxious", "anxieties", 
                    "depression", "depressed", "depressing", 
                    "mental health", 
                    "emotion", "emotions", "emotional", "emotionally", 
                    "therapy", "therapies", "therapist", "therapeutic", 
                    "motivation", "motivated", "motivating", 
                    "mindfulness", "mindful", 
                    "well-being", "wellbeing", 
                    "self-care", 
                    "cope", "coping", "coped", 
                    "resilience", "resilient", 
                    "support", "supports", "supporting", "supported", "supportive", 
                    "mindset", "mindsets", 
                    "emotional intelligence", 
                    "angry", "angrier", "angriest", "anger", 
                    "sad", "sadder", "saddest", "sadness", 
                    "happy", "happier", "happiest", "happiness", 
                    "calm", "calming", "calmed", 
                    "overwhelm", "overwhelmed", "overwhelming", 
                    "breathe", "breathes", "breathing", "breathed", "breath", 
                    "relax", "relaxing", "relaxed", "relaxation", 
                    "worry", "worries", "worrying", "worried", 
                    "panic", "panics", "panicking", "panicked", 
                    "fear", "fears", "fearing", "feared", "fearful"];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const containsCrisisContent = (text) => {
    const crisisKeywords = [
      "suicide", "suicidal", "kill myself", "killing myself", "end my life", "ending my life",
      "self harm", "self-harm", "harm myself", "harming myself", "cut myself", "cutting myself",
      "don't want to live", "don't want to be alive", "want to die", "wanting to die",
      "take my own life", "taking my own life", "better off dead", "no reason to live"
    ];
    return crisisKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const showCrisisResources = () => {
    toast.error(
      <div>
        <h3>Crisis Resources</h3>
        <p>If you're in immediate danger, please call emergency services: <strong>100</strong></p>
        <p>National Suicide Prevention Lifeline: <strong>9152987821</strong> or <strong>1800-22-2211</strong></p>
        <p>Crisis Text Line: Text <strong>Mary Kurian</strong> to <strong>923245617</strong></p>
        <p>These services are available 24/7 and provide free, confidential support.</p>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "crisis-toast"
      }
    );
  };

  const fetchResponse = async () => {
    if (!input.trim()) return;
    
    // Check for crisis content
    if (containsCrisisContent(input)) {
      showCrisisResources();
      setResponse("I notice you're mentioning topics related to self-harm or suicide. Please reach out to the crisis resources shown above. They're available 24/7 and can provide immediate support. Your wellbeing is important.");
      return;
    }
    
    if (!isMentalHealthQuestion(input)) {
      setResponse("I'm here to support mental health topics. Please ask about stress, emotions, or mindfulness.");
      return;
    }

    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchResponse();
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <h1>MindPal AI Chatbot</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something about mental health..."
          disabled={isLoading}
        />
        <button 
          onClick={fetchResponse} 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
      
      {response && (
        <div className="response-container">
          <h2>Response:</h2>
          <div className="markdown-container">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;