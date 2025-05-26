import prisma from "../../../lib/prisma";

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: any = await req.json();
    const { mahasiswaId, tokenUsed } = body;

    console.log(body);
    if (!mahasiswaId || typeof tokenUsed !== "number") {
      return new Response(JSON.stringify({ message: "Input tidak valid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const today = now.toISOString().split("T")[0];

    // Ambil data user
    const mahasiswa: any = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
    });

    if (!mahasiswa) {
      return new Response(
        JSON.stringify({ message: "Mahasiswa tidak ditemukan." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const envLimitToken = parseInt(process.env.LIMIT_TOKEN || "200000");

    // Update token_limit jika berbeda dari env
    if (mahasiswa.token_limit !== envLimitToken) {
      await prisma.mahasiswa.update({
        where: { id: mahasiswaId },
        data: {
          token_limit: envLimitToken,
        },
      });

      mahasiswa.token_limit = envLimitToken; // update nilai lokal agar sync
    }

    // Reset token jika hari sudah ganti
    const lastReset = mahasiswa.last_token_reset?.toISOString().split("T")[0];
    if (lastReset !== today) {
      await prisma.mahasiswa.update({
        where: { id: mahasiswaId },
        data: {
          used_tokens: 0,
          last_token_reset: now,
        },
      });
      mahasiswa.used_tokens = 0; // reset manual agar hitungan di bawah benar
    }

    const newUsed = mahasiswa.used_tokens + tokenUsed;

    // Cek apakah melebihi limit
    if (newUsed > mahasiswa.token_limit) {
      return new Response(
        JSON.stringify({
          message: "Token harian telah habis.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update token
    const updatedTokenUser = await prisma.mahasiswa.update({
      where: { id: mahasiswaId },
      data: {
        used_tokens: newUsed,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Token berhasil ditambahkan.",
        data: updatedTokenUser,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
