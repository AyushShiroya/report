"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

type FormValues = {
    ContractorName?: string;
    ContractorMobileNumber?: number;
    ContractorAddress?: string;
    city?: string;
    ContractorPinCode?: number;
    ContractorEmailId?: string;
    ContractorGstNumber: string;  // Only this field is required
};

interface ContractorFormProps {
    onSubmit?: (contractorData: FormValues) => void;
    closeModal: () => void;
}

const Contractor: React.FC<ContractorFormProps> = ({ onSubmit, closeModal }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();

    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token not found', { autoClose: 1000 });
                return;
            }

            const response = await axios.post('http://localhost:5000/api/agency', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            });

            console.log('Success:', response.data);

            toast.success("Agency added successfully!", {
                autoClose: 1000,
            });

            reset();
            closeModal();

            if (onSubmit) {
                onSubmit(data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            let errorMessage = 'Failed to add agency. Please try again.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            
            toast.error(errorMessage, {
                autoClose: 1000,
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3"
        >
            {/* Agency Name (Optional) */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                <input
                    {...register('ContractorName')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            {/* Agency Mobile Number (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency Mobile Number</label>
                <input
                    {...register('ContractorMobileNumber')}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            {/* Agency Email ID (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency Email ID</label>
                <input
                    {...register('ContractorEmailId')}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            {/* Agency Address (Optional) */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Agency Address</label>
                <textarea
                    {...register('ContractorAddress')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                />
            </div>

            {/* City (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <select
                    {...register('city')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select City</option>
                    <option value="Surat">Surat</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                </select>
            </div>

            {/* Agency Pin Code (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency Pin Code</label>
                <input
                    {...register('ContractorPinCode')}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            {/* Agency GST Number (Required) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency GST Number*</label>
                <input
                    {...register('ContractorGstNumber', { required: "GST Number is required" })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.ContractorGstNumber && (
                    <span className="text-sm text-red-500">{errors.ContractorGstNumber.message}</span>
                )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 lg:col-span-3 text-right">
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Agency
                </button>
            </div>
        </form>
    );
};

export default Contractor;