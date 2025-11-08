import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (value: number, decimals = 0) =>
  new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value);
