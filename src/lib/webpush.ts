import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!
);

export default webpush;
