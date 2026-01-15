import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPublicUrl = (key: string) => {
  if (!key) return "/images/placeholder/placeholder-image.webp";

  const R2_DOMAIN = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL!;

  return `${R2_DOMAIN}/${key}`;
};
