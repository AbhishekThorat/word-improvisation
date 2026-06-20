import { Space_Grotesk, Inter } from 'next/font/google';

// Display face — geometric, a little playful: carries the game's personality.
export const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Body / UI face — quiet and highly legible.
export const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
