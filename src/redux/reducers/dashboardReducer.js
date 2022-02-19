import * as actionTypes from "redux/constants";

const initialState = { data: null, status: null };

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.GET_BOOKINGS:
      return { ...state };

    case actionTypes.GET_BOOKINGS_SUCCEED:
      return { ...state, data: payload };

    case actionTypes.GET_BOOKINGS_FAILED:
      return { ...state };

    case actionTypes.DELETE_BOOKING:
      return { ...state };

    case actionTypes.DELETE_BOOKING_SUCCEED:
      return { ...state, status: 200 };

    case actionTypes.DELETE_BOOKING_FAILED:
      return { ...state, data: payload };

    case actionTypes.RENAME_TEAM:
      return { ...state };

    case actionTypes.RENAME_TEAM_SUCCEED:
      return { ...state, status: 200 };

    case actionTypes.RENAME_TEAM_FAILED:
      return { ...state, data: payload };

    case actionTypes.ADD_BOOKING:
      return { ...state, isLoading: true };

    case actionTypes.ADD_BOOKING_SUCCEED:
      return {
        ...state,
        status: 200,
        isLoading: false,
      };

    case actionTypes.ADD_BOOKING_FAILED:
      return { ...state, isLoading: false };

    case actionTypes.EDIT_BOOKING:
      return { ...state, isLoading: true };

    case actionTypes.EDIT_BOOKING_SUCCEED:
      return {
        ...state,
        status: 200,
        isLoading: false,
      };

    case actionTypes.EDIT_BOOKING_FAILED:
      return { ...state, isLoading: false };
    default:
      return state;
  }
}
