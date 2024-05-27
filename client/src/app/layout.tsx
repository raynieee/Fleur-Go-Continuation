
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // Client component

export const metadata: Metadata = {
  title: "Fleur-GO",
  description: "Welcome to Fleur-Go",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
