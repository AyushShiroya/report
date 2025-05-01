'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

export default function Ecommerce() {
  const [stats, setStats] = useState<{
    totalJobs: number;
    totalClients: number;
    totalContractors: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (hasFetchedRef.current) return;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:10000/api/alljobinwards/stats', {
          headers: {
            Authorization: token,
          },
        });

        const apiData = res.data.data;

        // Get previous data from localStorage
        const storedData = localStorage.getItem('jobStats');
        const parsedStoredData = storedData ? JSON.parse(storedData) : null;

        // Compare and only update if different
        if (JSON.stringify(apiData) !== JSON.stringify(parsedStoredData)) {
          setStats(apiData);
          localStorage.setItem('jobStats', JSON.stringify(apiData));
        } else {
          setStats(parsedStoredData);
        }

        hasFetchedRef.current = true; // mark as fetched
      } catch (error) {
        console.error('Error fetching job stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics stats={stats} loading={false}/>
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-12">
        <RecentOrders />
      </div>

      {/* Example trigger to reload stats */}

    </div>
  );
}
