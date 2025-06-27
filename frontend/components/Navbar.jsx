"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white' }}>
      <Link href="/dashboard" style={{ marginRight: '15px', color: 'white' }}>Dashboard</Link>
      <Link href="/lead-capture" style={{ marginRight: '15px', color: 'white' }}>Lead Capture</Link>
      <Link href="/dashboard/estimate-bill"style={{ marginRight: '15px', color: 'white' }}>Estimate Bill</Link>
      <Link href="/login" style={{ color: 'white' }}>Logout</Link>
    </nav>
  );
}