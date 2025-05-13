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
    } catch (err: any) {}
  }
}
