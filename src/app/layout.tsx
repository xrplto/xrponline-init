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
      <body style={{ 
        fontFamily: "'MS Sans Serif', 'Segoe UI', sans-serif",
        cursor: 'default'
      }}>
        {children}
      </body>
    </html>
  );
}
