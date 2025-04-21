"use client";
import SignInForm from "@/components/auth/SignInForm";
import { isAuthenticated } from "@/components/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function SignIn() {
  const router = useRouter();


  useEffect(() => {
    // Only run on client side after mount
    if (typeof window !== "undefined" && isAuthenticated()) {
      router.push('/');
    }
  }, [router]);


  return <SignInForm />;
}
