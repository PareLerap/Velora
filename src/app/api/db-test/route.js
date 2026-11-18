import pool from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query("SELECT NOW() AS waktu");

        return Response.json({
            success: true,
            message: "Database VELORA berhasil terhubung!",
            waktu: result.rows[0].waktu,
        });
    } catch (error) {
        console.error("Database connection error:", error);

        return Response.json(
            {
                success: false,
                message: "Koneksi database gagal.",
            },
            { status: 500 }
        );
    }
}