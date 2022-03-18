import axios from "axios";
import { WORKSPACES_URL, BOOKINGS_URL, DAYOFF_URL } from "constants/index";
import authHeader from "./data-service";

export const addBookingService = (id, data) => {
  return axios
    .post(
      `${process.env.REACT_APP_API_URL}${WORKSPACES_URL}/${id}${BOOKINGS_URL}`,
      data,
      {
        headers: authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    });
};
export const addDayOffService = (id, data) => {
  return axios
    .post(
      `${process.env.REACT_APP_API_URL}${WORKSPACES_URL}/${id}${DAYOFF_URL}`,
      data,
      {
        headers: authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    });
};

export const editBookingService = (id, data) => {
  return axios
    .put(
      `${process.env.REACT_APP_API_URL}${WORKSPACES_URL}/${id}${BOOKINGS_URL}`,
      data,
      {
        headers: authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    });
};
export const editDayOffService = (id, data) => {
  return axios
    .put(
      `${process.env.REACT_APP_API_URL}${WORKSPACES_URL}/${id}${DAYOFF_URL}`,
      data,
      {
        headers: authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    });
};
