// Assuming this is the corrected file path
'use client';

import { useRouter } from 'next/navigation'; // Corrected import path
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Header = () => {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuth();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleSignOut = (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    signOut();
  };

  return (
    <header className="bg-green-400 text-foreground p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div
          onClick={() => navigateTo('/')}
          className="cursor-pointer font-bold text-primary hover:text-primary-foreground"
        >
          Fleur-GO
        </div>
        <ul className="font-semibold flex space-x-4 text-xs">
          <li
            onClick={() => navigateTo('/my-store')}
            className="cursor-pointer hover:text-primary hover:text-white"
          >
            My Shop
          </li>
          <li
            onClick={() => navigateTo('/about')}
            className="cursor-pointer hover:text-primary hover:text-white"
          >
            About
          </li>
          <li
            onClick={() => navigateTo('/contact')}
            className="cursor-pointer hover:text-primary hover:text-white"
          >
            Contact
          </li>
          {!isSignedIn && (
            <li
              onClick={() => navigateTo('/auth/sign-in')}
              className="cursor-pointer hover:text-primary hover:text-white"
            >
              Sign In
            </li>
          )}
          {isSignedIn && (
            <>
              <li
                onClick={handleSignOut}
                className="cursor-pointer hover:text-destructive"
              >
                Sign Out
              </li>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
