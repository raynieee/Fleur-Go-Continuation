"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { SignedIn, UserButton } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Header: React.FC = () => {
  const router = useRouter();
  const { isSignedIn, signOut, userId } = useAuth();
  const [hasShop, setHasShop] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSignedIn && userId) {
      const checkUserShop = async () => {
        try {
          const response = await axios.get(`/admin/shops/${userId}`);
          if (response.data && response.data.shopId) {
            setHasShop(true);
          } else {
            setHasShop(false);
          }
        } catch (error) {
          console.error('Failed to fetch shop data:', error);
          setHasShop(false);
        }
      };
      checkUserShop();
    }
  }, [isSignedIn, userId]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleSignOut = (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    signOut();
  };

  const handleMyShopClick = () => {
    if (hasShop === null) return; // Prevent navigation if the check is not complete
    if (hasShop) {
      navigateTo('/myStore');
    } else {
      navigateTo('/createStore');
    }
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
            onClick={handleMyShopClick}
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
            onClick={() => navigateTo('/create-order')}
            className="cursor-pointer hover:text-primary hover:text-white"
          >
            Cart
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
