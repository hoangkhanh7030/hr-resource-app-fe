import { IconButton, TableHead, TableRow, Typography } from "@material-ui/core";
import {
  POSITION_NAME,
  RESOURCE_NAME,
  STATUS_NAME,
  TEAM_NAME,
} from "constants/index";
import React from "react";
import { StyledTableCell } from "./style";

export default function EnhancedTableHead(props) {
  const { classes, handleSort, sortName = "" } = props;

  return (
    <TableHead className={classes.headRoot}>
      <TableRow>
        <StyledTableCell align="center" width="10%">
          Avatar
        </StyledTableCell>
        <StyledTableCell align="left" width="26%">
          <Typography variant="h3" className={`${classes.flex}`}>
            Name
            <IconButton
              className={`fas fa-sort ${classes.sortIcon}`}
              style={{ color: sortName === RESOURCE_NAME ? "black" : "#CECECE" }}
              onClick={() => handleSort(RESOURCE_NAME)}
            ></IconButton>
          </Typography>
        </StyledTableCell>
        <StyledTableCell width="20%">
          <Typography variant="h3" className={`${classes.titleCenter}`}>
            Team
            <IconButton
              className={`fas fa-sort ${classes.rightSortIcon}`}
              style={{ color: sortName === TEAM_NAME ? "black" : "#CECECE" }}
              onClick={() => handleSort(TEAM_NAME)}
            ></IconButton>
          </Typography>
        </StyledTableCell>
        <StyledTableCell width="20%">
          <Typography variant="h3" className={`${classes.titleCenter}`}>
            Position
            <IconButton
              className={`fas fa-sort ${classes.rightSortIcon}`}
              style={{ color: sortName === POSITION_NAME ? "black" : "#CECECE" }}
              onClick={() => handleSort(POSITION_NAME)}
            ></IconButton>
          </Typography>
        </StyledTableCell>
        <StyledTableCell width="12%">
          <Typography variant="h3" className={`${classes.titleCenter}`}>
            Status
            <IconButton
              className={`fas fa-sort ${classes.rightSortIcon}`}
              style={{ color: sortName === STATUS_NAME ? "black" : "#CECECE" }}
              onClick={() => handleSort(STATUS_NAME)}
            ></IconButton>
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="center" width="12%">
          Actions
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
}
