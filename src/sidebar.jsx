import { Link, useLocation } from "react-router-dom";
import "./sidebar.css"; // Ensure you create a CSS file for styling

const Sidebar = () => {
  const location = useLocation(); // Get current route to highlight active tab

  return (
    <div className="sidebar">
      <h2>MindPal</h2>
      <nav>
        <ul>
          <li className={location.pathname === "/app" ? "active" : ""}>
            <Link to="/app">📊 Dashboard</Link>
          </li>
          <li className={location.pathname === "/app/videos" ? "active" : ""}>
            <Link to="/app/videos">🎥 Videos</Link>
          </li>
          <li className={location.pathname === "/app/feedback" ? "active" : ""}>
            <Link to="/app/feedback">💬 Feedback</Link>
          </li>
          <li className={location.pathname === "/app/history" ? "active" : ""}>
            <Link to="/app/history">📜 Search History</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
