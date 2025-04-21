"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/components/utils/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        if (pathname !== "/signin") {
          router.push("/signin");
        } else {
          setAuthChecked(true);
        }
      } else {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Don't render anything until auth check completes
  if (!authChecked) {
    return null;
  }

  return <>{children}</>;
}