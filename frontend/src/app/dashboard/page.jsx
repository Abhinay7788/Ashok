"use client";

import { useState, useEffect } from "react";
import DashboardChart from "../../../components/DashboardChart";
import "../../../styles/dashboard.css";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lead`);

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Invalid JSON response: ${text.slice(0, 50)}...`);
        }

        const data = await response.json();
        setLeads(data);
      } catch (err) {
        console.error("❌ Fetch error:", err.message);
        setError("Failed to load leads. Check backend connection and API URL.");
      }
    };

    fetchLeads();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lead/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setLeads(leads.map((lead) => (lead._id === id ? updated : lead)));
    } catch (err) {
      console.error("❌ Status update failed:", err.message);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lead/${id}`, {
        method: "DELETE",
      });
      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
    }
  };

  const resendEmail = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lead/resend/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message || "Mail resent!");
    } catch (err) {
      console.error("❌ Resend failed:", err.message);
      alert("Resend failed");
    }
  };

  const downloadExcel = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/lead/download/excel`, "_blank");
  };

  return (
    <div className="dashboard">
      <h2>CRM Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <DashboardChart leads={leads} />

      <button onClick={downloadExcel} className="excel-download-btn">
        Download Excel
      </button>

      <table>
        <thead>
          <tr>
            <th>School</th><th>College</th><th>In-Charge</th><th>Phone</th>
            <th>Mileage</th><th>Email</th><th>Route</th><th>Seats</th><th>Buses</th>
            <th>Requirement</th><th>Strength</th><th>Financier</th><th>Model</th>
            <th>Weakness</th><th>Category</th><th>Location</th><th>AI Score</th>
            <th>Status</th><th>Delete</th><th>Resend</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.schoolName}</td>
              <td>{lead.collegeName}</td>
              <td>{lead.inChargeName}</td>
              <td>{lead.inChargePhone}</td>
              <td>{lead.mileage}</td>
              <td>{lead.email}</td>
              <td>{lead.route}</td>
              <td>{lead.seats}</td>
              <td>{lead.numBuses}</td>
              <td>{lead.requirement}</td>
              <td>{lead.strength}</td>
              <td>{lead.financier}</td>
              <td>{lead.existingModel}</td>
              <td>{lead.weakness}</td>
              <td>{lead.category}</td>
              <td>{lead.location}</td>
              <td>{lead.leadScore}</td>
              <td>
                <select value={lead.status} onChange={(e) => updateStatus(lead._id, e.target.value)}>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Interested</option>
                  <option>Converted</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteLead(lead._id)} style={{ backgroundColor: "red", color: "#fff" }}>
                  Delete
                </button>
              </td>
              <td>
                <button onClick={() => resendEmail(lead._id)}>Resend Mail</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}