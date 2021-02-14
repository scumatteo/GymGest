import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  Divider,
  Typography,
  ListItemText,
  Box,
  CircularProgress,
  ListItem,
} from "@material-ui/core";
import MediaQuery from "react-responsive";
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { getLocation } from './API';
import './Map.css';

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  inline: {
    display: "inline",
  },
  divider: {
    marginLeft: theme.spacing(15),
    "@media(min-width: 993px)": {
      marginLeft: theme.spacing(22),
    },
  },
});


class Maps extends Component {
  state = {
    startedTracking: false,
    location: {
      lat: 0,
      lng: 0,
    },
    haveUsersLocation: false,
    actualCoordinate: 0,
    geoJson: null,
    timerTime: {},
    distance: 0,
  }

  componentDidMount() {

    if (sessionStorage.getItem("axiosMap") === "false") {
      this.setState({
        geoJson: JSON.parse(sessionStorage.getItem("geoJson")),
        timerTime: sessionStorage.getItem("time"),
        distance: sessionStorage.getItem("distance")
      })
    } else {
      Axios.get(`http://localhost:3001/api/mapDetail/${sessionStorage.getItem("dataMap")}`, {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }).then((res) => {
        const map = res.data;
        this.setState({
          geoJson: map.geoJson,
          timerTime: map.time,
          distance: map.distance
        });
      });
    }
    getLocation()
      .then(location => {
        this.setState({
          location,
          haveUsersLocation: true,
          zoom: 13,
        });
      })
  }

  render() {
    const { classes } = this.props;
    const position = [this.state.location.lat, this.state.location.lng];
    const { timerTime } = this.state;
    let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
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
            <Typography variant="h6">Allenamento</Typography>
          </Toolbar>
        </AppBar>
        {this.state.geoJson == null ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="60%"
          >
            <Box>
              <CircularProgress />
            </Box>
          </Box>
        ) : (
            <div>
              <div className="map">
                <Map
                  className="map"
                  worldCopyJump={true}
                  center={position}
                  zoom={this.state.zoom}
                >
                  <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors and Chat location by Iconika from the Noun Project"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <GeoJSON data={this.state.geoJson} style={this.getStyle} />
                </Map>
              </div>
              <List className={classes.root}>
                <Divider variant="inset" component="li" />
                <ListItem
                  alignItems="flex-start"
                  button={false}
                >
                  <ListItemText
                    primary={"Tempo Impiegato"}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {hours} : {minutes} : {seconds} : {centiseconds}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem
                  alignItems="flex-start"
                  button={false}
                >
                  <ListItemText
                    primary={"Distanza Percorsa"}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {this.state.distance + " km"}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </div>
          )}
      </div >

    );
  }
}

export default withStyles(styles)(withRouter(Maps));
