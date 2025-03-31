import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css";
import { supabase } from "../supabaseClient";
import Sidebar from "./sidebar";
import App from "./App.jsx";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Videos from "./videos.jsx";
import SearchHistory from "./searchhistory.jsx";
import Feedback from "./feedback.jsx";
import Header from "./header.jsx";
import Footer from "./footer.jsx";

const Main = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevent flickering
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session ? session.user : null);
      setLoading(false); // Done loading
    };
    checkAuth();
  }, []);

  // Prevent flashing of login page while checking authentication
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {user && <Header />} {/* Show header only if user is logged in */}
      <div style={{ display: "flex", flex: 1 }}>
        {user && <Sidebar />} {/* Show sidebar only if user is logged in */}
        <div 
          style={{ 
            flex: 1,
            marginLeft: user ? "250px" : "0px", 
            marginTop: user ? "60px" : "0px", // Add margin for header when present
            padding: "20px", 
            width: "100%" 
          }}
        >
          <Routes>
            {!user ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/app" />} />
                <Route path="/app/*" element={<App />} />
                <Route path="/app/videos" element={<Videos />} />
                <Route path="/app/feedback" element={<Feedback />} />
                <Route path="/app/history" element={<SearchHistory userId={user?.id} />} />
                <Route path="*" element={<Navigate to="/app" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
      {user && <Footer />} {/* Footer outside content div to ensure it stays beneath sidebar */}
    </div>
  );
};

// Render the Main component inside BrowserRouter
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </StrictMode>
);
