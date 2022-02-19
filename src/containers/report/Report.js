import { Box, Paper, Tab, Tabs, ThemeProvider } from "@material-ui/core";
import { theme } from "assets/css/Common";
import { DAY } from "constants/index";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReport, exportReport } from "redux/actions/reportAction";
import * as _ from "underscore";
import Chart from "./Chart";
import Statistics from "./Statistics";
import { useStyles } from "./style";
import Toolbar from "./Toolbar";
import { Message } from "components/common/Message";
import { Progress } from "components/common/Progress";
import { clearMessage, setMessage } from "redux/actions/msgAction";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={4}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`,
  };
}

export default function Report() {
  const [value, setValue] = useState(0);
  const [today, setToday] = useState(moment());
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [view, setView] = useState("week");
  const [type, setType] = useState("DAY");
  const classes = useStyles();

  const { id } = useParams();
  const dispatch = useDispatch();

  const [hasMessage, setOpenMessage] = useState(false);
  const { message } = useSelector((state) => state.message);
  const storeReport = useSelector((state) => state.reports);
  const [projectReport, setProjectReport] = useState([]);
  const [resourceReport, setResourceReport] = useState([]);

  const [overTime, setOverTime] = useState(0);
  const [trafficTime, setTrafficTime] = useState(0);
  const [allocatedTime, setAllocatedTime] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    dispatch(clearMessage());
    const startDate = start();
    const endDate = end();
    setStartDate(startDate);
    setEndDate(endDate);
    fetchReports(startDate, endDate, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReports = (startDate, endDate, loading = false) => {
    const params = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      type,
    };
    if (loading) {
      setLoading(true);
      dispatch(getReport(id, params)).finally(() => setLoading(false));
    } else dispatch(getReport(id, params));
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const startDate = start();
      const endDate = end();
      setStartDate(startDate);
      setEndDate(endDate);
      fetchReports(startDate, endDate);
    }
  }, [today, view, type]);

  useEffect(() => {
    if (!storeReport.data) {
      return;
    }
    setProjectReport(
      _.get(storeReport, ["data", "projectReports", "projects"])
    );
    setResourceReport(
      _.get(storeReport, ["data", "resourceReports", "resources"])
    );
    setOverTime(_.get(storeReport, ["data", "overTime"]));
    setTrafficTime(_.get(storeReport, ["data", "trafficTime"]));
    setAllocatedTime(_.get(storeReport, ["data", "allocatedTime"]));
  }, [storeReport]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeDropdown = (e) => {
    setView(e.target.value);
  };

  function start() {
    const isWeek = view === "week" ? 1 : 0;
    return today.clone().startOf(view).add(isWeek, DAY);
  }
  function end() {
    const isWeek = view === "week" ? 1 : 0;
    return today.clone().endOf(view).add(isWeek, DAY);
  }

  const handleCloseMessage = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenMessage(false);
  };

  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = () => {
    setExportLoading(true);
    const params = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      type: type,
    };
    dispatch(exportReport(id, params))
      .then(() => {
        setOpenMessage(true);
        setExportLoading(false);
      })
      .catch(() => {
        setOpenMessage(true);
        setExportLoading(false);
      })
      .finally(() => {
        dispatch(setMessage("export successfully!"));

        setOpenMessage(true);

        setExportLoading(false);
      });
  };
  return (
    <ThemeProvider theme={theme}>
      <Paper square elevation={0} className={`${classes.header}`}>
        <Toolbar
          view={view}
          startDate={startDate}
          endDate={endDate}
          handleChangeDropdown={handleChangeDropdown}
          today={today}
          setToday={setToday}
          handleExport={handleExport}
          setType={setType}
          type={type}
        />
      </Paper>

      <Statistics
        trafficTime={trafficTime}
        allocatedTime={allocatedTime}
        overTime={overTime}
        type={type}
      />

      <Paper square elevation={0} className={classes.tab}>
        <Tabs value={value} indicatorColor="primary" onChange={handleChange}>
          <Tab label="Resources" {...a11yProps(0)} />
          <Tab label="Projects" {...a11yProps(1)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
        <Chart
          reportData={resourceReport}
          reportType="resource"
          viewType={type}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Chart
          reportData={projectReport}
          reportType="project"
          viewType={type}
        />
      </TabPanel>

      {message ? (
        <Message
          message={message}
          isOpen={hasMessage}
          handleCloseMessage={handleCloseMessage}
          type={storeReport.status === 200 ? "success" : "error"}
        />
      ) : (
        <></>
      )}
      <Progress isOpen={isLoading} />
    </ThemeProvider>
  );
}
