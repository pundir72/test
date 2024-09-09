import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { profile: null, selStore: "GrestTest", selRegion: "Chandigarh" },
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setStoreFilter: (state, action) => {
      state.selRegion = action.payload.selRegion || "";
      state.selStore = action.payload.selStore || "";
    },
  },
});

export const { setUserProfile, setStoreFilter } = userSlice.actions;

export default userSlice.reducer;
