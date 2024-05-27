// src/app/ClientLayout.tsx
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ToasterProvider } from "@/app/providers/toast-provider"; // Assuming this is a client component

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-3 space-x-4" > {/* Add padding top to move the content down */}
      <ClerkProvider>
        <ToasterProvider /> {/* Assuming ToasterProvider is a client-side component */}
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <main>
          {children}
        </main>
      </ClerkProvider>
    </div>
  );
}

export default ClientLayout;
