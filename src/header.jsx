import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const extractUserName = (email) => {
      const match = email.match(/^([a-zA-Z]+)\d*/);
      const name = match ? match[1] : email.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserName(extractUserName(session.user.email));
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserName(null); // Clear username immediately
    navigate("/login");
    window.location.reload(); // Ensure UI updates properly
  };

  return (
    <header 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 1000,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>MINDPAL</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>Welcome, {userName}!</span>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
