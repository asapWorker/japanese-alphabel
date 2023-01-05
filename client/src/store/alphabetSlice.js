import {createSlice} from "@reduxjs/toolkit";
import {HIRAGANA} from "../constants";

const alphabetSlice = createSlice({
  name: 'alphabet',
  initialState: {
    type: HIRAGANA,
    alphabet: null,
    lettersToTrain: null
  },
  reducers: {
    changeType(state, action) {
      state.type = action.payload;
    },
    setAlphabet(state, action) {
      state.alphabet = action.payload;
    },
    setLettersToTrain(state, action) {
      state.lettersToTrain = action.payload;
    }
  }
})

export default alphabetSlice.reducer;
export const {changeType, setAlphabet, setLettersToTrain} = alphabetSlice.actions;