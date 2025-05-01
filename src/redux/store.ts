// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import jobFormReducer from './jobFormSlice';

const store = configureStore({
  reducer: {
    form: formReducer,
    jobForms: jobFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;