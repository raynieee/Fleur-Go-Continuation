'use client';

import { useRouter } from 'next/navigation'; // Corrected import path
import { useAuth } from '@clerk/nextjs';

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
    <header className="bg-green-700; text-foreground p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div
          onClick={() => navigateTo('/')}
          className="cursor-pointer font-bold text-primary hover:text-primary-foreground"
        >
          MyEcommerceStore
        </div>
        <ul className="flex space-x-4">
          <li
            onClick={() => navigateTo('/shop')}
            className="cursor-pointer hover:text-primary"
          >
            Shop
          </li>
          <li
            onClick={() => navigateTo('/about')}
            className="cursor-pointer hover:text-primary"
          >
            About
          </li>
          <li
            onClick={() => navigateTo('/contact')}
            className="cursor-pointer hover:text-primary"
          >
            Contact
          </li>
          {isSignedIn ? (
            <li
              onClick={handleSignOut}
              className="cursor-pointer hover:text-destructive"
            >
              Sign Out
            </li>
          ) : (
            <li
              onClick={() => navigateTo('/sign-in')}
              className="cursor-pointer hover:text-primary"
            >
              Sign In
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
