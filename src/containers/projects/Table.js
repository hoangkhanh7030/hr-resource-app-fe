import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";

import { StyledTableCell, useStyles } from "./style";
import ProjectRow from "./TableRow";
import { LoadingTable } from "components/projects/LoadingTable";
import { EmptyRows } from "components/projects/EmptyRows";
import * as _ from "underscore";
import { PROJECT_NAME, CLIENT_NAME, IS_ACTIVATED } from "constants/index";

const ProjectsTable = ({ rows = [], emptyRows = 5, handleSort, isLoading }) => {
  const classes = useStyles({ emptyRows });

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell width="45%">
              <Typography variant="h3" className={classes.flex}>
                Project Name
                <IconButton
                  className={`${classes.tableTitleIcon} fas fa-sort`}
                  onClick={() => handleSort(PROJECT_NAME)}
                ></IconButton>
              </Typography>
            </StyledTableCell>
            <StyledTableCell width="25%" align="center">
              <Typography variant="h3" className={classes.tableTitleCenter}>
                Client Name
                <IconButton
                  className={`${classes.tableTitleIcon} ${classes.tableTitleIconCenter} fas fa-sort`}
                  onClick={() => handleSort(CLIENT_NAME)}
                ></IconButton>
              </Typography>
            </StyledTableCell>
            <StyledTableCell width="15%" align="center">
              <Typography variant="h3" className={classes.tableTitleCenter}>
                Status
                <IconButton
                  className={`${classes.tableTitleIcon} ${classes.tableTitleIconCenter} fas fa-sort`}
                  onClick={() => handleSort(IS_ACTIVATED)}
                ></IconButton>
              </Typography>
            </StyledTableCell>
            <StyledTableCell width="15%" align="center">
              Actions
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <LoadingTable />
          ) : (
            <>
              {rows.map((row) => (
                <ProjectRow key={_.get(row, "id")} project={row} />
              ))}

              <EmptyRows
                isFullPage={!emptyRows}
                isEmptyTable={rows.length === 0}
                rowHeight={classes.emptyRows}
              />
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectsTable;
