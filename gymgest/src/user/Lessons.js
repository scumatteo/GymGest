import React, { Component } from "react";
import LessonPage from "../lessons/LessonPage";
import HamburgerMenu from "./HamburgerMenu";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  lessons: {
    width: "80%",
    marginTop: theme.spacing(10),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(13),
    },
  },
  title: {
    fontWeight: "600 !important",
  },
});

class Lessons extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <HamburgerMenu></HamburgerMenu>
        <div className={classes.lessons}>
          <Typography className={classes.title} variant="h6" align="center">
            I NOSTRI CORSI
          </Typography>

          <LessonPage />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Lessons);
