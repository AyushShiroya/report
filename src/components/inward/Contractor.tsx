"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
    ContractorName: string;
    ContractorMobileNumber: number;
    ContractorAddress: string;
    city: string;
    ContractorPinCode: number;
    ContractorEmailId: string;
    ContractorGstNumber: string;
};

interface ContractorFormProps {
    onSubmit: (contractorData: Omit<FormValues, 'id'>) => void;
    closeModal: () => void;
}
const Contractor: React.FC<ContractorFormProps> = ({ onSubmit, closeModal }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
        onSubmit(data); // Call the onSubmit prop with the contractor name
        reset();
        closeModal();
      };
    

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3"
        >
            {/* Contractor Name */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                <input
                    {...register('ContractorName', { required: true })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.ContractorName && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Contractor Mobile Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency Mobile Number</label>
                <input
                    {...register('ContractorMobileNumber', { required: true })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.ContractorMobileNumber && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Contractor Email ID */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency Email ID</label>
                <input
                    {...register('ContractorEmailId', { required: true })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.ContractorEmailId && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Contractor Address */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Agency Address</label>
                <textarea
                    {...register('ContractorAddress', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                />
                {errors.ContractorAddress && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* City */}
            <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <select
                    {...register('city', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select City</option>
                    <option value="Surat">Surat</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                    {/* Add more cities as needed */}
                </select>
                {errors.city && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Contractor Pin Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency Pin Code</label>
                <input
                    {...register('ContractorPinCode', { required: true })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.ContractorPinCode && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Contractor GST Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency GST Number</label>
                <input
                    {...register('ContractorGstNumber', { required: true })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.ContractorGstNumber && (
                    <span className="text-sm text-red-500">This field is required</span>
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