import JobView from "@/components/inward/JobView";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Job View",
    description:
        "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function JobViewPage() {
    return (
        <div>
            <div className="p-5 lg:p-4">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-5">
                    Job View
                </h3>
                <div className="space-y-6">
                    <JobView />
                </div>
            </div>
        </div>
    );
}
