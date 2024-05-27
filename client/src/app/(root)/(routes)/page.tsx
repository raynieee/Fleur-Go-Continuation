"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useHomeModal } from "@/hooks/use-home-modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export default function Home() {
  const { user } = useUser();
const router = useRouter();
const { onOpen: onHomeOpen, isOpen: isHomeOpen } = useHomeModal();
const { onOpen: onStoreOpen, isOpen: isStoreOpen } = useStoreModal();

useEffect(() => {
  if (!user) {
    router.push("/sign-in");
  } else {
    const roles = user.publicMetadata.roles as string[] || [];
    if (roles.length === 0 || roles[0]!== "admin") {
      onHomeOpen();
    } else {
      onStoreOpen();
    }
  }
}, [user, router, onHomeOpen, onStoreOpen]);

return null;
}
