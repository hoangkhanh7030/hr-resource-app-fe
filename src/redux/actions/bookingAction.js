import * as actionTypes from "redux/constants";
import * as _ from "underscore";

import { addBookingService, editBookingService ,addDayOffService,editDayOffService } from "services/booking-service";

export const addBooking = (id, createdData) => (dispatch) => {
  
  dispatch({
    type: actionTypes.ADD_BOOKING,
  });

  return addBookingService(id, createdData).then(
    (data) => {
      dispatch({
        type: actionTypes.ADD_BOOKING_SUCCEED,
        payload: data,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: data.message,
      });
      return Promise.resolve();
    },
    (error) => {
      const message = _.get(error, ["response", "data", "error"]);
      dispatch({
        type: actionTypes.ADD_BOOKING_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const addDayOff = (id, createdData) => (dispatch) => {
  console.log(createdData);
  dispatch({
    type: actionTypes.ADD_DAYOFF,
  });

  return addDayOffService(id, createdData).then(
    (data) => {
      dispatch({
        type: actionTypes.ADD_DAYOFF_SUCCEED,
        payload: data,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: data.message,
      });
      return Promise.resolve();
    },
    (error) => {
      const message = _.get(error, ["response", "data", "error"]);
      dispatch({
        type: actionTypes.ADD_DAYOFF_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};


export const editBooking = (id, createdData) => (dispatch) => {
  dispatch({
    type: actionTypes.EDIT_BOOKING,
  });

  return editBookingService(id,createdData).then(
    (data) => {
      dispatch({
        type: actionTypes.EDIT_BOOKING_SUCCEED,
        payload: data,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: data.message,
      });
      return Promise.resolve();
    },
    (error) => {
      const message = _.get(error, ["response", "data", "error"]);
      dispatch({
        type: actionTypes.EDIT_BOOKING_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const editDayOff = (id, createdData) => (dispatch) => {
  dispatch({
    type: actionTypes.EDIT_BOOKING_DAYOFF,
  });

  return editDayOffService(id,createdData).then(
    (data) => {
      dispatch({
        type: actionTypes.EDIT_BOOKING_DAYOFF_SUCCEED,
        payload: data,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: data.message,
      });
      return Promise.resolve();
    },
    (error) => {
      const message = _.get(error, ["response", "data", "error"]);
      dispatch({
        type: actionTypes.EDIT_BOOKING_DAYOFF_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
