"use client";

import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import RegisterFormData from './RegisterFormData';

type FormValues = {
  fromDate: string;
  toDate: string;
  refraneName: string;
  authority: string;
  client: string;
};

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
};

type Authority = {
  _id: string;
  clientName: string;
};

type Agency = {
  _id: string;
  ContractorName: string;
};

type Filters = {
  fromDate: string;
  toDate: string;
  refraneName: string;
  authority: string;
  client: string;
};

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formEntries, setFormEntries] = useState<FormEntry[]>([]);
  const [filters, setFilters] = useState<Filters>({
    fromDate: '',
    toDate: '',
    refraneName: '',
    authority: '',
    client: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchAuthorities(), fetchAgencies(), fetchFormEntries()]);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchWithAuth = async (url: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found', { autoClose: 1000 });
      throw new Error('No token found');
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Request failed');
    }

    return response.data;
  };

  const fetchFormEntries = useCallback(async (customFilters?: Filters) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const { fromDate, toDate, refraneName, authority, client } = customFilters || filters;

      const response = await axios.get(`https://report-be.onrender.com/api/formentry`, {
        headers: { 'Authorization': token },
        params: {
          fromDate,
          toDate,
          refraneName,
          authority,
          client
        }
      });

      if (response.data.success) {
        setFormEntries(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch form entries');
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error('Failed to fetch form entries', { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAuthorities = async () => {
    try {
      const data = await fetchWithAuth(`https://report-be.onrender.com/api/jobinwards`);
      setAuthorities(data.data);
    } catch (error) {
      console.error('Error fetching authorities:', error);
      toast.error('Failed to fetch authorities', { autoClose: 1000 });
    }
  };

  const fetchAgencies = async () => {
    try {
      const data = await fetchWithAuth(`https://report-be.onrender.com/api/agency`);
      setAgencies(data.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast.error('Failed to fetch agencies', { autoClose: 1000 });
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found', { autoClose: 1000 });
        return;
      }

      const response = await axios.post(
        `https://report-be.onrender.com/api/formentry`,
        data,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Form submitted successfully!', { autoClose: 1000 });
        reset();
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

  const inputClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";
  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <label className={labelClasses} htmlFor="fromDate">From Date</label>
            <input
              type="date"
              id="fromDate"
              {...register('fromDate', { required: 'From Date is required' })}
              className={inputClasses}
            />
            {errors.fromDate && <p className={errorClasses}>{errors.fromDate.message}</p>}
          </div>

          <div className="col-span-3">
            <label className={labelClasses} htmlFor="toDate">To Date</label>
            <input
              type="date"
              id="toDate"
              {...register('toDate', { required: 'To Date is required' })}
              className={inputClasses}
            />
            {errors.toDate && <p className={errorClasses}>{errors.toDate.message}</p>}
          </div>

          <div className="col-span-3">
            <label className={labelClasses} htmlFor="authority">Authority</label>
            <select
              id="authority"
              {...register('authority', { required: 'Authority is required' })}
              className={inputClasses}
            >
              <option value="">Select Authority</option>
              {authorities.map((authority) => (
                <option key={authority._id} value={authority._id}>
                  {authority.clientName}
                </option>
              ))}
            </select>
            {errors.authority && <p className={errorClasses}>{errors.authority.message}</p>}
          </div>

          <div className="col-span-3">
            <label className={labelClasses} htmlFor="client">Agency</label>
            <select
              id="client"
              {...register('client', { required: 'Agency is required' })}
              className={inputClasses}
            >
              <option value="">Select Agency</option>
              {agencies.map((agency) => (
                <option key={agency._id} value={agency._id}>
                  {agency.ContractorName}
                </option>
              ))}
            </select>
            {errors.client && <p className={errorClasses}>{errors.client.message}</p>}
          </div>

          <div className="col-span-6">
            <label className={labelClasses} htmlFor="refraneName">Refrane Name</label>
            <input
              type="text"
              id="refraneName"
              {...register('refraneName', { required: 'Refrane Name is required' })}
              className={inputClasses}
              placeholder="Enter refrane name"
            />
            {errors.refraneName && (
              <p className={errorClasses}>{errors.refraneName.message}</p>
            )}
          </div>

          <div className="col-span-6 flex justify-end mt-7">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${isSubmitting
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <RegisterFormData
        formEntries={formEntries}
        filters={filters}
        onFilterChange={(updatedFilters: Filters) => setFilters(updatedFilters)}
        authorities={authorities}
        agencies={agencies}
        fetchFormEntries={fetchFormEntries}
        loading={loading}
      />
    </>
  );
};

export default RegisterForm;