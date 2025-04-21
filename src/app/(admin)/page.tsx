"use client";

// import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from "axios";

// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

interface JobFormData {
  id: string;
  client: {
    clientName: string;
  };
  contractor: {
    ContractorName: string;
  };
  workName: string;
  agreementNumber: string | number;
  pmc: string;
  witness: string;
  thirdTitle: string;
  fourthTitle: string;
  letterNo: string | number;
  letterDate: string;
  sampleReceivedDate: string;
  inwardNumber: string | number;
}

export default function Ecommerce() {
  // const jobForms = useSelector((state: RootState) => state.form.jobForms);
  const [jobForms, setJobForms] = useState<JobFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get('http://localhost:5000/api/alljobinwards', {
          headers: {
            'Authorization': token
          }
        });

        if (response.data.success) {
          const transformedData = response.data.data.map((job: any) => ({
            id: job._id,
            client: {
              clientName: job.clientId.clientName,
            },
            contractor: {
              ContractorName: job.contractorId.ContractorName,
            },
            workName: job.workName,
            agreementNumber: job.agreementNumber,
            pmc: job.pmc,
            witness: job.witness,
            thirdTitle: job.thirdTitle,
            fourthTitle: job.fourthTitle,
            letterNo: job.letterNo,
            letterDate: job.letterDate,
            sampleReceivedDate: job.sampleReceivedDate,
            inwardNumber: job.inwardNumber,
          }));
          setJobForms(transformedData);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
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
        <RecentOrders jobForms={jobForms} />
      </div>

    </div>
  );
}
