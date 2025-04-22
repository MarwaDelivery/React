const initialState = {
  usePartialPayment: false,
  switchToWallet: false,
  openModal: false,
  openPartialModel: false,
  confirmAddress: false,
  confirmAddressModal: false,
  additionalAddress: {
    streetNumber: "",
    house: "",
    floor: "",
    door_bell: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USE_PARTIAL_PAYMENT":
      return { ...state, usePartialPayment: action.payload };
    case "SET_SWITCH_TO_WALLET":
      return { ...state, switchToWallet: action.payload };
    case "SET_OPEN_MODAL":
      return { ...state, openModal: action.payload };
    case "SET_OPEN_PARTIAL_MODEL":
      return { ...state, openPartialModel: action.payload };
    case "SET_OPEN_CONFIRM_MODEL":
      return { ...state, confirmAddressModal: action.payload };
    case "SET__CONFIRM_ADDRESS":
      return { ...state, confirmAddress: action.payload };
    case "SET_ADDITIONAL_ADDRESS":
      return { ...state, additionalAddress: action.payload };
    default:
      return state;
  }
}

export default reducer;
export { initialState };
