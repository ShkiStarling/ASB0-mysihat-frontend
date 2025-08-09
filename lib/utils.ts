import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// mediaNameMap.ts
export const mediaImageMap: Record<string, string> = {
  Bernama:
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/bernama.png",
  "The Borneo Post":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/borneopost.png",
  "Daily Express":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/dailyexpress.png",
  Facebook:
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/facebook.png",
  "Facebook Messenger":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/fbmessenger.png",
  "Free Malaysia Today":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/freemalaysiatoday.png",
  Instagram:
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/instagram.png",
  Malaysiakini:
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/malaysiakini.png",
  "New Straits Times":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/newsstraitstimes.png",
  Reddit:
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/reddit.png",
  "The Edge Malaysia":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/theedge.png",
  "The Star":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/thestar.png",
  "The Straits Times":
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/thestraitstimes.png",
  TikTok:
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/tiktok.png",
  X: "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/x.png",
  YouTube:
    "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/youtube.png",
};

export function getMediaImageURL(mediaName: string, size: number = 64): string {
  console.log("Media Name:", mediaName);
  const imageUrl = mediaImageMap[mediaName] || mediaImageMap.Unknown;
  if (!imageUrl)
    return "https://mmazibqqbdmyuicrfwud.supabase.co/storage/v1/object/public/assets/internet.png";
  console.log("Image URL:", imageUrl);
  return imageUrl;
}
