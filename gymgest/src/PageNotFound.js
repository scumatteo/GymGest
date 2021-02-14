import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link, withRouter } from "react-router-dom";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  toolbar: {
    marginTop: "5px",
    marginBottom: "5px",
    "@media(min-width: 993px)": {
      margin: theme.spacing(1),
      justifyContent: "space-between",
    },
  },

  content: {
    marginTop: theme.spacing(13),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(16),
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  appbarTitle: {
    fontSize: 22,
    "@media(min-width: 993px)": {
      fontSize: 26,
    },
  },
  title: {
    fontWeight: "600 !important",
    marginBottom: 30,
    "@media(min-width: 993px)": {
      marginBottom: 40,
    },
  },
  text: {
    marginBottom: 30,
    "@media(min-width: 993px)": {
      marginBottom: 40,
    },
  },
  image: {
    maxWidth: 100,
    maxHeight: 100,
    marginBottom: 30,
    "@media(min-width: 993px)": {
      marginBottom: 40,
    },
  },
});

class PageNotFound extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar>
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.appbarTitle} variant="h5">
              GymGest
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <Typography
            className={classes.title}
            variant="h2"
            color="primary"
            align="center"
          >
            GymGest
          </Typography>
          <Typography
            className={classes.text}
            variant="body1"
            color="primary"
            align="center"
          >
            C'è qualcosa che non va'
          </Typography>
          <img src="/emoji.png" alt="" className={classes.image} />
          <Link to="/">Torna alla homepage</Link>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(PageNotFound));
