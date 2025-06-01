import { createSlice } from "@reduxjs/toolkit"

export type CounterState = {
  data: number
}

const initialState: CounterState = {
  data: 0
}

// using redux toolkit to create a slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // Inside here we CAN and DO mutate state directly
    // in reality, redux toolkit uses the immer library to create a draft state
    increment: (state, action) => {
      state.data += action.payload
    },
    decrement: (state, action) => {
      state.data -= action.payload
    }
  }
})

export const {increment, decrement} = counterSlice.actions;





// legacy action creators for compatibility with older code

export function incrementLegacy(amount = 1) {
  return {
    type: 'increment',
    payload: amount
  }
}

export function decrementLegacy(amount = 1) {
  return {
    type: 'decrement',
    payload: amount
  }
}

export default function counterReducer(state = initialState, action: { type: string, payload: number}) {
  switch (action.type) {
    case 'increment':
      // Return a new state object with the updated data value
      return {
        ...state,
        data: state.data + action.payload
      }
    case 'decrement':
      return {
        ...state, 
        data: state.data - action.payload
      };
    default:
      return state;
  }
}