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
          <li className={location.pathname === "/adminvideos" ? "active" : ""}>
            <Link to="/adminvideos">🎥 Videos</Link>
          </li>
          <li className={location.pathname === "/adminfeedback" ? "active" : ""}>
            <Link to="/adminfeedback">💬 Feedback</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
