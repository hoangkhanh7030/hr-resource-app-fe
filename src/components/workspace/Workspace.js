import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import * as _ from "underscore";

import {
  Card,
  CardHeader,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  IconButton,
  ThemeProvider,
  Icon,
  Typography,
} from "@material-ui/core";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useStyles } from "./style";
import { theme, commonStyle } from "assets/css/Common";
import WorkspaceDialog from "./dialog/Dialog";
import AlertDialog from "components/common/AlertDialog";
import { useHistory } from "react-router-dom";
import { WORKSPACES_URL } from "constants/index";

export default function Workspace(props) {
  const {
    workspace = {},
    open = true,
    openDelete = true,
    content = {},
    name = "",
    handleOpenDialog,
    handleCloseDialog,
    handleInputName,
    error = "",
    onHandleSubmit,
    handleCloseDeleteDialog,
    handleOpenDeleteDialog,
    handelDeleteWorkspace,
  } = props;

  const history = useHistory();
  const classes = useStyles();
  const iconClasses = commonStyle();

  const noPermission = (workspace) => {
    return _.get(workspace, "role") !== "EDIT";
  };

  const accessWorkspacePage = (workspace) => {
    history.push(`${WORKSPACES_URL}/${_.get(workspace, "id")}`);
  };

  const info = {
    name: _.get(workspace, "name"),
    projectNum: `${_.get(workspace, "projectListLength")} Projects`,
    date: `Since ${moment(_.get(workspace, "createdDate")).format(
      "DD MMMM YYYY"
    )}`,
    resourceNum: `${_.get(workspace, "resourceListLength")} Members`,
  };

  const subHeader = (
    <ul className={classes.subheader}>
      <li>{info.projectNum}</li>
      <li>{info.date}</li>
      <li> {info.resourceNum}</li>
    </ul>
  );

  const [openOption, setOpenOption] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpenOption((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenOption(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenOption(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(openOption);
  useEffect(() => {
    if (prevOpen.current === true && openOption === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = openOption;
  }, [openOption]);

  return (
    <ThemeProvider theme={theme}>
      <Card className={classes.root}>
        <CardHeader
          action={
            noPermission(workspace) ? (
              <></>
            ) : (
              <IconButton ref={anchorRef} onClick={handleToggle}>
                <MoreHorizIcon />
              </IconButton>
            )
          }
          title={
            <Typography
              variant="h2"
              onClick={() => accessWorkspacePage(workspace)}
            >
              {info.name}
            </Typography>
          }
          subheader={subHeader}
          titleTypographyProps={{ variant: "h2" }}
        />
        <Popper
          open={openOption}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          placement="bottom-start"
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} className={classes.grow}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={openOption}
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleOpenDialog}>
                      <Icon
                        className={`${iconClasses.icon} fas fa-pen ${classes.icon}`}
                      />
                      Edit
                    </MenuItem>
                    <WorkspaceDialog
                      open={open}
                      content={content}
                      name={name}
                      handleCloseDialog={handleCloseDialog}
                      handleInputName={handleInputName}
                      onHandleSubmit={onHandleSubmit}
                      error={error}
                    />
                    <MenuItem onClick={handleOpenDeleteDialog}>
                      <Icon
                        className={`${iconClasses.icon} fas fa-trash ${classes.icon}`}
                      />
                      Delete
                    </MenuItem>
                    <AlertDialog
                      open={openDelete}
                      content={`Do you really want to delete ${name} workspace?`}
                      handleCloseDialog={handleCloseDeleteDialog}
                      handelDeleteWorkspace={handelDeleteWorkspace}
                    />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Card>
    </ThemeProvider>
  );
}
