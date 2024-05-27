import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export const HomeModel = () => {
  const { user, signOut } = useClerk();
  const [isClient, setIsClient] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Set the initial path
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    if (isClient && user) {
      // Do something with the user object
      console.log(user);
    }
  }, [isClient, user]);

  useEffect(() => {
    const checkTokenExpiry = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        if (decodedToken.exp < Date.now() / 1000) {
          await refreshAccessTokenIfNeeded();
          router.push(currentPath); // Refresh the current page by navigating to the same path
        }
      }
    };

    checkTokenExpiry();
  }, [currentPath, router]);

  const refreshAccessTokenIfNeeded = async () => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      if (decodedToken.exp < Date.now() / 1000) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken);
          return newAccessToken;
        }
      }
    }
    return null;
  };

  const refreshAccessToken = async () => {
    try {
      const response: AxiosResponse = await axios.post("/api/refresh", {
        refreshToken: Cookies.get("refreshToken"),
      });

      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);

      return response.data.accessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const fetchData = async () => {
    await refreshAccessTokenIfNeeded();

    try {
      const response = await axios.get("/api/data");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!isClient) {
    return null; // or a loading spinner, or any fallback UI
  }

  return (
    <div>
      <h1>Homepage</h1>
      {/* other homepage content */}
      <button onClick={() => signOut()}>Sign Out</button>
      <button type="button" onClick={fetchData}>
        Fetch data
      </button>
    </div>
  );
};
