"use client";
import { logout } from "@/components/utils/auth";

export default function SidebarUserSection() {

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 py-3 mb-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {/* User Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A9.956 9.956 0 0112 15c2.216 0 4.254.722 5.879 1.938M15 11a3 3 0 10-6 0 3 3 0 006 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="px-4 py-2 w-full mb-4 rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white border border-red-500 hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg shadow-red-900/10 hover:shadow-red-900/20"
      >
        <span className="relative flex items-center justify-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </span>
      </button>
    </>
  );
}
