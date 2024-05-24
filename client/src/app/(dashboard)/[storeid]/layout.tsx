import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Ensure userId is defined before proceeding with the database query
  const seller = await prismadb.seller.findFirst({
    where: {
        id:params.storeId,// Use the converted ID here
        userId,
    }
  })

  if (!seller) {
    redirect('/')
  }

  return(
    <>
    <div>This will be the navbar </div>
    {children}
    </>
  )
}
