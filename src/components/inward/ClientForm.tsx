"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

type FormValues = {
    clientName?: string;        // Made optional
    clientMobileNumber?: number; // Made optional
    clientAddress?: string;     // Made optional
    city?: string;              // Made optional
    clientPinCode?: number;     // Made optional
    clientEmailId?: string;     // Made optional
    clientGstNumber: string;    // Only required field
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

    // const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    //     console.log(data);
    //     onSubmit(data);
    //     reset();
    //     closeModal();
    // };

    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token not found', { autoClose: 1000 });
                return;
            }

            const response = await axios.post(`https://report-be.onrender.com/api/jobinwards`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            });

            console.log('Success:', response.data);

            toast.success("Authority added successfully!", {
                autoClose: 1000,
            });

            reset();
            closeModal();

            if (onSubmit) {
                onSubmit(data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);

            let errorMessage = 'Failed to add authority. Please try again.';
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
            {/* Client Name - Optional */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Authority Name</label>
                <input
                    {...register('clientName')} // No validation
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {/* No error display */}
            </div>

            {/* Client Mobile Number - Optional */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority Mobile Number</label>
                <input
                    {...register('clientMobileNumber', {
                        valueAsNumber: true // Convert to number but not required
                    })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {/* No error display */}
            </div>

            {/* Client Email ID - Optional */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority Email ID</label>
                <input
                    {...register('clientEmailId')} // No validation
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {/* No error display */}
            </div>

            {/* Client Address - Optional */}
            <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Authority Address</label>
                <textarea
                    {...register('clientAddress')} // No validation
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                />
                {/* No error display */}
            </div>

            {/* City - Optional */}
            <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <select
                    {...register('city')} // No validation
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select City</option>
                    <option value="Surat">Surat</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                </select>
                {/* No error display */}
            </div>

            {/* Client Pin Code - Optional */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority Pin Code</label>
                <input
                    {...register('clientPinCode', {
                        valueAsNumber: true // Convert to number but not required
                    })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {/* No error display */}
            </div>

            {/* Client GST Number - REQUIRED (only validation) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Authority GST Number*</label>
                <input
                    {...register('clientGstNumber', {
                        required: 'GST Number is required' // Only required field
                    })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.clientGstNumber && (
                    <span className="text-sm text-red-500">{errors.clientGstNumber.message}</span>
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
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </form>
    );
};

export default ClientForm;