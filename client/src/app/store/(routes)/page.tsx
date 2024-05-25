import { useEffect } from "react";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import { useHomeModal } from "@/hooks/use-home-modal";

export default function StorePage() {
  const clerk = useClerk();
  const router = useRouter();

  return (
    <div>
      <h1>Store Page</h1>
      {/* other store page content */}
    </div>
  );
}