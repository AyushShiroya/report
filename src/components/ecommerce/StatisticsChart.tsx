"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";


const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const bubbleColors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFF5",
    "#FF8F33", "#8FFF33", "#338FFF", "#FF33D4", "#D433FF", "#33FFD4"
  ];

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://report-be.onrender.com/api/alljobinwards/stats/monthly",
          {
            headers: { Authorization: token },
          }
        );

        const apiData = response.data.data;

        // Create 12 series, one for each month, with a distinct color
        const formattedSeries = [{
          name: "Monthly Targets",
          data: apiData.map((value: number, index: number) => ({
            x: months[index],
            y: value,
            z: Math.max(value * 5, 8),
            fillColor: bubbleColors[index], // individual color
          }))
        }];

        setSeriesData(formattedSeries);
      } catch (error) {
        console.error("Error fetching monthly stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyStats();
  }, []);
  const options: ApexOptions = {
    chart: {
      type: "bubble",
      height: 310,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      },
      fontFamily: "Outfit, sans-serif",
    },
    colors: bubbleColors,
    dataLabels: { enabled: false },
    fill: {
      opacity: 0.9,
      type: "solid",
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      type: "category", // 👈 switch from numeric to category
      categories: months,
      min: 0,
      max: 13,
      labels: {
        style: { fontSize: "13px", colors: "#374151" },
      },
    },
    yaxis: {
      min: 0,
      max: 15,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: "13px",
          colors: "#374151",
        },
      },
    },
    tooltip: {
      theme: "light",
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        return `<div style="padding: 8px;">
          <strong>${months[point.x - 1]}</strong><br />
          Jobs: ${point.y}
        </div>`;
      },
    },
    plotOptions: {
      bubble: {
        minBubbleRadius: 8,
        maxBubbleRadius: 40,
      },
    },
  };


  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[350px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
      >
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-gray-500"
          >
            Loading job data...
          </motion.p>
        </div>
      </motion.div>
    );
  }


  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target you’ve set for each month
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={seriesData}
            type="bubble"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
