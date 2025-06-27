"use client";
import { useState } from 'react';
import "../../../styles/signup.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '', 
    password: '', 
    phone: '', 
    age: ''  // ✅ Added age
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      alert(data.message);

      // ✅ Redirect after successful signup:
      if (data.message === "User created successfully") {
        window.location.href = "/lead-capture"; // ✅ Lead Capture path
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <input 
        name="email" 
        placeholder="Email" 
        value={form.email} 
        onChange={handleChange} 
      />
      <input 
        name="phone" 
        placeholder="Phone" 
        value={form.phone} 
        onChange={handleChange} 
      />
      <input 
        name="age" 
        placeholder="Age" 
        value={form.age} 
        onChange={handleChange} 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        value={form.password} 
        onChange={handleChange} 
      />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}
