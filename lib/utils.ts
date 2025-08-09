import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mediaNameMap: Record<string, string> = {
  "www.thestar.com.my": "The Star",
  "thestar.com.my": "The Star",
  "www.malaymail.com": "Malay Mail",
  "malaymail.com": "Malay Mail",
  "www.nst.com.my": "New Straits Times",
  "nst.com.my": "New Straits Times",
  "www.bernama.com": "Bernama",
  "bernama.com": "Bernama",
  "www.freemalaysiatoday.com": "Free Malaysia Today",
  "freemalaysiatoday.com": "Free Malaysia Today",
  "www.theedgemalaysia.com": "The Edge Malaysia",
  "theedgemalaysia.com": "The Edge Malaysia",
  "www.theborneopost.com": "The Borneo Post",
  "theborneopost.com": "The Borneo Post",
  "www.dailyexpress.com.my": "Daily Express",
  "dailyexpress.com.my": "Daily Express",
  "www.malaysiakini.com": "Malaysiakini",
  "malaysiakini.com": "Malaysiakini",
  "www.straitstimes.com": "The Straits Times",
  "straitstimes.com": "The Straits Times",
  "x.com": "X",
  "twitter.com": "X",
  "mobile.twitter.com": "X",
  "www.twitter.com": "X",
  "reddit.com": "Reddit",
  "www.reddit.com": "Reddit",
  "youtube.com": "YouTube",
  "www.youtube.com": "YouTube",
};

export function getMediaImageURL(mediaName: string, size: number = 64): string {
  const domain = mediaNameMap[mediaName];
  // Uses Google's favicon service to retrieve the favicon as PNG.
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    domain
  )}&sz=${size}`;
}
