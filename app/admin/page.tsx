import mysql from "mysql2/promise";

// Memaksa Next.js untuk selalu mengambil data terbaru dari database (tidak di-cache)
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let submissions: any[] = [];
  let errorMsg = "";

  try {
    // 1. Melakukan koneksi ke Azure MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // 2. Mengambil semua data pengumpulan tugas, diurutkan dari yang paling baru
    const [rows] = await connection.execute(
      "SELECT * FROM submissions ORDER BY submitted_at DESC"
    );
    submissions = rows as any[];
    
    await connection.end();
  } catch (error) {
    console.error("Gagal mengambil data dari database:", error);
    errorMsg = "Gagal memuat data. Periksa koneksi database kamu.";
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      padding: "40px 20px",
      background: "linear-gradient(135deg, #87CEEB 40%, #FFEFBA 100%)", 
      fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <h2 style={{ color: "#005A9E", borderBottom: "2px solid #eee", paddingBottom: "10px", marginTop: "0" }}>
          Dashboard Admin - Daftar Tugas
        </h2>

        {errorMsg ? (
          <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#0078D4", color: "white" }}>
                  <th style={thStyle}>No</th>
                  <th style={thStyle}>NIM</th>
                  <th style={thStyle}>Nama</th>
                  <th style={thStyle}>Kelas</th>
                  <th style={thStyle}>Mata Kuliah</th>
                  <th style={thStyle}>Waktu Kumpul</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>File Tugas</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? (
                  submissions.map((sub, index) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{sub.nim}</td>
                      <td style={tdStyle}>{sub.name}</td>
                      <td style={tdStyle}>{sub.class}</td>
                      <td style={tdStyle}>{sub.course}</td>
                      <td style={tdStyle}>{new Date(sub.submitted_at).toLocaleString('id-ID')}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          backgroundColor: sub.status === "Submitted" ? "#DFF2BF" : "#FFF", 
                          color: sub.status === "Submitted" ? "#4F8A10" : "#000",
                          padding: "4px 8px", borderRadius: "4px", fontSize: "14px", fontWeight: "bold"
                        }}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <a 
                          href={sub.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: "#0078D4", textDecoration: "none", fontWeight: "bold" }}
                        >
                          📥 Download
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                      Belum ada tugas yang dikumpulkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Styling tabel
const thStyle = { padding: "12px", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px", color: "#333" };