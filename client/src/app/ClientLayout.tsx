// src/app/ClientLayout.tsx
"use client"
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ToasterProvider } from "@/app/providers/toast-provider"; // Assuming this is a client component

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="positon-relattive" > {/* Add padding top to move the content down */}
      <ClerkProvider>
        <ToasterProvider /> {/* Assuming ToasterProvider is a client-side component */}
        <main>
          {children}
        </main>
      </ClerkProvider>
    </div>
  );
}

export default ClientLayout;
