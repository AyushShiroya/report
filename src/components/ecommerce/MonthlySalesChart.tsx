"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import axios from "axios";
import { motion } from "framer-motion";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyJobInwardChart() {
  const [seriesData, setSeriesData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  const rainbowColors = [
    "#FF6633", // Jan - Orange
    "#FF33FF", // Feb - Magenta
    "#00B3E6", // Mar - Sky Blue
    "#E6B333", // Apr - Gold
    "#3366E6", // May - Blue
    "#999966", // Jun - Olive
    "#99FF99", // Jul - Light Green
    "#B34D4D", // Aug - Brown Red
    "#80B300", // Sep - Green
    "#809900", // Oct - Yellow-Green
    "#E6B3B3", // Nov - Light Pink
    "#6680B3"  // Dec - Steel Blue
  ];


  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://report-be.onrender.com/api/alljobinwards/stats/monthly', {
          headers: {
            Authorization: token,
          },
        });
        setSeriesData(response.data.data);
      } catch (error) {
        console.error("Error fetching monthly stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyStats();
  }, []);

  const options: ApexOptions = {
    colors: rainbowColors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      sparkline: {
        enabled: false
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 8,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top"
        },
        distributed: true
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#333"]
      },
      formatter: function (val: number) {
        return val > 0 ? `${val}` : '';
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontFamily: 'Outfit, sans-serif',
        }
      }
    },
    legend: {
      show: false,
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        formatter: function (val: number) {
          return val.toFixed(0);
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 20
      }
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: rainbowColors,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val} Jobs`,
        title: {
          formatter: () => ''
        }
      },
      marker: {
        show: true,
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif'
      },
      theme: 'light'
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        }
      },
      active: {
        filter: {
          type: 'darken',
        }
      }
    }
  };

  const series = [
    {
      name: "Job Inwards",
      data: seriesData,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[250px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 shadow-sm hover:shadow-md transition-shadow duration-300 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Job Inwards
        </h3>

        <div className="relative inline-block">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDropdown}
            className="dropdown-toggle"
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" />
          </motion.button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2 shadow-lg rounded-lg"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 px-3 py-2 transition-all duration-200 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 px-3 py-2 transition-all duration-200 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </motion.div>
  );
}