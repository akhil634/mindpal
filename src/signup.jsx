import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSymbol) return 'Password must contain at least one special character';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword) {
      setPasswordError(validatePassword(newPassword));
    } else {
      setPasswordError('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    
    // Validate password before attempting signup
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setMessage('Check your email to confirm your account.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input ${passwordError ? 'error-input' : ''}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={loading}
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={/[A-Z]/.test(password) ? 'requirement-met' : ''}>
                  At least 1 uppercase letter
                </li>
                <li className={/[0-9]/.test(password) ? 'requirement-met' : ''}>
                  At least 1 number
                </li>
                <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? 'requirement-met' : ''}>
                  At least 1 special character
                </li>
                <li className={password.length >= 8 ? 'requirement-met' : ''}>
                  At least 8 characters long
                </li>
              </ul>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="signup-button"
            disabled={loading || passwordError}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <div className="login-link">
          <p>Already have an account?</p>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;