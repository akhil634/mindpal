import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Form, Button, Alert, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login successful:", data);

      // Fetch user role from the database
      const { data: userData, error: userError } = await supabase
        .from("profiles") // Replace with your table name
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError) throw userError;

      // Ensure authentication state is fully updated before navigating
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect based on role
      if (userData.role === "admin") {
        window.location.href = "/adminhome"; // Redirect to admin home
      } else {
        window.location.href = "/app"; // Redirect to user app
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="center-container" style={{ maxWidth: "400px" }}>
      <div>
        <h2 className="text-center">Login</h2>
        <Form onSubmit={handleLogin}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Login;