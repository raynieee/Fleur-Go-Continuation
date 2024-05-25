// components/Model/HomeModel.tsx
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";

export const HomeModel = () => {
  const { user } = useClerk();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && user) {
      // Do something with the user object
      console.log(user);
    }
  }, [isClient, user]);

  if (!isClient) {
    return null; // or a loading spinner, or any fallback UI
  }

  return (
    <div>
      <h1>Homepage</h1>
      {/* other homepage content */}
    </div>
  );
};
