import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/feedback"} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || password.length < 4) {
      setError("Please fill every field (password needs 4+ characters).");
      return;
    }
    const created = signup({ name: name.trim(), username: username.trim(), password });
    if (!created) {
      setError("That username is already taken — try another.");
      return;
    }
    navigate("/feedback");
  };

  return (
    <main className="page narrow">
      <div className="eyebrow">Account</div>
      <h1>Create your account</h1>
      <p className="subtitle">Sign up to submit feedback and track its status.</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              required autoCapitalize="off" autoCorrect="off" spellCheck="false" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={4} autoComplete="off" />
            <div className="hint">At least 4 characters.</div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">Create account</button>
          {error && <div className="hint error">{error}</div>}
        </form>
        <p className="hint center">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
