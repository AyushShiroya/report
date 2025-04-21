"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addClient, addContractor, addJobForm } from '../../redux/formSlice';
import Modal from '../common/Modal';
import ClientForm from './ClientForm';
import Contractor from './Contractor';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import axios from 'axios';

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

const API_BASE_URL = 'http://localhost:5000/api';

const JobInward: React.FC = () => {
  const dispatch = useDispatch();
  const { clients, contractors } = useSelector((state: RootState) => state.form);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>();

  const [selectedFiles, setSelectedFiles] = useState<FileMetadata[]>([]);
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isContractorModalOpen, setContractorModalOpen] = useState(false);
  const [authorities, setAuthorities] = useState<any[]>([]);
  const [agency, setAgency] = useState<any[]>([]);
  const [_isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up file URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [selectedFiles]);

  // Fetch data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([fetchAuthorities(), fetchAgency()]);
    };
    fetchInitialData();
  }, []);

  const fetchData = useCallback(async (endpoint: string, setData: (data: any[]) => void) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found', { autoClose: 1000 });
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
        headers: { 'Authorization': token }
      });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      toast.error(`Failed to fetch ${endpoint}`, { autoClose: 1000 });
    }
  }, []);

  const fetchAuthorities = useCallback(() => fetchData('jobinwards', setAuthorities), [fetchData]);
  const fetchAgency = useCallback(() => fetchData('agency', setAgency), [fetchData]);

  const onSubmit: SubmitHandler<FormValues> = useCallback(async (data) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found', { autoClose: 1000 });
        return;
      }

      // Create FormData object
      const formData = new FormData();

      // Append all form fields
      formData.append('clientId', data.clientId);
      formData.append('contractorId', data.contractorId);
      formData.append('workName', data.workName);
      formData.append('agreementNumber', data.agreementNumber.toString());
      formData.append('pmc', data.pmc);
      formData.append('witness', data.witness);
      formData.append('thirdTitle', data.thirdTitle);
      formData.append('fourthTitle', data.fourthTitle);
      formData.append('letterNo', data.letterNo.toString());
      formData.append('letterDate', data.letterDate);
      formData.append('sampleReceivedDate', data.sampleReceivedDate);
      formData.append('inwardNumber', data.inwardNumber.toString());

      // Append files if they exist
      if (fileInputRef.current?.files) {
        for (let i = 0; i < fileInputRef.current.files.length; i++) {
          formData.append('documents', fileInputRef.current.files[i]);
        }
      }

      // Make the API call
      const response = await axios.post(`${API_BASE_URL}/alljobinwards`, formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Update local state if needed
        const selectedClient = clients.find(client => client.id === data.clientId);
        const selectedContractor = contractors.find(contractor => contractor.id === data.contractorId);

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
        toast.success("Job form submitted successfully!");

        // Reset form
        reset();
        setSelectedFiles([]);
      } else {
        toast.error(response.data.message || "Failed to submit job form");
      }
    } catch (error) {
      console.error("Error submitting job form:", error);
      toast.error("An error occurred while submitting the job form");
    }
    finally {
      setIsSubmitting(false);
    }
  }, [clients, contractors, dispatch, reset]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          previewUrl
        };
      })
    );

    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    setValue("documents", [...selectedFiles, ...newFiles], { shouldValidate: true });
  }, [selectedFiles, setValue]);

  const handleFileRemove = useCallback((index: number) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }

    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setValue("documents", updatedFiles, { shouldValidate: true });
  }, [selectedFiles, setValue]);

  const renderFilePreview = (file: FileMetadata, _index: number) => {
    if (file.type.startsWith("image/") && file.previewUrl) {
      return (
        <img
          src={file.previewUrl}
          alt={file.name}
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }

    const bgColor = file.type === "application/pdf" ? "bg-red-50" : "bg-blue-50";
    const textColor = file.type === "application/pdf" ? "text-red-500" : "text-blue-500";
    const fileType = file.type === "application/pdf" ? "PDF" : "DOC";

    return (
      <div className={`flex items-center justify-center w-full h-full ${bgColor} rounded-lg`}>
        <span className={`${textColor} font-bold text-sm`}>{fileType}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-3">
        {/* Client Selection */}
        <div className="col-span-6 sm:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Authority</label>
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
            {authorities.map((authority) => (
              <option key={authority._id} value={authority._id}>
                {authority.clientName}
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
            {agency.map((agency) => (
              <option key={agency._id} value={agency._id}>
                {agency.ContractorName}
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
                {renderFilePreview(file, index)}
                <button
                  type="button"
                  onClick={() => handleFileRemove(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                  aria-label={`Remove file ${file.name}`}
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
        {['pmc', 'witness', 'thirdTitle', 'fourthTitle'].map((field) => (
          <div key={field} className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              {...register(field as keyof FormValues)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}

        {/* Highlighted Fields */}
        {[
          { field: 'letterNo', label: 'Letter No.', type: 'number' },
          { field: 'letterDate', label: 'Letter Date', type: 'date' },
          { field: 'sampleReceivedDate', label: 'Sample Received Date', type: 'date' },
          { field: 'inwardNumber', label: 'Inward Number (Office)', type: 'text' }
        ].map(({ field, label, type }) => (
          <div key={field} className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              {...register(field as keyof FormValues)}
              className="mt-1 block w-full p-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
        ))}

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
            onSubmit={async (clientData) => {
              dispatch(addClient(clientData as any));
              setClientModalOpen(false);
              await fetchAuthorities();
            }}
            closeModal={() => setClientModalOpen(false)}
          />
        ) : (
          <Contractor
            onSubmit={(contractorData) => {
              dispatch(addContractor(contractorData as any));
              setContractorModalOpen(false);
              fetchAgency();
            }}
            closeModal={() => setContractorModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default JobInward;