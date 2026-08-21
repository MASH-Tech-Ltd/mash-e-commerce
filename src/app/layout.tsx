import type { Metadata } from "next";
import { Inter, Outfit, Roboto, Noto_Sans_Bengali } from "next/font/google";
import { headers } from 'next/headers';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ["latin"], variable: '--font-roboto' });
const notoSansBengali = Noto_Sans_Bengali({ weight: ['400', '500', '600', '700', '800'], subsets: ["bengali"], variable: '--font-noto-sans-bengali' });

async function getTheme() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/themes/get-theme`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Electronics Store',
    description: 'Shop the latest electronics',
    icons: {
      icon: '/MEasy.png',
    }
  };
}

import Providers from '../components/Providers';
import Header from '../components/layout/Header';
import { LanguageProvider } from '../context/LanguageContext';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();

  const primaryColor = theme?.primaryColor || '#5022C3';
  const language = theme?.language || 'en';
  
  // Calculate contrast color for text on primary backgrounds
  const getContrastColor = (hexcolor: string) => {
    // If a short hex code is provided
    if (hexcolor.length === 4) {
      hexcolor = '#' + hexcolor[1] + hexcolor[1] + hexcolor[2] + hexcolor[2] + hexcolor[3] + hexcolor[3];
    }
    const r = parseInt(hexcolor.slice(1, 3), 16) || 0;
    const g = parseInt(hexcolor.slice(3, 5), 16) || 0;
    const b = parseInt(hexcolor.slice(5, 7), 16) || 0;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
  };
  const primaryForeground = getContrastColor(primaryColor);

  const fontChoice = theme?.fontFamily?.toLowerCase() || 'inter';
  const themeId = theme?.themeId || 'light';
  
  let fontClass = inter.variable;
  if (fontChoice === 'outfit') fontClass = outfit.variable;
  if (fontChoice === 'roboto') fontClass = roboto.variable;

  // Append Bengali font variable so it's available
  fontClass = `${fontClass} ${notoSansBengali.variable}`;

  // Map theme templates to colors
  let bgColor = '#ffffff';
  let textColor = '#171717';

  if (themeId === 'dark') {
    bgColor = '#0f172a';
    textColor = '#f8fafc';
  } else if (themeId === 'nature') {
    bgColor = '#f0fdf4';
    textColor = '#14532d';
  } else if (themeId === 'sunset') {
    bgColor = '#fffbeb';
    textColor = '#78350f';
  }

  return (
    <html lang={language}>
      <body suppressHydrationWarning className={`${fontClass} font-sans antialiased`} style={{ '--primary': primaryColor } as React.CSSProperties}>
        {/* Dynamic global styles for the tenant's primary color and theme */}
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --primary-color: ${primaryColor};
            --primary-foreground: ${primaryForeground};
            --background: ${bgColor};
            --foreground: ${textColor};
            --font-sans: var(--font-${fontChoice}), sans-serif;
          }
          
          /* When language is Bengali, prepend Noto Sans Bengali to the font stack */
          html[lang="bn"] {
            --font-sans: var(--font-noto-sans-bengali), var(--font-${fontChoice}), sans-serif !important;
          }
          
          body {
            font-family: var(--font-sans) !important;
          }
          
          .bg-primary { background-color: var(--primary-color) !important; color: var(--primary-foreground) !important; }
          .text-primary { color: var(--primary-color) !important; }
          .border-primary { border-color: var(--primary-color) !important; }
          
          .hover\\:bg-primary:hover { 
            background-color: var(--primary-color) !important; 
            color: var(--primary-foreground) !important;
            opacity: 0.9; 
          }
          
          /* Override specific tailwind text-white classes on primary backgrounds */
          .bg-primary.text-white, .hover\\:bg-primary:hover.text-white, .hover\\:bg-primary:hover.hover\\:text-white:hover { 
            color: var(--primary-foreground) !important; 
          }
        `}} />
        <LanguageProvider initialLanguage={language}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
