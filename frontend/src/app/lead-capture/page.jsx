"use client";
import { useState, useEffect } from 'react';
import "../../../styles/leadform.css"; // CSS file with glass effect

export default function LeadCapture() {
  const [lead, setLead] = useState({
    schoolName: '', collegeName: '', inChargeName: '', inChargePhone: '', mileage: '',
    email: '', route: '', seats: '', numBuses: '', requirement: '', strength: '',
    financier: '', existingModel: '', weakness: '', category: 'Bus', location: ''
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLead(prev => ({
        ...prev,
        location: `${pos.coords.latitude}, ${pos.coords.longitude}`
      }));
    });
  }, []);

  const handleChange = e => setLead({ ...lead, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const completeLead = { ...lead, leadScore: 0, status: 'New' };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeLead),
      });
      const data = await res.json();
      alert(data.message);
      if (data.redirectTo) window.location.href = data.redirectTo;
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Submission failed.");
    }
  };

  return (
    <div className="lead-form-container">
      <h2>Lead Capture Form</h2>
      {[
        { label: "School Name", name: "schoolName" },
        { label: "College Name", name: "collegeName" },
        { label: "In-Charge Name", name: "inChargeName" },
        { label: "In-Charge Phone", name: "inChargePhone" },
        { label: "Mileage", name: "mileage" },
        { label: "Email ID", name: "email" },
        { label: "Route", name: "route" },
        { label: "Seats", name: "seats" },
        { label: "Number of Buses", name: "numBuses" },
        { label: "School Strength", name: "strength" },
        { label: "Financier Details", name: "financier" },
        { label: "Existing Vehicle Model", name: "existingModel" },
        { label: "Existing Vehicle Weakness", name: "weakness" },
      ].map((field, idx) => (
        <div className="form-group" key={idx}>
          <label>{field.label}:</label>
          <input
            name={field.name}
            value={lead[field.name]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="form-group">
        <label>Requirement:</label>
        <select name="requirement" value={lead.requirement} onChange={handleChange}>
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Category:</label>
        <select name="category" value={lead.category} onChange={handleChange}>
          <option>Bus</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Submit Lead</button>
    </div>
  );
}