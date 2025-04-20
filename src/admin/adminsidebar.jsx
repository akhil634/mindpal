import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation(); // Get current route to highlight active tab

  return (
    <div className="sidebar">
      <h2>Admin</h2>
      <nav>
        <ul>
          <li className={location.pathname === "/adminhome" ? "active" : ""}>
            <Link to="/adminhome">📊 Dashboard</Link>
          </li>
          <li className={location.pathname === "/adminhome/videos" ? "active" : ""}>
            <Link to="/adminhome/videos">🎥 Videos</Link>
          </li>
          <li className={location.pathname === "/adminhome/feedback" ? "active" : ""}>
            <Link to="/adminhome/feedback">💬 Feedback</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
