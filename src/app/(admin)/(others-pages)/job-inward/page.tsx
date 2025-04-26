"use client"

import JobInward from "@/components/inward/JobInward";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Job() {
    const router = useRouter();

    const handleViewJobClick = () => {
        router.push("/job-view");
    };
    return (
        <div>
            <div className="p-5 lg:p-4">
                <div className="flex items-center justify-between mb-4"> {/* Flex container */}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Job Inward Form
                    </h3>
                    <Button size="sm" variant="primary" className="bg-gray-500 hover:bg-gray-600" onClick={handleViewJobClick} >
                        View Job
                    </Button>
                </div>
                <div className="space-y-6">
                    <JobInward />
                </div>
            </div>
        </div>
    );
}
