import "./globals.css";
import "./win98.css";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "XRP Online - Meme Token & Chat Platform on XRPL",
  description: "Join the XRP Online community - A fun meme token and retro-styled chat platform built on the XRP Ledger. Connect, chat, and trade with fellow XRP enthusiasts!",
  icons: {
    icon: '/xrponline.png',
    apple: '/xrponline.png',
    shortcut: '/xrponline.png',
  },
  openGraph: {
    images: [{
      url: '/xrponline.png',
      width: 1200,
      height: 630,
      alt: 'XRP Online'
    }],
    title: "XRP Online - Meme Token & Chat Platform on XRPL",
    description: "Join the XRP Online community - A fun meme token and retro-styled chat platform built on the XRP Ledger. Connect, chat, and trade with fellow XRP enthusiasts!"
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/xrponline.png'],
    title: "XRP Online - Meme Token & Chat Platform on XRPL",
    description: "Join the XRP Online community - A fun meme token and retro-styled chat platform built on the XRP Ledger. Connect, chat, and trade with fellow XRP enthusiasts!"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/xrponline.png" />
        <style>{`
          /* Hide Next.js static indicator toast */
          .nextjs-static-indicator-toast-text {
            display: none !important;
          }
        `}</style>
      </head>
      <body style={{ 
        fontFamily: "'MS Sans Serif', 'Segoe UI', sans-serif",
        cursor: 'default'
      }}>
        <main className="min-h-screen w-full flex justify-center p-4">
          <div className="w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
