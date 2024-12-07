import "./globals.css";
import "./win98.css";

export const metadata = {
  title: "XRPOnline - Your Gateway to Digital Assets",
  description: "Welcome to XRPOnline - The Premier Platform for XRP Trading and Community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
