import { Inter, Inconsolata, Roboto, Montserrat, Poppins, Noto_Sans_Devanagari, Tiro_Devanagari_Marathi } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: "swap",
  adjustFontFallback: false,
  variable: '--font-inter',
});

export const roboto = Roboto({
  subsets: ['latin'],
  display: "swap",
  adjustFontFallback: false,
  variable: '--font-roboto',
  weight: "400",
});

export const inconsolata = Inconsolata({
  subsets: ['latin'],
  display: "swap",
  adjustFontFallback: false,
  variable: '--font-inconsolata',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  display: "swap",
  adjustFontFallback: false,
  variable: '--font-montserrat',
});

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  weight: "400",
  variable: '--font-poppins',
});

export const noto_sans = Noto_Sans_Devanagari({
  subsets:["devanagari"],
  display:"swap",
  weight:["400", "500", "600", "700"],
  variable:"--font-noto_sans"
});

export const trio = Tiro_Devanagari_Marathi({
  subsets:["devanagari", "latin"],
  display:"swap",
  weight:["400"],
  variable:"--font-trio"
});