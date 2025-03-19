import JobInward from "@/components/inward/JobInward";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Job Inward",
    description:
        "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Job() {
    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Job Inward Form
                </h3>
                <div className="space-y-6">
                    <JobInward />
                </div>
            </div>
        </div>
    );
}
