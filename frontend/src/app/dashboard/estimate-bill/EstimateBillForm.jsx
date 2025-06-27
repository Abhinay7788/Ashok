"use client";
import { useState, useEffect } from "react";
import "../../../../styles/estimateBill.css";

export default function EstimateBillForm() {
  const [form, setForm] = useState({
    irnNo: "", ackNo: "", invoiceNo: "", date: "",
    model: "", variant: "", vehicleColor: "",
    chassisNo: "", engineNo: "", panNo: "", hypothecatedTo: "",
    buyer: { name: "", address: "", gstin: "", phone: "", stateCode: "" },
    consignor: { name: "", address: "", gstin: "", phone: "", stateCode: "" },
    items: [{ particular: "", hsn: "", gst: "", qty: "", rate: "", per: "", amount: "" }],
    amountWords: "", declaration: "", signatory: ""
  });

  const [taxSummary, setTaxSummary] = useState([]);

  const handleChange = (e, section, field) => {
    if (section === "buyer" || section === "consignor") {
      setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: e.target.value } }));
    } else {
      setForm({ ...form, [field]: e.target.value });
    }
  };

  const handleItemChange = (idx, e) => {
    const updated = [...form.items];
    updated[idx][e.target.name] = e.target.value;
    setForm({ ...form, items: updated });
  };

  const addRow = () => {
    setForm({
      ...form,
      items: [...form.items, { particular: "", hsn: "", gst: "", qty: "", rate: "", per: "", amount: "" }]
    });
  };

  const convertToWords = (amount) => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    let num = parseInt(amount);
    if (isNaN(num)) return "";
    if ((num.toString()).length > 9) return "Overflow";
    const n = ("000000000" + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
    if (!n) return "";
    let str = "";
    str += n[1] !== "00" ? (a[Number(n[1])] || (b[n[1][0]] + " " + a[n[1][1]])) + " Crore " : "";
    str += n[2] !== "00" ? (a[Number(n[2])] || (b[n[2][0]] + " " + a[n[2][1]])) + " Lakh " : "";
    str += n[3] !== "00" ? (a[Number(n[3])] || (b[n[3][0]] + " " + a[n[3][1]])) + " Thousand " : "";
    str += n[4] !== "000" ? (a[Number(n[4])] || (b[n[4][0]] + " " + a[n[4][1]])) + " Rupees" : "";
    return str.trim() + " Only";
  };

  useEffect(() => {
    const updatedItems = form.items.map(item => {
      const gst = parseFloat(item.gst || 0);
      const qty = parseFloat(item.qty || 0);
      const rate = parseFloat(item.rate || 0);
      const base = qty * rate;
      const tax = (base * gst) / 100;
      return { ...item, amount: (base + tax).toFixed(2) };
    });

    const summaryMap = {};
    updatedItems.forEach(item => {
      const hsn = item.hsn || "N/A";
      const qty = parseFloat(item.qty || 0);
      const rate = parseFloat(item.rate || 0);
      const base = qty * rate;
      const gst = parseFloat(item.gst || 0);
      const cgst = gst / 2;
      const sgst = gst / 2;
      const cgstAmt = (base * cgst) / 100;
      const sgstAmt = (base * sgst) / 100;
      const totalTax = cgstAmt + sgstAmt;

      if (!summaryMap[hsn]) {
        summaryMap[hsn] = {
          hsn,
          taxable: 0,
          cgst: cgst.toFixed(2),
          cgstAmt: 0,
          sgst: sgst.toFixed(2),
          sgstAmt: 0,
          totalTax: 0
        };
      }

      summaryMap[hsn].taxable += base;
      summaryMap[hsn].cgstAmt += cgstAmt;
      summaryMap[hsn].sgstAmt += sgstAmt;
      summaryMap[hsn].totalTax += totalTax;
    });

    const summaryList = Object.values(summaryMap).map(row => ({
      ...row,
      taxable: row.taxable.toFixed(2),
      cgstAmt: row.cgstAmt.toFixed(2),
      sgstAmt: row.sgstAmt.toFixed(2),
      totalTax: row.totalTax.toFixed(2)
    }));

    const grandTotal = updatedItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    setForm(prev => ({
      ...prev,
      items: updatedItems,
      amountWords: convertToWords(grandTotal.toFixed(0))
    }));

    setTaxSummary(summaryList);
  }, [form.items]);

  const generatePDF = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/estimatebill/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, taxSummary })
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Check server.");
    }
  };

  return (
    <div className="estimate-bill-form">
      <h2>Invoice Generator - Lakshmi Motors (Ashok Leyland)</h2>

      <h3>Invoice Details</h3>
      {[
        "irnNo", "ackNo", "invoiceNo", "date"
      ].map(field => (
        <input key={field} placeholder={field.replace(/([A-Z])/g, " $1")} type={field === "date" ? "date" : "text"} value={form[field]} onChange={e => handleChange(e, null, field)} />
      ))}

      <h3>Vehicle Details</h3>
      {[
        "model", "variant", "vehicleColor", "chassisNo", "engineNo", "panNo", "hypothecatedTo"
      ].map(field => (
        <input key={field} placeholder={field.replace(/([A-Z])/g, " $1")} value={form[field]} onChange={e => handleChange(e, null, field)} />
      ))}

      <h3>Buyer (Bill To)</h3>
      {Object.keys(form.buyer).map(key => (
        <input key={key} placeholder={key} value={form.buyer[key]} onChange={e => handleChange(e, "buyer", key)} />
      ))}

      <h3>Consignor (Ship To)</h3>
      {Object.keys(form.consignor).map(key => (
        <input key={key} placeholder={key} value={form.consignor[key]} onChange={e => handleChange(e, "consignor", key)} />
      ))}

      <h3>Invoice Items</h3>
      {form.items.map((row, idx) => (
        <div key={idx} className="table-row">
          {Object.entries(row).map(([key, val]) => (
            <input
              key={key}
              placeholder={key}
              name={key}
              value={val}
              onChange={(e) => handleItemChange(idx, e)}
              readOnly={key === "amount"}
            />
          ))}
        </div>
      ))}
      <button className="add-row-btn" onClick={addRow}>Add Row</button>

      <h3>Tax Summary</h3>
      {taxSummary.map((row, idx) => (
        <div key={idx} className="tax-summary-row">
          {["hsn", "taxable", "cgst", "cgstAmt", "sgst", "sgstAmt", "totalTax"].map(key => (
            <input key={key} placeholder={key} value={row[key]} readOnly />
          ))}
        </div>
      ))}

      <h3>Footer</h3>
      {["amountWords", "declaration", "signatory"].map(field => (
        <input key={field} placeholder={field.replace(/([A-Z])/g, " $1")} value={form[field]} onChange={e => handleChange(e, null, field)} />
      ))}

      <button className="download-btn" onClick={generatePDF}>Download PDF</button>
    </div>
  );
}
