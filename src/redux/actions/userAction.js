import * as actionTypes from "redux/constants";
import * as _ from "underscore";

import {
  getUsersService,
  archiveUserService,
  deleteUserService,
  reInviteUserService,
  inviteToWorkspaceService,
} from "services/user-service";

export const getUsers = (id, params) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_USERS,
  });

  return getUsersService(id, params).then(
    (data) => {
      dispatch({
        type: actionTypes.GET_USERS_SUCCEED,
        payload: data,
      });

      return Promise.resolve();
    },
    (error) => {
      const message = _.get(error, ["response", "data", "error"]);
      dispatch({
        type: actionTypes.GET_USERS_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const archiveUser = (id, userID) => (dispatch) => {
  dispatch({
    type: actionTypes.ARCHIVE_USER,
  });

  return archiveUserService(id, userID).then(
    (data) => {
      dispatch({
        type: actionTypes.ARCHIVE_USER_SUCCEED,
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
        type: actionTypes.ARCHIVE_USER_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const deleteUser = (id, userID) => (dispatch) => {
  dispatch({
    type: actionTypes.DELETE_USER,
  });

  return deleteUserService(id, userID).then(
    (data) => {
      dispatch({
        type: actionTypes.DELETE_USER_SUCCEED,
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
        type: actionTypes.DELETE_USER_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const reInviteUser = (id, updatedData) => (dispatch) => {
  dispatch({
    type: actionTypes.RE_INVITE_USER,
  });

  return reInviteUserService(id, updatedData).then(
    (data) => {
      dispatch({
        type: actionTypes.RE_INVITE_USER_SUCCEED,
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
        type: actionTypes.RE_INVITE_USER_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const inviteToWorkspace = (id, data) => (dispatch) => {
  dispatch({
    type: actionTypes.INVITE_TO_WORKSPACE,
  });

  return inviteToWorkspaceService(id, data).then(
    (data) => {
      dispatch({
        type: actionTypes.INVITE_TO_WORKSPACE_SUCCEED,
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
        type: actionTypes.INVITE_TO_WORKSPACE_FAILED,
      });

      dispatch({
        type: actionTypes.SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
