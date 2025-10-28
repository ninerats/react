export const initialState = {
  useNtfy: true,
  useIfttt: true,
  message: []
};

export function appReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_NTFY":
      return { ...state, useNtfy: action.payload ?? !state.useNtfy };
    case "TOGGLE_IFTTT":
      return { ...state, useIfttt: action.payload ?? !state.useIfttt };
    case "SET_MESSAGE":
      return (action.payload === "") ? {...state, message:[]} :  { ...state, message: [...state.message, action.payload].slice(-4) };   
    default:
      return state;
  }
}
