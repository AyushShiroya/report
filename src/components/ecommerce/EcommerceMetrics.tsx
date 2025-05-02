"use client";
import React from "react";
import CountUp from "react-countup";
import { BoxIconLine, GroupIcon } from "@/icons";
import { motion } from "framer-motion";

type EcommerceMetricsProps = {
  stats: {
    totalJobs: number;
    totalClients: number;
    totalContractors: number;
  } | null;
  loading: boolean;
};

const metricVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  }
};

export const EcommerceMetrics: React.FC<EcommerceMetricsProps> = ({
  stats,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }



  if (!stats) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 pt-5 py-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex space-x-20">
          {[...Array(1)].map((_, i) => (
            <div
              key={i}
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }





  const metrics = [
    {
      label: "Authority",
      value: stats.totalClients,
      icon: <GroupIcon className="text-indigo-500 size-6" />,
      gradient: "from-indigo-500 to-purple-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      label: "Jobs",
      value: stats.totalJobs,
      icon: <BoxIconLine className="text-teal-500 size-6" />,
      gradient: "from-teal-500 to-emerald-500",
      bg: "bg-teal-50 dark:bg-teal-900/20"
    },
    {
      label: "Agency",
      value: stats.totalContractors,
      icon: <GroupIcon className="text-rose-500 size-6" />,
      gradient: "from-rose-500 to-pink-500",
      bg: "bg-rose-50 dark:bg-rose-900/20"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {metrics.map((item, index) => (
        <motion.div
          key={item.label}
          custom={index}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={metricVariants}
          className={`relative overflow-hidden rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md ${item.bg} border border-gray-100 dark:border-gray-800`}
        >
          {/* Gradient accent */}
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.gradient}`} />

          <div className="flex items-start justify-between">
            <div className={`flex items-center justify-center w-14 h-14 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
              {item.icon}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.label}
            </span>
            <h4 className="text-3xl font-bold text-gray-800 dark:text-white">
              <CountUp
                end={item.value}
                duration={1.5}
                separator=","
                formattingFn={(value) => new Intl.NumberFormat().format(value)}
              />
            </h4>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
