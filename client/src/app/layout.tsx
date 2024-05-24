import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider} from '@clerk/nextjs'

import { ToasterProvider } from "@/providers/toast-provider";
import { ModalProvider } from "@/providers/modal-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Seller Dashboard",
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
        <ModalProvider/>
        {children}
        </body>
    </html>
  </ClerkProvider>  
  );
}
