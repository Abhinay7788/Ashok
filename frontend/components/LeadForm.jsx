"use client";
import { useState, useEffect } from "react";

export default function LeadForm({ onSubmit }) {
  const [lead, setLead] = useState({
    schoolName: '', collegeName: '', inChargeName: '', inChargePhone: '', mileage: '',
    email: '', route: '', seats: '', numBuses: '', requirement: '', strength: '',
    financier: '', existingModel: '', weakness: '', category: 'Bus', location: ''
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLead(prev => ({ ...prev, location: `${pos.coords.latitude}, ${pos.coords.longitude}` }));
    });
  }, []);

  const handleChange = e => setLead({ ...lead, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit(lead);
    }
  };

  return (
    <form className="lead-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <h2>Lead Capture Form</h2>
      <input name="schoolName" placeholder="School Name" onChange={handleChange} />
      <input name="collegeName" placeholder="College Name" onChange={handleChange} />
      <input name="inChargeName" placeholder="Vehicle In-Charge Name" onChange={handleChange} />
      <input name="inChargePhone" placeholder="Vehicle In-Charge Phone" onChange={handleChange} />
      <input name="mileage" placeholder="Mileage" onChange={handleChange} />
      <input name="email" placeholder="Email ID" onChange={handleChange} />
      <input name="route" placeholder="Route" onChange={handleChange} />
      <input name="seats" placeholder="Bus Seats" onChange={handleChange} />
      <input name="numBuses" placeholder="Number of Buses" onChange={handleChange} />
      <select name="requirement" onChange={handleChange}>
        <option>Yes</option>
        <option>No</option>
        <option>Other</option>
      </select>
      <input name="strength" placeholder="School Strength" onChange={handleChange} />
      <input name="financier" placeholder="Financier Details" onChange={handleChange} />
      <input name="existingModel" placeholder="Existing Vehicle Model" onChange={handleChange} />
      <input name="weakness" placeholder="Existing Vehicle Weakness" onChange={handleChange} />
      <select name="category" onChange={handleChange}>
        <option>Bus</option>
        <option>Truck</option>
      </select>
      <button type="submit">Submit Lead</button>
    </form>
  );
}