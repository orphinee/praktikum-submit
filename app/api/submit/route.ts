import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import mysql from "mysql2/promise";

export async function POST(request: Request) {
  try {
    // 1. Menangkap data dari form
    const formData = await request.formData();
    const nim = formData.get("nim") as string;
    const name = formData.get("name") as string;
    const className = formData.get("class") as string;
    const course = formData.get("course") as string;
    const file = formData.get("file") as File;

    if (!file || !nim || !name || !className || !course) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 2. Upload File ke Azure Blob Storage
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    
    // Merakit string koneksi rahasia Azure Storage
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient("tugas-praktikum");
    
    // Membuat nama file unik agar tidak bentrok jika namanya sama
    const fileName = `${Date.now()}-${nim}-${file.name.replace(/\s+/g, '-')}`;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Mengubah file fisik menjadi format Buffer (syarat dari Azure SDK)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    const fileUrl = blockBlobClient.url; // Mendapatkan link publik file tersebut

    // 3. Simpan Data Teks & Link File ke MySQL Azure
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false // Cara praktis agar Node.js otomatis menerima sertifikat SSL dari Azure MySQL
      }
    });

    await connection.execute(
      "INSERT INTO submissions (nim, name, class, course, file_url, status) VALUES (?, ?, ?, ?, ?, ?)",
      [nim, name, className, course, fileUrl, "Submitted"]
    );

    await connection.end();

    // Mengirim balasan sukses ke form depan
    return NextResponse.json({ success: true, fileUrl });
    
  } catch (error) {
    console.error("Terjadi error di backend:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}