"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addClient, addContractor, addJobForm } from '../../redux/formSlice';
import Modal from '../common/Modal';
import ClientForm from './ClientForm';
import Contractor from './Contractor';
import { RootState } from '../../redux/store';
import { v4 as uuidv4 } from 'uuid';

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  previewUrl?: string;
}

interface FormValues {
  clientId: string;
  contractorId: string;
  workName: string;
  documents: FileMetadata[];
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
  const dispatch = useDispatch();
  const { clients, contractors, jobForms } = useSelector((state: RootState) => state.form);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>();

  const [selectedFiles, setSelectedFiles] = useState<FileMetadata[]>([]);
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isContractorModalOpen, setContractorModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [selectedFiles]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const selectedClient = clients.find(client => client.id === data.clientId);
    const selectedContractor = contractors.find(contractor => contractor.id === data.contractorId);

    if (!selectedClient || !selectedContractor) {
      alert("Please select both Authority and Agency");
      return;
    }

    const jobFormData = {
      client: selectedClient,
      contractor: selectedContractor,
      workName: data.workName,
      documents: selectedFiles,
      agreementNumber: data.agreementNumber,
      pmc: data.pmc,
      witness: data.witness,
      thirdTitle: data.thirdTitle,
      fourthTitle: data.fourthTitle,
      letterNo: data.letterNo,
      letterDate: data.letterDate,
      sampleReceivedDate: data.sampleReceivedDate,
      inwardNumber: data.inwardNumber,
    };

    dispatch(addJobForm(jobFormData as any));
    alert("Job form submitted successfully!");
    console.log("All job forms:", jobForms);

    // Reset form
    reset();
    setSelectedFiles([]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const fileMetadata = await Promise.all(newFiles.map(async (file) => {
        let previewUrl;
        if (file.type.startsWith("image/")) {
          previewUrl = URL.createObjectURL(file);
        }
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          previewUrl
        };
      }));
      
      setSelectedFiles((prevFiles) => [...prevFiles, ...fileMetadata]);
      setValue("documents", [...selectedFiles, ...fileMetadata], { shouldValidate: true });
    }
  };

  const handleFileRemove = (index: number) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setValue("documents", updatedFiles, { shouldValidate: true });
  };
  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-3">
        {/* Client Selection */}
        <div className="col-span-6 sm:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Authority </label>
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setClientModalOpen(true)}
            >
              + Add New Authority
            </button>
          </div>
          <select
            {...register('clientId', { required: 'Authority is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Authority</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.clientName}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>}
        </div>

        {/* Contractor Selection */}
        <div className="col-span-6 sm:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Agency</label>
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setContractorModalOpen(true)}
            >
              + Add New Agency
            </button>
          </div>
          <select
            {...register('contractorId', { required: 'Agency is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Agency</option>
            {contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.ContractorName}
              </option>
            ))}
          </select>
          {errors.contractorId && <p className="text-red-500 text-sm mt-1">{errors.contractorId.message}</p>}
        </div>

        {/* Name of Work */}
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700">Name of Work</label>
          <textarea
            {...register('workName', { required: 'Name of work is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          {errors.workName && <p className="text-red-500 text-sm mt-1">{errors.workName.message}</p>}
        </div>

        {/* Document Upload */}
        <div className='col-span-6 sm:col-span-3'>
          <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mt-1 w-full p-2 border rounded-md"
          />
          <div className="mt-2 grid grid-cols-4 gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                {file.type.startsWith("image/") && file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : file.type === "application/pdf" ? (
                  <div className="flex items-center justify-center w-full h-full bg-red-50 rounded-lg">
                    <span className="text-red-500 font-bold text-sm">PDF</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-blue-50 rounded-lg">
                    <span className="text-blue-500 font-bold text-sm">DOC</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleFileRemove(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Agreement Number */}
        <div className='col-span-6 sm:col-span-3'>
          <label className="block text-sm font-medium text-gray-700">Agreement Number</label>
          <input
            type="text"
            {...register('agreementNumber', { required: 'Agreement number is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.agreementNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.agreementNumber.message}</p>
          )}
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
        title={isClientModalOpen ? "Add New Authority" : "Add New Agency"}
      >
        {isClientModalOpen ? (
          <ClientForm
            onSubmit={(clientData) => {
              dispatch(addClient(clientData));
              setClientModalOpen(false);
            }}
            closeModal={() => setClientModalOpen(false)}
          />
        ) : (
          <Contractor
            onSubmit={(contractorData) => {
              dispatch(addContractor(contractorData));
              setContractorModalOpen(false);
            }}
            closeModal={() => setContractorModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default JobInward;