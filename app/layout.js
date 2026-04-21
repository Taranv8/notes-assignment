import "./globals.css";

export const metadata = {
  title: "Mini Notes — Your Personal Notepad",
  description: "A full-stack notes application built with Next.js and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
