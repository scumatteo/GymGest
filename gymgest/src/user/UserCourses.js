import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withRouter } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import LessonPage from "../lessons/LessonPage";
import MediaQuery from "react-responsive";


const styles = (theme) => ({

  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontWeight: "600 !important",
    marginTop: 20,
    "@media(min-width: 993px)": {
      marginTop: 40,
    },
  },

  course: {
    marginTop: theme.spacing(23),
    marginLeft: theme.spacing(3),

  },

});

class UserCourses extends Component {


  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <MediaQuery maxDeviceWidth={992}>
              <IconButton
                aria-label=""
                color="inherit"
                onClick={this.props.history.goBack}
              >
                <ArrowBackIcon />
              </IconButton>
            </MediaQuery>
            <Typography variant="h6">Corsi</Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.course}>
          <LessonPage coaches={sessionStorage.getItem("coaches")} />
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(withRouter(UserCourses));
