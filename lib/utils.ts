import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any) {
  return twMerge(clsx(inputs))
}

export const generateId = () => Math.random().toString(36).substring(2, 15)

