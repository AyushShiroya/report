import React from 'react';
import { format } from 'date-fns';

interface FormEntry {
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

interface RegisterFormDataProps {
  formEntries: FormEntry[];
}

const RegisterFormData: React.FC<RegisterFormDataProps> = ({ formEntries }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd/yyyy');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Form Entries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refrane Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {formEntries.length > 0 ? (
              formEntries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.refraneName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.fromDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.toDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.authority.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.client.ContractorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No form entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterFormData;