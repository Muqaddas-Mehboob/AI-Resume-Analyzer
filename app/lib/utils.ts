// clsx is a tiny utility library that makes it easy to conditionally join class names in React (or plain JS).
// clsx → builds className strings dynamically.
// tailwind-merge → resolves Tailwind class conflicts.
// cn (your helper) → wraps both together for convenience.

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind + clsx helper
export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input));
}

export default function formatSize(bytes : number) : string{
    if(bytes == 0) return '0 bytes';

    const k = 1024;
    const size: string[] = ['Bytes',"KB", 'MB', 'GB', 'TB']

    const i : number = Math.floor(Math.log(bytes)/Math.log(k))

    return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + size[i]
}

// UUID (Universally Unique Identifier) -> UUIDs are 128-bit values
// crypto.randomUUID() -> It’s part of the Web Crypto API.
// It generates a random UUID n the standard version 4 format, e.g. "6f64e1f0-8e33-4a7a-8d6c-9a1f3b1c7a12"


export const generateUUID = () => crypto.randomUUID()
