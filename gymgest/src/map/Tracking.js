import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AssignmentIcon from "@material-ui/icons/Assignment";
import MediaQuery from "react-responsive";
import { withRouter } from "react-router-dom";
import CancelIcon from "@material-ui/icons/Cancel";
import ResponseDialog from "./ResponseDialog";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import { getLocation, getGeoJson, startGeoJson, setGeoJson } from "./API";
import Axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@material-ui/core";

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing(20),
    margin: theme.spacing(16),
  },

  stopwatchDisplay: {
    padding: "40px 0",
    fontSize: "48px",
  },

  crono: {
    marginTop: theme.spacing(16),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  inline: {
    display: "inline",
  },

  buttonDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  archive: {
    fontSize: 26,
    color: "white",
    margin: -3,
    "@media(min-width: 993px)": {
      margin: theme.spacing(1),
      marginTop: 10,
      fontSize: 26,
    },
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },

  title: {
      display: "flex",
      flexDirection: "row"
  },

  icon:{
      marginRight: 20
  },

  tracking: {
      marginTop: 7.5,
      "@media(min-width: 993px)": {
        margin: theme.spacing(1),
        marginTop: 10,
        fontSize: 26,
      },
  }
});

class Tracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        open: false,
      },
      errorDialog: {
        open: false,
        response: "",
      },
      startedTracking: false,
      location: {
        lat: 0,
        lng: 0,
      },
      haveUsersLocation: false,
      actualCoordinate: 0,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
    };
  }

  componentDidMount() {
    this.resetTimer();
    this.tracker = setInterval(() => {
      getLocation().then((location) => {
        this.setState({
          location,
          haveUsersLocation: true,
        });
        if (this.state.startedTracking === true) {
          if (this.state.actualCoordinate === 0) {
            startGeoJson(location.lat, location.lng);
            this.setState({
              actualCoordinate: this.state.actualCoordinate + 1,
            });
          } else {
            setGeoJson(location.lat, location.lng);
            this.setState({
              actualCoordinate: this.state.actualCoordinate + 1,
            });
          }
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.tracker);
  }

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime,
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart,
      });
    }, 10);
  };

  stopTimer = () => {
    this.setState({ timerOn: false });
    clearInterval(this.timer);
  };

  resetTimer = () => {
    this.setState({
      timerStart: 0,
      timerTime: 0,
    });
  };

  uploadTracks = (workout) => {
    Axios.post("http://localhost:3001/api/maps", workout, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).catch((err) => {
      this.setDialogProperties(this.state.errorDialog)(true)(err);

      this.setDialogClosing(this.state.errorDialog)(null);
    });
  };

  handleButton = (event) => {
    event.preventDefault();
    if (this.state.startedTracking === true) {
      this.stopTimer();
      if (Math.floor(this.state.timerTime / 1000) % 60 > 10) {
        clearInterval(this.tracker);
        let workout = {
          date: new Date(),
          time: this.state.timerTime,
          distance: this.workoutDistance(getGeoJson()),
          geoJson: getGeoJson(),
        };
        this.uploadTracks(workout);
        sessionStorage.setItem("axiosMap", "false");
        sessionStorage.setItem("geoJson", JSON.stringify(workout.geoJson));
        sessionStorage.setItem("time", workout.time);
        sessionStorage.setItem("distance", workout.distance);

        this.props.history.push({
          pathname: "/map",
        });
      } else {
        this.resetTimer();
        this.setState({ startedTracking: false });
        this.setDialogProperties(this.state.dialog)(true);
        this.setDialogClosing(this.state.dialog);
      }
    } else {
      this.setState({ actualCoordinate: 0 });
      this.setState({ startedTracking: true });
      this.startTimer();
    }
  };

  handleArchive = (event) => {
    event.preventDefault();
    this.stopTimer();
    clearInterval(this.tracker);
    this.props.history.push({
      pathname: "/archive",
    });
  };

  workoutDistance = (geoJson) => {
    var totalDistance = 0;
    var coordinates = geoJson.features[0].geometry.coordinates;
    totalDistance = this.haversineDistance(
      coordinates[0],
      coordinates[1],
      false
    );

    for (var i = 0; i < coordinates.length - 1; i++) {
      for (var j = 1; j < coordinates.length; j++) {
        totalDistance += this.haversineDistance(
          coordinates[i],
          coordinates[j],
          false
        );
      }
    }
    return totalDistance / 10;
  };

  haversineDistance = ([lat1, lon1], [lat2, lon2], isMiles = false) => {
    const toRadian = (angle) => (Math.PI / 180) * angle;
    const distance = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    const dLat = distance(lat2, lat1);
    const dLon = distance(lon2, lon1);

    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    // Haversine Formula
    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.asin(Math.sqrt(a));

    let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

    if (isMiles) {
      finalDistance /= 1.60934;
    }

    return finalDistance;
  };

  setDialogProperties = (dialog) => (open) => {
    dialog.open = open;
    this.setState({
      dialog,
    });
  };

  setDialogClosing = (dialog) => {
    setTimeout(() => this.setDialogProperties(dialog)(false), 2000);
  };

  render() {
    const { classes } = this.props;
    const { timerTime } = this.state;
    let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
    return (
      <div>
        <AppBar position="fixed" color="primary">
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <MediaQuery maxDeviceWidth={992}>
                <IconButton
                  aria-label=""
                  color="inherit"
                  onClick={this.props.history.goBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              </MediaQuery>
              <Typography className={classes.tracking} variant="h6" >Tracking</Typography>
            </div>
            <div>
              <IconButton
              className={classes.icon}
                aria-label=""
                color="inherit"
                onClick={this.handleArchive}
              >
                <AssignmentIcon className={classes.archive} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Box className={classes.crono}>
          <div className={classes.stopwatchDisplay}>
            {hours} : {minutes} : {seconds} : {centiseconds}
          </div>
        </Box>
        <div className={classes.buttonDiv}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<DirectionsRunIcon />}
            onClick={this.handleButton}
          >
            {this.state.startedTracking === true ? "STOP" : "START"}
          </Button>
        </div>
        <ResponseDialog
          open={this.state.dialog.open}
          title={"Tracking breve"}
          content={"Il percorso non verrà salvato."}
          icon={
            <CancelIcon color="secondary" style={{ fontSize: 40 }}></CancelIcon>
          }
        />
        <ResponseDialog
          open={this.state.errorDialog.open}
          title={"ERRORE"}
          content={this.state.errorDialog.response}
          icon={
            <CancelIcon color="secondary" style={{ fontSize: 40 }}></CancelIcon>
          }
        />
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Tracker));
