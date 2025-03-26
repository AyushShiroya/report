// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';

const store = configureStore({
  reducer: {
    form: formReducer, // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;