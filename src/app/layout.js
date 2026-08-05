// src/app/layout.js

import "./globals.css";
import Providers from "@/components/AuthProvider";

export const metadata = {
  title: "Waterman-Moylan",
  description: "Ticketing System",
};

{/*wrap the entire application with the authentication provider */}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        
      </body>
    </html>
  );
}