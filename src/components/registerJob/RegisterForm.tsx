"use client";

import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  fromDate: string;
  toDate: string;
  refraneName: string;
  authority: string;
  client: string;
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
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
            type="datetime-local"
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
            type="datetime-local"
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
            <option value="">Select authority</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          {errors.authority && (
            <p className="text-red-500 text-sm mt-1">{errors.authority.message}</p>
          )}
        </div>

        {/* Client */}
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="client">
            Client
          </label>
          <select
            id="client"
            {...register('client', { required: 'Client is required' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select client</option>
            <option value="client1">Client 1</option>
            <option value="client2">Client 2</option>
            <option value="client3">Client 3</option>
          </select>
          {errors.client && (
            <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-6 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;