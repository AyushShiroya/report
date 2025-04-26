"use client";

import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
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

interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}

const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): DebouncedFunction<T> => {
    let timer: NodeJS.Timeout;

    const debouncedFunction = (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };

    debouncedFunction.cancel = () => {
        clearTimeout(timer);
    };

    return debouncedFunction;
};

interface Filters {
    clientName: string;
    contractorName: string;
    workName: string;
    agreementNumber: string;
    letterDate: string;
    pmc: string;
    witness: string;
    thirdTitle: string;
    fourthTitle: string;
    letterNo: string;
    sampleReceivedDate: string;
    inwardNumber: string;
}

const JobView = () => {
    const [jobForms, setJobForms] = useState<JobFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({
        clientName: '',
        contractorName: '',
        workName: '',
        agreementNumber: '',
        letterDate: '',
        pmc: '',
        witness: '',
        thirdTitle: '',
        fourthTitle: '',
        letterNo: '',
        sampleReceivedDate: '',
        inwardNumber: '',
    });
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            const {
                clientName, contractorName, workName,
                agreementNumber, letterDate, pmc, witness,
                thirdTitle, fourthTitle, letterNo, sampleReceivedDate, inwardNumber
            } = filters;

            const response = await axios.get('http://localhost:5000/api/alljobinwards', {
                headers: { 'Authorization': token },
                params: {
                    clientName, contractorName, workName,
                    agreementNumber, letterDate, pmc, witness,
                    thirdTitle, fourthTitle, letterNo, sampleReceivedDate, inwardNumber
                }
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
    }, [filters]);

    const debouncedFetchData = useCallback(debounce(fetchData, 500), [fetchData]);

    const applyFilters = async () => {
        debouncedFetchData.cancel();
        await fetchData();
    };

    useEffect(() => {
        debouncedFetchData();
        return () => {
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData]);

    const togglePopover = () => setPopoverOpen(!popoverOpen);

    const handleApply = () => {
        applyFilters();
        togglePopover();
    };

    const handleCancel = () => {
        setFilters({
            clientName: '',
            contractorName: '',
            workName: '',
            agreementNumber: '',
            letterDate: '',
            pmc: '',
            witness: '',
            thirdTitle: '',
            fourthTitle: '',
            letterNo: '',
            sampleReceivedDate: '',
            inwardNumber: '',
        });
        togglePopover();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto p-4 mt-8 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-end">
                <button
                    onClick={togglePopover}
                    className="flex items-center bg-black text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors duration-200 px-4 py-1.5 rounded-md"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Filter
                </button>
            </div>

            {popoverOpen && (
                <div
                    className="absolute top-[140px] right-8 z-50 w-[32rem] p-6 bg-white rounded-xl shadow-2xl border border-gray-100"
                    style={{
                        animation: 'fadeIn 0.2s ease-out forwards',
                        opacity: 0,
                        transform: 'translateY(-10px)'
                    }}
                >
                    <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .filter-field:hover label {
                color: #2563eb;
            }
            .filter-field:hover input {
                border-color: #93c5fd;
            }
        `}</style>

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Filter Jobs</h3>
                        <button
                            onClick={togglePopover}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {/* Row 1 */}
                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
                                Authority
                            </label>
                            <input
                                type="text"
                                name="clientName"
                                value={filters.clientName}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Authority..."
                            />
                        </div>

                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
                                Agency
                            </label>
                            <input
                                type="text"
                                name="contractorName"
                                value={filters.contractorName}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Agency..."
                            />
                        </div>

                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
                                Work Name
                            </label>
                            <input
                                type="text"
                                name="workName"
                                value={filters.workName}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Work..."
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
                                Agreement #
                            </label>
                            <input
                                type="text"
                                name="agreementNumber"
                                value={filters.agreementNumber}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Agreement..."
                            />
                        </div>

                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
                                Letter Date
                            </label>
                            <input
                                type="date"
                                name="letterDate"
                                value={filters.letterDate}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
                                PMC
                            </label>
                            <input
                                type="text"
                                name="pmc"
                                value={filters.pmc}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="PMC..."
                            />
                        </div>

                        {/* Row 3 - Witness field centered */}
                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
                                Witness
                            </label>
                            <input
                                type="text"
                                name="witness"
                                value={filters.witness}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Witness..."
                            />
                        </div>

                        {/* Row 4 */}
                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Third Title</label>
                            <input
                                type="text"
                                name="thirdTitle"
                                value={filters.thirdTitle}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Third Title..."
                            />
                        </div>

                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fourth Title</label>
                            <input
                                type="text"
                                name="fourthTitle"
                                value={filters.fourthTitle}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Fourth Title..."
                            />
                        </div>

                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Letter No</label>
                            <input
                                type="text"
                                name="letterNo"
                                value={filters.letterNo}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Letter No..."
                            />
                        </div>

                        {/* Row 5 */}
                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sample Received Date</label>
                            <input
                                type="date"
                                name="sampleReceivedDate"
                                value={filters.sampleReceivedDate}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="filter-field">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Inward No</label>
                            <input
                                type="text"
                                name="inwardNumber"
                                value={filters.inwardNumber}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Inward No..."
                            />
                        </div>

                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 border-rose-200 border-2 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 hover:bg-black hover:text-white rounded-lg bg-white text-black border-black border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
            <div className="w-full">
                <div className="overflow-x-auto">
                    <div className="max-h-[500px] overflow-y-auto">
                        <Table className="min-w-full table-fixed border border-gray-200">
                            <TableHeader className="sticky top-0 z-10 bg-gray-50">
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
                                    <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Third Title</TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fourth Title</TableCell>
                                    <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Received</TableCell>

                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100">
                                {jobForms.map((job) => (
                                    <TableRow key={job.id} className="hover:bg-gray-50">
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.client.clientName}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.contractor.ContractorName}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.workName}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.agreementNumber}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.pmc}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.witness}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.letterNo}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{new Date(job.letterDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.inwardNumber}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.thirdTitle}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{job.fourthTitle}</TableCell>
                                        <TableCell className="px-4 py-2 text-[12px] text-gray-700">{new Date(job.sampleReceivedDate).toLocaleDateString()}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default JobView;