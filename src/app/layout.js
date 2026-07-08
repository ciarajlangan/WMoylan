// src/app/layout.js

import "./globals.css";

export const metadata = {
  title: "Waterman-Moylan",
  description: "Ticketing System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}