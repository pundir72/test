import { createSlice } from "@reduxjs/toolkit";

const responseSlice = createSlice({
  name: "responseData",
  initialState: {
    id: "",
    price: 0,
    grade: "",
    uniqueCode: "",
    bonus: 0,
  },

  reducers: {
    setResponseData: (state, action) => {
      const { id, price, grade, uniqueCode, bonus } = action.payload;
      state.id = id;
      state.price = price;
      state.grade = grade;
      state.uniqueCode = uniqueCode;
        state.bonus = bonus;
    },
  },
});

export const { setResponseData } = responseSlice.actions;
export default responseSlice.reducer;
