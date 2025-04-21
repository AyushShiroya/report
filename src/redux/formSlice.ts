// src/redux/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Client and Contractor Types
export interface Client {
  [x: string]: string;
  id: string;
  clientName: string;
  // clientMobileNumber: number;
  clientAddress: string;
  city: string;
  // clientPinCode: number;
  clientEmailId: string;
  clientGstNumber: string;
}

export interface Contractor {
  id: string;
  ContractorName: string;
  ContractorMobileNumber: number;
  ContractorAddress: string;
  city: string;
  ContractorPinCode: number;
  ContractorEmailId: string;
  ContractorGstNumber: string;
}

export interface JobFormData {
  id: string;
  client: Client;
  contractor: Contractor;
  workName: string;
  documents: File[];
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

interface FormState {
  clients: Client[];
  contractors: Contractor[];
  jobForms: JobFormData[];
}

const initialState: FormState = {
  clients: [],
  contractors: [],
  jobForms: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addClient(state, action: PayloadAction<Omit<Client, 'id'>>) {
      const existingClient = state.clients.find(
        client => client.clientName === action.payload.clientName
      );
      // if (!existingClient) {
      //   state.clients.push({
      //     id: uuidv4(),
      //     ...action.payload,
      //   });
      // }
    },
    addContractor(state, action: PayloadAction<Omit<Contractor, 'id'>>) {
      const existingContractor = state.contractors.find(
        contractor => contractor.ContractorName === action.payload.ContractorName
      );
      if (!existingContractor) {
        state.contractors.push({
          id: uuidv4(),
          ...action.payload,
        });
      }
    },
    addJobForm(state, action: PayloadAction<Omit<JobFormData, 'id'>>) {
      state.jobForms.push({
        id: uuidv4(),
        ...action.payload,
      });
    },
    updateJobForm(state, action: PayloadAction<JobFormData>) {
      const index = state.jobForms.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.jobForms[index] = action.payload;
      }
    },
    removeJobForm(state, action: PayloadAction<string>) {
      state.jobForms = state.jobForms.filter(item => item.id !== action.payload);
    },
    resetJobForms(state) {
      state.jobForms = [];
    },
  },
});

export const {
  addClient,
  addContractor,
  addJobForm,
  updateJobForm,
  removeJobForm,
  resetJobForms,
} = formSlice.actions;

export default formSlice.reducer;