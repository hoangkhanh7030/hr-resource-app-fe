import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  ThemeProvider,
  Grid,
  Box,
  Snackbar,
  Button,
  SnackbarContent,
} from "@material-ui/core";
import * as _ from "underscore";
import { Progress } from "components/common/Progress";
import { Message } from "components/common/Message";
import Header from "./header/Header";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarBody from "./calendar/CalendarBody";
import buildCalendar from "./others/buildCalendar";

import { VIEWS, Y_M_D, DATA, TEAMS, RESOURCES } from "./others/constants";
import {
  getBookings,
  deleteBooking,
  renameTeam,
} from "redux/actions/dashboardAction";

import { theme } from "assets/css/Common";
import { useStyles } from "./style";
import { addResource } from "redux/actions/resourceAction";
import { getUsers } from "redux/actions/userAction";

import BookingDialog from "./dialog/BookingDialog";
import { addBooking, editBooking } from "redux/actions/bookingAction";
import { getProjectsBooking } from "redux/actions/projectAction";
import { getResourcesBooking } from "redux/actions/resourceAction";
import {
  DEFAULT_BOOKING,
  RESOURCES_URL,
  USER,
  WORKSPACES_URL,
} from "constants/index";
import { useHistory } from "react-router-dom";
import { clearMessage } from "redux/actions/msgAction";
export default function Workspace() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const storeDashboard = useSelector((state) => state.dashboard);
  const status = _.get(storeDashboard, "status");
  const [isUploading, setUploading] = useState(false);
  const { message } = useSelector((state) => state.message);
  const [hasMessage, setOpenMessage] = useState(false);

  const [teams, setTeams] = useState([]);
  const [resources, setResources] = useState([]);

  const [calendar, setCalendar] = useState([]);
  const [today, setToday] = useState(moment());
  const [view, setView] = useState(VIEWS[0].value);
  const [searched, setSearched] = useState("");

  const classes = useStyles({ view });

  const [openDialog, setOpenDialog] = useState(false);
  const [booking, setBooking] = useState(null);

  const storeResources = useSelector((state) => state.resources);
  const storeProjects = useSelector((state) => state.projects);
  const [prjList, setPrjList] = useState([]);
  const [rscList, setRscList] = useState([]);

  const [projectSearch, setProjectSearch] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");

  const [selectedDays, setSelectedDays] = useState([]);

  const [workDays, setWorkDays] = useState([]);

  const storeWorkspaces = useSelector((state) => state.workspaces);

  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const isInitialMount = useRef(true);

  const fetchBookings = (
    thisCalendar = [],
    searchValue = "",
    loading = false
  ) => {
    const params = {
      startDate: _.first(thisCalendar).format(Y_M_D),
      endDate: _.last(thisCalendar).format(Y_M_D),
      searchName: searchValue,
    };

    if (loading) {
      setLoading(true);
      dispatch(getBookings(id, params)).finally(() => setLoading(false));
    } else dispatch(getBookings(id, params));
  };

  useEffect(() => {
    dispatch(clearMessage());
    const thisCalendar = buildCalendar(today, view);
    setCalendar(thisCalendar);
    fetchBookings(thisCalendar, searched, true);
  }, [id]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const thisCalendar = buildCalendar(today, view);

      setCalendar(thisCalendar);
      fetchBookings(thisCalendar, searched);
    }
  }, [today, view]);

  useEffect(() => {
    if (!storeDashboard.data) {
      return;
    }
    setResources(_.get(storeDashboard, [DATA, RESOURCES]));
    setWorkDays(
      storeWorkspaces.data.filter((item) => +item.id === +id)[0]?.workDays
    );
    setTeams(_.get(storeDashboard, [DATA, TEAMS]));
  }, [storeDashboard, storeWorkspaces]);

  const keyUp = (event) => {
    if (event.keyCode === 13 || searched === "") {
      fetchBookings(calendar, searched);
    }
  };

  const cancelSearch = () => {
    setSearched("");
    fetchBookings(calendar, "");
  };

  const handleRenameTeam = (teamId, name) => {
    const params = { teamId, name };
    dispatch(renameTeam(id, params))
      .then(() => {
        setOpenMessage(true);
        fetchBookings(calendar);
      })
      .catch(() => {
        setOpenMessage(false);
      });
  };

  const handleDeleteBooking = (bookingId) => {
    dispatch(deleteBooking(id, bookingId))
      .then(() => {
        setOpenMessage(true);
        fetchBookings(calendar);
      })
      .catch(() => {
        setOpenMessage(false);
      });
  };

  const handleAddResource = (id, resource) => {
    dispatch(addResource(id, resource))
      .then(() => {
        setOpenMessage(true);
        fetchBookings(calendar);
      })
      .catch(() => {
        setOpenMessage(true);
      });
  };

  const handleCloseMessage = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenMessage(false);
  };

  const storeUsers = useSelector((state) => state.users);

  const params = {
    page: 1,
    size: 100,
    searchName: "",
    sortName: "",
    type: false,
  };

  useEffect(() => {
    dispatch(getUsers(id, params));
  }, [id]);

  useEffect(() => {
    if (!storeUsers.data) {
      return;
    }
    if (storeUsers.data.length) {
      const tmp = storeUsers.data
        .filter((item) => item.role !== "INACTIVE")
        .map((item) => item.id);
      tmp.push(storeUsers.adminId);
      const accountId = JSON.parse(localStorage.getItem(USER)).accountDTO.id;
      if (!tmp.includes(accountId)) history.push(WORKSPACES_URL);
    }
  }, [storeUsers.data]);

  const handleCloseDialog = () => {
    selectedDays?.forEach((element) => {
      document.getElementById(`${element}`).style.backgroundColor = `white`;
    });
    setOpenDialog(false);
  };

  const handleOpenDialog = (
    startDate = null,
    resourceId = "",
    booking = null,
    endDate = null,
    selectedDays = []
  ) => {
    setSelectedDays(selectedDays);
    setBooking(
      booking && startDate
        ? {
            id: _.get(booking, "id"),
            startDate: moment(_.get(booking, "startDate")),
            endDate: moment(_.get(booking, "endDate")),
            projectId: _.get(booking, ["projectDTO", "id"]),
            resourceId: resourceId,
            percentage: _.get(booking, "percentage"),
            duration: _.get(booking, "duration"),
          }
        : {
            ...DEFAULT_BOOKING,
            startDate: startDate.isBefore(endDate) ? startDate : endDate,
            endDate: endDate.isAfter(startDate) ? endDate : startDate,
            resourceId,
            isMulti: selectedDays.length > 1,
          }
    );

    setOpenDialog(true);
  };

  const handleAddBooking = (data) => {
    dispatch(addBooking(id, data))
      .then(() => {
        handleCloseDialog();
        setOpenMessage(true);
        fetchBookings(calendar);
      })
      .catch(() => {
        setOpenMessage(true);
      });
  };
  const handleEditBooking = (data) => {
    dispatch(editBooking(id, data))
      .then(() => {
        setOpenDialog(false);
        setOpenMessage(true);
        fetchBookings(calendar);
      })
      .catch(() => {
        setOpenMessage(true);
      });
  };
  useEffect(() => {
    fetchProjects(projectSearch);
    fetchResources(resourceSearch);
  }, [dispatch, id]);

  useEffect(() => {
    if (!storeResources.data && !storeProjects.data) {
      return;
    }

    setRscList(storeResources.data);
    setPrjList(storeProjects.data);
  }, [storeResources.data, storeProjects.data]);

  const fetchProjects = (projectSearch) => {
    dispatch(getProjectsBooking(id, projectSearch));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects(projectSearch);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [projectSearch]);

  const fetchResources = (resourceSearch) => {
    dispatch(getResourcesBooking(id, resourceSearch));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResources(resourceSearch);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [resourceSearch]);

  return (
    <ThemeProvider theme={theme}>
      <Header
        calendar={calendar}
        today={today}
        setToday={setToday}
        view={view}
        setView={setView}
        searched={searched}
        setSearched={setSearched}
        keyUp={keyUp}
        cancelSearch={cancelSearch}
      />

      <Box className={classes.calendar}>
        <Grid container>
          <CalendarHeader
            calendar={calendar}
            view={view}
            teamAmount={_.size(teams)}
            rscAmount={_.size(resources)}
          />

          <CalendarBody
            calendar={calendar}
            view={view}
            teams={teams}
            resources={resources}
            handleRenameTeam={handleRenameTeam}
            handleDeleteBooking={handleDeleteBooking}
            handleAddResource={handleAddResource}
            setUploading={setUploading}
            handleOpenDialog={handleOpenDialog}
          />
        </Grid>
      </Box>
      {openDialog && storeProjects.data && storeResources.data ? (
        <BookingDialog
          openDialog={openDialog}
          booking={booking}
          workDays={workDays.reduce(
            (out, bool, index) => (bool ? out.concat(index) : out),
            []
          )}
          setBooking={setBooking}
          handleCloseDialog={handleCloseDialog}
          projects={prjList}
          resources={rscList}
          handleAddBooking={handleAddBooking}
          handleEditBooking={handleEditBooking}
          projectSearch={projectSearch}
          setProjectSearch={setProjectSearch}
          resourceSearch={resourceSearch}
          setResourceSearch={setResourceSearch}
        />
      ) : (
        <></>
      )}
      {message ? (
        <Message
          message={message}
          isOpen={hasMessage}
          handleCloseMessage={handleCloseMessage}
          type={status === 200 ? "success" : "error"}
        />
      ) : (
        <></>
      )}
      {/* <Message
        message={"You must set team and position before managing resources!"}
        isOpen={!isLoading && !teams?.length}
        handleCloseMessage={handleCloseMessage}
        type={"warning"}
      /> */}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ marginTop: 50, marginRight: -4, boxShadow: "none" }}
        open={!isLoading && !teams?.length}
        message={"You must set team and position before managing resources!"}
      >
        <SnackbarContent
          style={{
            backgroundColor: "#f77f00",
            boxShadow: "none",
          }}
          message={
            <span>
              You must set team and position before managing resources !
            </span>
          }
          action={
            <Button
              style={{ color: "white", fontWeight: 600, border: "1px solid" }}
              size="small"
              onClick={() => {
                history.push(`${window.location.pathname}${RESOURCES_URL}`);
              }}
            >
              Setting
            </Button>
          }
        />
      </Snackbar>
      <Progress isOpen={isLoading} />
    </ThemeProvider>
  );
}
