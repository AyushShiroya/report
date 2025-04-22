"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Button from '../ui/button/Button';

interface JobFormData {
    id: string;
    client: { clientName: string };
    contractor: { ContractorName: string };
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

const JobView = () => {
    const [jobForms, setJobForms] = useState<JobFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        clientName: '',
        contractorName: '',
        workName: '',
        agreementNumber: '',
        letterDate: ''
    });


    const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [e.target.name]: e.target.value
        }));
    };

    const applyFilters = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            const { clientName, contractorName, workName, agreementNumber, letterDate } = filters;

            const response = await axios.get('http://localhost:5000/api/alljobinwards', {
                headers: { 'Authorization': token },
                params: { clientName, contractorName, workName, agreementNumber, letterDate }
            });

            if (response.data.success) {
                const transformedData = response.data.data.map((job: any) => ({
                    id: job._id,
                    client: { clientName: job.clientId.clientName },
                    contractor: { ContractorName: job.contractorId.ContractorName },
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
        } catch (err) {
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters(); // Fetch filtered data on load
    }, [filters]); // Re-fetch data when filters change

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white dark:border-gray-800 dark:bg-white/[0.03] mt-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <Button size='sm' variant='outline' startIcon={<i className="fa-duotone fa-solid fa-bars-filter"></i>}>Filter</Button>
            </div>

            <div className="w-full overflow-x-auto">
                <Table className="min-w-full table-fixed border border-gray-200">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authority</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Name</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agreement</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PMC</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Witness</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter No</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter Date</TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inward No</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100">
                        {jobForms.map((job) => (
                            <TableRow key={job.id} className="hover:bg-gray-50">
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.client.clientName}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.contractor.ContractorName}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.workName}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.agreementNumber}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.pmc}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.witness}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.letterNo}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{new Date(job.letterDate).toLocaleDateString()}</TableCell>
                                <TableCell className="px-4 py-2 text-sm text-gray-700">{job.inwardNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default JobView;
