"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
    clientName: string;
    clientMobileNumber: number;
    clientAddress: string;
    city: string;
    clientPinCode: number;
    clientEmailId: string;
    clientGstNumber: string;
};

interface ClientFormProps {
    onSubmit: (clientData: Omit<FormValues, 'id'>) => void;
    closeModal: () => void;
}
const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, closeModal }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
        onSubmit(data); // Call the onSubmit prop with the client name
        reset();
        closeModal();
      };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3"
        >
            {/* Client Name */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Authority Name</label>
                <input
                    {...register('clientName', { required: true })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.clientName && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Client Mobile Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority Mobile Number</label>
                <input
                    {...register('clientMobileNumber', { required: true })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.clientMobileNumber && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Client Email ID */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority Email ID</label>
                <input
                    {...register('clientEmailId', { required: true })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.clientEmailId && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Client Address */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Authority Address</label>
                <textarea
                    {...register('clientAddress', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                />
                {errors.clientAddress && (
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

            {/* Client Pin Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority Pin Code</label>
                <input
                    {...register('clientPinCode', { required: true })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.clientPinCode && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Client GST Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority GST Number</label>
                <input
                    {...register('clientGstNumber', { required: true })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.clientGstNumber && (
                    <span className="text-sm text-red-500">This field is required</span>
                )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 lg:col-span-3 text-right">
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Authority
                </button>
            </div>
        </form>
    );
};

export default ClientForm;