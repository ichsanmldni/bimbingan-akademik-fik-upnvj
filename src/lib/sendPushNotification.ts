import prisma from "@/lib/prisma";
import webpush from "@/lib/webpush";

interface SendPushParams {
  role: "mahasiswa" | "dosen pa" | "kaprodi";
  userId: number;
  title: string;
  body: string;
  url?: string;
}

export async function sendPushNotification({
  role,
  userId,
  title,
  body,
  url = "/",
}: SendPushParams) {
  let subs = [];

  if (role === "mahasiswa") {
    subs = await prisma.pushsubscription.findMany({
      where: { mahasiswa_id: userId },
    });
  } else if (role === "dosen pa") {
    subs = await prisma.pushsubscription.findMany({
      where: { dosen_pa_id: userId },
    });
  } else if (role === "kaprodi") {
    subs = await prisma.pushsubscription.findMany({
      where: { kaprodi_id: userId },
    });
  }

  const payload = JSON.stringify({ title, body, url });

  for (const sub of subs) {
    try {
      const result = await webpush.sendNotification(sub, payload);
      console.log("✅ PUSH SENT:", sub.endpoint);
      console.log("📦 RESPONSE:", result);
    } catch (err: any) {
      console.error("❌ PUSH FAILED to:", sub.endpoint);
      console.error("🔻 ERROR:", err?.statusCode, err?.body || err.message);
    }
  }
}
