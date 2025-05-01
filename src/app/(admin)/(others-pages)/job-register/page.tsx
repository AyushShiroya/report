import RegisterForm from "@/components/registerJob/RegisterForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Job Register",
    description:
        "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Register() {
    return (
        <div>
            <div className="p-1 lg:p-1">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-5">
                    Job Register Form
                </h3>
                <div className="space-y-6">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
