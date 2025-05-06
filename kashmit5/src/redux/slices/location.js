// redux/slices/location.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lat: null,
  lng: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
    },
  },
});

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;
