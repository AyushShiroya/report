"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import RegisterFormData from './RegisterFormData';

type FormValues = {
  fromDate: string;
  toDate: string;
  refraneName: string;
  authority: string;
  client: string;
}

type FormEntry = {
  _id: string;
  fromDate: string;
  toDate: string;
  refraneName: string;
  authority: {
    _id: string;
    clientName: string;
  };
  client: {
    _id: string;
    ContractorName: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>();
  const [authorities, setAuthorities] = useState<any[]>([]);
  const [agency, setAgency] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formEntries, setFormEntries] = useState<FormEntry[]>([]);

  useEffect(() => {
    fetchAuthorities();
    fetchAgency();
    fetchFormEntries();
  }, []);


  const fetchFormEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found', { autoClose: 1000 });
        return;
      }

      const response = await axios.get('http://localhost:5000/api/formentry', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setFormEntries(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching form entries:', error);
      toast.error('Failed to fetch form entries', { autoClose: 1000 });
    }
  };



  const fetchAuthorities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found', { autoClose: 1000 });
        return;
      }

      const response = await axios.get('http://localhost:5000/api/jobinwards', {
        headers: {
          'Authorization': `${token}`
        }
      });

      if (response.data.success) {
        setAuthorities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching authorities:', error);
      toast.error('Failed to fetch authorities', { autoClose: 1000 });
    }
  };

  const fetchAgency = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found', { autoClose: 1000 });
        return;
      }

      const response = await axios.get('http://localhost:5000/api/agency', {
        headers: {
          'Authorization': token
        }
      })

      if (response.data.success) {
        setAgency(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching authorities:', error);
      toast.error('Failed to fetch authorities', { autoClose: 1000 });
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found', { autoClose: 1000 });
        return;
      }

      const response = await axios.post('http://localhost:5000/api/formentry', data, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Form submitted successfully!', { autoClose: 1000 });
        reset();
        // Refresh the form entries immediately after successful submission
        await fetchFormEntries();
      } else {
        toast.error(response.data.message || 'Failed to submit form', { autoClose: 1000 });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'An error occurred', { autoClose: 1000 });
      } else {
        toast.error('An unexpected error occurred', { autoClose: 1000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-6 gap-6"
        >
          {/* From Date */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fromDate">
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              {...register('fromDate', { required: 'From Date is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fromDate && (
              <p className="text-red-500 text-sm mt-1">{errors.fromDate.message}</p>
            )}
          </div>

          {/* To Date */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="toDate">
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              {...register('toDate', { required: 'To Date is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.toDate && (
              <p className="text-red-500 text-sm mt-1">{errors.toDate.message}</p>
            )}
          </div>

          {/* Refrane Name */}
          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="refraneName">
              Refrane Name
            </label>
            <input
              type="text"
              id="refraneName"
              {...register('refraneName', { required: 'Refrane Name is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter refrane name"
            />
            {errors.refraneName && (
              <p className="text-red-500 text-sm mt-1">{errors.refraneName.message}</p>
            )}
          </div>

          {/* Authority */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="authority">
              Authority
            </label>
            <select
              id="authority"
              {...register('authority', { required: 'Authority is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Authority</option>
              {authorities.map((authority) => (
                <option key={authority._id} value={authority._id}>
                  {authority.clientName}
                </option>
              ))}
            </select>
            {errors.authority && (
              <p className="text-red-500 text-sm mt-1">{errors.authority.message}</p>
            )}
          </div>

          {/* Client */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="client">
              Agency
            </label>
            <select
              id="client"
              {...register('client', { required: 'Client is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Agency</option>
              {agency.map((agency) => (
                <option key={agency._id} value={agency._id}>
                  {agency.ContractorName}
                </option>
              ))}
            </select>
            {errors.client && (
              <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-6 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <RegisterFormData formEntries={formEntries} />
    </>
  );
};

export default RegisterForm;