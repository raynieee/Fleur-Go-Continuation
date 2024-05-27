"use client"
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
// Import statement should match the file name and export



export default function SignInPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 min-w-full">
      <h2 className="text-2xl font-semibold text-gray-800">
        Sign in to your account
      </h2>
      <SignIn
        appearance={{
          elements: { footer: "hidden", formButtonPrimary: "bg-blue-700" },
        }}
        routing="hash"
      />
      <div className="flex flex-row gap-1 text-sm">
        <p>New to our platform?</p>
        <Link href="/auth/sign-up" className="text-blue-700 underline font-semibold">
          Sign up here.
        </Link>
      </div>
      <div>
        <p>want to create a store?</p>
        <Link href="/createStore" className="text-blue-700 underline font-semibold">
          Sign up here.
        </Link>
      </div>
    </div>
  );
}
