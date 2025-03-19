"use client";

import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Modal from '../common/Modal';
import ClientForm from './ClientForm';
import Contractor from './Contractor';

interface FormValues {
  client: string;
  contractor: string;
  workName: string;
  document: File | null;
  agreementNumber: number;
  pmc: string;
  witness: string;
  thirdTitle: string;
  fourthTitle: string;
  letterNo: number;
  letterDate: string;
  sampleReceivedDate: string;
  inwardNumber: number;
}

const JobInward: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isContractorModalOpen, setContractorModalOpen] = useState(false);
  const [clients, setClients] = useState<string[]>([]);
  const [contractors, setContractors] = useState<string[]>([]);

  // Ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    alert("Form submitted successfully!");
    console.log(data);
    // Handle form submission
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setValue("document", file, { shouldValidate: true });
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setValue("document", null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-6">
        {/* Client Selection */}
        <div className="col-span-6 sm:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setClientModalOpen(true)}
            >
              + Add New Client
            </button>
          </div>
          <select
            {...register('client', { required: 'Client is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {clients.map((client, index) => (
              <option key={index} value={client}>{client}</option>
            ))}
          </select>
          {errors.client && <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>}
        </div>

        {/* Contractor Selection */}
        <div className="col-span-6 sm:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Contractor</label>
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setContractorModalOpen(true)}
            >
              + Add New Contractor
            </button>
          </div>
          <select
            {...register('contractor', { required: 'Contractor is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a contractor</option>
            {contractors.map((contractor, index) => (
              <option key={index} value={contractor}>{contractor}</option>
            ))}
          </select>
          {errors.contractor && <p className="text-red-500 text-sm mt-1">{errors.contractor.message}</p>}
        </div>

        {/* Name of Work */}
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700">Name of Work</label>
          <textarea
            {...register('workName', { required: 'Name of work is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          {errors.workName && <p className="text-red-500 text-sm mt-1">{errors.workName.message}</p>}
        </div>

        {/* Document Upload */}
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700">Document Upload</label>
          <div
            className="mt-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 bg-white"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm text-gray-700">{selectedFile.name}</p>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={handleFileRemove}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <p className="text-sm text-gray-500">Drag & drop a file or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">Supported formats: PDF, DOC, XLSX</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document.message}</p>}
        </div>

        {/* Agreement Number */}
        <div className="col-span-6 sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">Agreement Number</label>
          <input
            type="text"
            {...register('agreementNumber', { required: 'Agreement number is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.agreementNumber && <p className="text-red-500 text-sm mt-1">{errors.agreementNumber.message}</p>}
        </div>

        {/* Divider */}
        <div className="col-span-6 border-t-2 border-gray-300"></div>

        <h2 className="text-lg font-bold col-span-6 text-center">Job Details</h2>

        {/* Additional Fields */}
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">PMC</label>
          <input {...register('pmc')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Witness</label>
          <input {...register('witness')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Third Title</label>
          <input {...register('thirdTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Fourth Title</label>
          <input {...register('fourthTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
        </div>

        {/* Divider */}
        {/* <div className="col-span-6 border-t-2 border-gray-300"></div> */}

        {/* Highlighted Fields */}
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Letter No.</label>
          <input
            type="number"
            {...register('letterNo')}
            className="mt-1 block w-full p-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Letter Date</label>
          <input
            type="datetime-local"
            {...register('letterDate')}
            className="mt-1 block w-full p-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Sample Received Date</label>
          <input
            type="datetime-local"
            {...register('sampleReceivedDate')}
            className="mt-1 block w-full p-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Inward Number (Office)</label>
          <input
            type="text"
            {...register('inwardNumber')}
            className="mt-1 block w-full p-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-6 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save Job
          </button>
        </div>
      </form>

      {/* Modals */}
      <Modal
        isOpen={isClientModalOpen || isContractorModalOpen}
        onClose={isClientModalOpen ? () => setClientModalOpen(false) : () => setContractorModalOpen(false)}
        title={isClientModalOpen ? "Add New Client" : "Add New Contractor"}
      >
        {isClientModalOpen ? (
          <ClientForm setClients={setClients} closeModal={() => setClientModalOpen(false)} />
        ) : (
          <Contractor setContractors={setContractors} closeModal={() => setContractorModalOpen(false)} />
        )}
      </Modal>
    </div>
  );
};

export default JobInward;