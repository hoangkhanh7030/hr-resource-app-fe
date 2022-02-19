import React, { Fragment } from "react";
import TheHeader from "../header/TheHeader";
import { Container } from "@material-ui/core";
import { useStyles } from "./style";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { LOGIN_URL } from "constants/index";
import Workspaces from "containers/workspaces/Workspaces";
import Workspace from "containers/workspace/Workspace";
import Report from "containers/report/Report";

export default function TheLayout(Component = Workspaces) {
  const classes = useStyles();
  const style = Component === Workspace ? classes.dashboard : classes.root;

  const { isLoggedIn } = useSelector((state) => state.auth);

  const pathName = window.location.pathname;
  localStorage.setItem(
    "path",
    !isLoggedIn && pathName !== LOGIN_URL ? pathName : ""
  );

  return isLoggedIn
    ? (props) => (
        <Fragment>
          <TheHeader />
          <Container
            maxWidth={false}
            className={Component === Report ? classes.dashboard : style}
          >
            <Component {...props} />
          </Container>
        </Fragment>
      )
    : () => <Redirect to={LOGIN_URL} />;
}
