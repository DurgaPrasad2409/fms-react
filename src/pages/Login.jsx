import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // already signed in: go straight to your module
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/feedback"} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = login(username.trim(), password);
    if (!match) {
      setError("Incorrect username or password.");
      return;
    }
    // module-wise redirection based on role
    navigate(match.role === "admin" ? "/admin" : "/feedback");
  };

  return (
    <main className="page narrow">
      <div className="eyebrow">Account</div>
      <h1>Sign in</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              required autoCapitalize="off" autoCorrect="off" spellCheck="false" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required autoComplete="off" />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Sign in</button>
          {error && <div className="hint error">{error}</div>}
        </form>
        <p className="hint center">No account yet? <Link to="/signup">Sign up</Link></p>
      </div>
    </main>
  );
}
