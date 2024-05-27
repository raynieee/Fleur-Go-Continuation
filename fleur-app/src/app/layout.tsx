import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider} from '@clerk/nextjs'

import { ToasterProvider } from "@/app/providers/toast-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fleur-GO",
  description: "Welcome to Fleur-Go",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider>  
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider/>
        {children}
        </body>
    </html>
  </ClerkProvider>  
  );
}