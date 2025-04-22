import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  configData: null,
  userLocation: null,
};

// Action creators are generated for each case reducer function
export const configDataSlice = createSlice({
  name: "config-data",
  initialState,
  reducers: {
    setConfigData: (state, action) => {
      state.configData = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
});

export const { setConfigData, setUserLocation } = configDataSlice.actions;

export default configDataSlice.reducer;
