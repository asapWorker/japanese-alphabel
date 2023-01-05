import {configureStore} from "@reduxjs/toolkit";
import alphabetSlice from "./alphabetSlice";

const store = configureStore({
  reducer: {
    alphabet: alphabetSlice
  }
})

export default store;