"use client";
import { useState } from 'react';
import "../../../styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      alert(data.message);

      // ✅ Redirect after successful login:
      if (data.message === "Login success") {
        window.location.href = "/dashboard";  // or "/lead-capture" if you prefer
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button onClick={handleLogin}>Login</button>
      <a href="/signup">Create New Account</a>
    </div>
  );
}