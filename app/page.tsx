"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Tugas berhasil dikumpulkan!");
        (e.target as HTMLFormElement).reset(); 
      } else {
        setMessage("Gagal mengumpulkan tugas. Coba lagi ya.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan.");
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      /* Gradasi biru langit ke rona hangat */
      background: "linear-gradient(135deg, #87CEEB 40%, #FFEFBA 100%)", 
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "500px"
      }}>
        <h2 style={{ textAlign: "center", color: "#005A9E", marginBottom: "10px", marginTop: "0" }}>
          PraktikumSubmit
        </h2>
        <p style={{ textAlign: "center", color: "#555", marginBottom: "30px", fontSize: "14px" }}>
          Silakan isi data dan upload file tugas praktikum kamu.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input type="text" name="nim" placeholder="NIM" required style={inputStyle} />
          <input type="text" name="name" placeholder="Nama Mahasiswa" required style={inputStyle} />
          <input type="text" name="class" placeholder="Kelas" required style={inputStyle} />
          <input type="text" name="course" placeholder="Mata Kuliah" required style={inputStyle} />
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>Upload File Tugas (PDF/ZIP/DOCX):</label>
            <input type="file" name="file" accept=".pdf,.zip,.docx" required style={{...inputStyle, padding: "8px", background: "#f9f9f9"}} />
          </div>
          
          <button type="submit" disabled={loading} style={{ 
            padding: "12px", 
            backgroundColor: loading ? "#99c5e8" : "#0078D4", 
            color: "white", 
            border: "none", 
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "15px",
            transition: "background-color 0.3s"
          }}>
            {loading ? "Mengirim..." : "Submit Tugas"}
          </button>
        </form>

        {/* Pesan Sukses/Gagal */}
        {message && (
          <div style={{ 
            marginTop: "20px", 
            padding: "15px", 
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold", 
            backgroundColor: message.includes("berhasil") ? "#DFF2BF" : "#FFBABA",
            color: message.includes("berhasil") ? "#4F8A10" : "#D8000C" 
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// Styling terpisah untuk input biar kodenya tetap rapi
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  outline: "none",
  color: "#333"
};