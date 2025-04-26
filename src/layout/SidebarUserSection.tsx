// components/sidebar/SidebarUserSection.tsx
"use client";
import Image from "next/image";
import { logout } from "@/components/utils/auth";
import Button from "@/components/ui/button/Button";

export default function SidebarUserSection() {
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 py-3 mb-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/images/user/owner.jpg"
              width={40}
              height={40}
              alt="User Avatar"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Aayush
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              randomuser@pimjo.com
            </p>
          </div>
        </div>

      </div>
      <Button
        onClick={logout}
        className="text-sm text-red-600 hover:underline dark:text-red-400 bg-red-600 w-full mb-4"
        variant="primary"
        size="sm"
      >
        Logout
      </Button>
    </>
  );
}
