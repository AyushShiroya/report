import React, { useState } from 'react';
import { format } from 'date-fns';

type Authority = {
  _id: string;
  clientName: string;
};

type Agency = {
  _id: string;
  ContractorName: string;
};

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
  filters: {
    fromDate: string;
    toDate: string;
    refraneName: string;
    authority: string;
    client: string;
  };
  onFilterChange: (newFilters: {
    fromDate: string;
    toDate: string;
    refraneName: string;
    authority: string;
    client: string;
  }) => void;
  authorities: Authority[];
  agencies: Agency[];
  fetchFormEntries: (customFilters?: any) => Promise<void>;
}

const RegisterFormData: React.FC<RegisterFormDataProps> = ({
  formEntries,
  filters,
  onFilterChange,
  authorities,
  agencies,
  fetchFormEntries
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd/yyyy');
  };

  const handleApplyFilter = async () => {
    try {
      setIsApplyingFilters(true);
      await fetchFormEntries();
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsApplyingFilters(false);
    }
  };

  const handleResetFilter = async () => {
    onFilterChange({
      fromDate: '',
      toDate: '',
      refraneName: '',
      authority: '',
      client: ''
    });

    try {
      setIsApplyingFilters(true);
      await fetchFormEntries({
        fromDate: '',
        toDate: '',
        refraneName: '',
        authority: '',
        client: ''
      });
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error resetting filters:", error);
    } finally {
      setIsApplyingFilters(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-8 bg-white rounded-xl shadow-lg">
      <div className="flex sm:flex-row sm:items-center sm:justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Form Entries</h2>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex items-center bg-black text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors duration-200 px-4 py-1.5 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </button>
      </div>
      {isPopupOpen && (
        <div
          className="absolute top-[140px] right-8 z-50 w-[32rem] p-6 bg-white rounded-xl shadow-2xl border border-gray-100"
          style={{
            animation: 'fadeIn 0.2s ease-out forwards',
            opacity: 0,
            transform: 'translateY(-10px)'
          }}
        >
          <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .filter-field:hover label {
        color: #2563eb;
      }
      .filter-field:hover input {
        border-color: #93c5fd;
      }
    `}</style>

          <div>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter Form Entries</h3>

            {/* 6x6 Grid for Date Fields */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6 filter-field">
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="col-span-6 filter-field">
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* 6x6 Grid for Authority/Agency */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6 filter-field">
                <label className="block text-sm font-medium text-gray-700 mb-1">Authority</label>
                <select
                  name="authority"
                  value={filters.authority || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Authority</option>
                  {authorities.map((authority) => (
                    <option key={authority._id} value={authority._id}>
                      {authority.clientName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-6 filter-field">
                <label className="block text-sm font-medium text-gray-700 mb-1">Agency</label>
                <select
                  name="client"
                  value={filters.client || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Agency</option>
                  {agencies.map((agency) => (
                    <option key={agency._id} value={agency._id}>
                      {agency.ContractorName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Full-width Refrane Name */}
            <div className="col-span-12 mb-4 filter-field">
              <label className="block text-sm font-medium text-gray-700 mb-1">Refrane Name</label>
              <input
                type="text"
                name="refraneName"
                value={filters.refraneName || ''}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleResetFilter}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilter}
                disabled={isApplyingFilters}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${isApplyingFilters ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isApplyingFilters ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-[250px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refrane Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formEntries?.length > 0 ? (
                  formEntries.map((entry) => (
                    <tr key={entry?._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-900">{entry?.refraneName || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500">{formatDate(entry?.fromDate || "-")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500">{formatDate(entry?.toDate || "-")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500">{entry?.authority?.clientName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500">{entry?.client?.ContractorName || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500">{formatDate(entry?.createdAt || "-")}</td>
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
      </div>
    </div>
  );
};

export default RegisterFormData;
