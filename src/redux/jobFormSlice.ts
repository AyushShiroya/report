// app/store/jobFormSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Client {
  clientName: string;
}

interface Contractor {
  ContractorName: string;
}

export interface JobFormData {
  id: string;
  client: Client;
  contractor: Contractor;
  workName: string;
  agreementNumber: string | number;
  pmc: string;
  witness: string;
  thirdTitle: string;
  fourthTitle: string;
  letterNo: string | number;
  letterDate: string;
  sampleReceivedDate: string;
  inwardNumber: string | number;
}

interface Filters {
  clientName: string;
  contractorName: string;
  workName: string;
  agreementNumber: string;
  letterDate: string;
  pmc: string;
  witness: string;
  thirdTitle: string;
  fourthTitle: string;
  letterNo: string;
  sampleReceivedDate: string;
  inwardNumber: string;
}

interface JobFormState {
  jobForms: JobFormData[];
  loading: boolean;
  filters: Filters;
}

// Export initialFilters to be used in components
export const initialFilters: Filters = {
  clientName: '',
  contractorName: '',
  workName: '',
  agreementNumber: '',
  letterDate: '',
  pmc: '',
  witness: '',
  thirdTitle: '',
  fourthTitle: '',
  letterNo: '',
  sampleReceivedDate: '',
  inwardNumber: '',
};

const initialState: JobFormState = {
  jobForms: [],
  loading: false,
  filters: initialFilters,
};

export const fetchJobForms = createAsyncThunk(
  'jobForms/fetchJobForms',
  async (filters: Filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await axios.get('https://report-be.onrender.com/api/alljobinwards', {
        headers: { 'Authorization': token },
        params: filters,
      });

      const data = response.data.data.map((job: any) => ({
        id: job._id,
        client: { clientName: job.clientId.clientName },
        contractor: { ContractorName: job.contractorId.ContractorName },
        workName: job.workName,
        agreementNumber: job.agreementNumber,
        pmc: job.pmc,
        witness: job.witness,
        thirdTitle: job.thirdTitle,
        fourthTitle: job.fourthTitle,
        letterNo: job.letterNo,
        letterDate: job.letterDate,
        sampleReceivedDate: job.sampleReceivedDate,
        inwardNumber: job.inwardNumber,
      }));

      return data as JobFormData[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const jobFormSlice = createSlice({
  name: 'jobForms',
  initialState,
  reducers: {
    setFilters: (state, action: { payload: Filters }) => {
      state.filters = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobForms.fulfilled, (state, action) => {
        state.loading = false;
        state.jobForms = action.payload;
      })
      .addCase(fetchJobForms.rejected, (state, action) => {
        state.loading = false;
        console.error('Failed to fetch job forms:', action.payload);
      });
  },
});

export const { setFilters, resetFilters } = jobFormSlice.actions;

export default jobFormSlice.reducer;