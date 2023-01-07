import {createSlice} from "@reduxjs/toolkit";
import {CORRECT, HIRAGANA, TIMIOUT_FROM_LEVEL} from "../constants";

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
    },

    changeLetterLevel(state, action) {
      state.alphabet[state.type][action.payload.indInAlphabet] = {
        ...state.alphabet[state.type][action.payload.indInAlphabet],
        level: action.payload.level,
        change: action.payload.answerStatus
      }
    },

    updateLetterInfo(state, action) {
      state.alphabet[state.type][action.payload.indInAlphabet] = {
        ...state.alphabet[state.type][action.payload.indInAlphabet],
        level: action.payload.level,
        change: action.payload.answerStatus,
        lastCall: Date.now(),
        timeout: TIMIOUT_FROM_LEVEL[action.payload.level]
      }
    },

    resetChangeLetterProperty(state, action) {
      state.alphabet[state.type][action.payload] = {
        ...state.alphabet[state.type][action.payload],
        change: false
      }
    }
  }
})

export default alphabetSlice.reducer;
export const {changeType, setAlphabet, setLettersToTrain, updateLetterInfo, resetChangeLetterProperty} = alphabetSlice.actions;