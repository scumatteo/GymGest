import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  CircularProgress,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { withRouter } from "react-router-dom";
import imageEncode from "../ImageEncoder";
import ImageDrawer from "../drawers/ImageDrawer.js";
import Axios from "axios";
import GymHours from "../info/GymHours";
import DateDrawer from "../drawers/DateDrawer";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
  avatar: {
    "z-index": 1,
    width: theme.spacing(17),
    height: theme.spacing(17),
    marginRight: theme.spacing(3),
    marginTop: 80,
    "@media(min-width: 993px)": {
      marginLeft: theme.spacing(5),
      marginRight: theme.spacing(5),
    },
  },

  photoIconButton: {
    "z-index": 2,
    top: -50,
    left: 40,
  },

  photoIcon: {
    width: 40,
    height: 40,
  },

  listItem: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 20,
  },

  primary: {
    fontSize: 14,
  },

  secondary: {
    fontSize: 16,
  },

  container: {
    marginRight: theme.spacing(3),
  },
});

class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateValue: this.props.initDate,
      drawer: {
        open: false,
      },

      image: {
        src:
          this.props.user.image != null
            ? imageEncode(this.props.user.image)
            : "/camera.ico",
      },
    };
  }

  drawerImage = (openD) => () => {
    let { drawer } = this.state;
    drawer.open = openD;
    this.setState({ drawer });
  };

  handleCancel = () => {
    let { image } = this.state;
    let { drawer } = this.state;
    drawer.open = false;
    image.src =
      this.props.user.image != null
        ? imageEncode(this.props.user.image)
        : "/camera.ico";
    this.setState({
      image,
      drawer,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {Object.keys(this.props.user).length === 0 ? (
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
            <Box display="flex" alignItems="center" flexDirection="column">
              <Box>
                <Avatar
                  className={classes.avatar}
                  alt="profile image"
                  src={
                    this.props.user.image != null
                      ? imageEncode(this.props.user.image)
                      : null
                  }
                />
              </Box>
              {this.props.page === "profile" ? (
                <Box>
                  <IconButton
                    position="fixed"
                    className={classes.photoIconButton}
                  >
                    <img
                      src={this.state.image.src}
                      alt=""
                      className={classes.photoIcon}
                      onClick={this.drawerImage(true)}
                    ></img>
                  </IconButton>
                  <ImageDrawer
                    open={this.state.drawer.open}
                    src={this.state.src}
                    handleCancel={this.handleCancel}
                  />
                </Box>
              ) : null}
            </Box>

            <List>
              {this.props.userLabel == null
                ? null
                : this.props.userLabel.map((user) => {
                    return (
                      <div key={user.label}>
                        <ListItem button={true}>
                          <ListItemText
                            className={classes.listItem}
                            primary={
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.primary}
                                color="textPrimary"
                              >
                                {user.label}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.secondary}
                                color="textPrimary"
                              >
                                {user.value}
                              </Typography>
                            }
                          />
                          {user.enabled && this.props.page === "profile" ? (
                            <ListItemSecondaryAction
                              edge="end"
                              aria-label="delete"
                            >
                              <IconButton>
                                <EditIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          ) : null}
                        </ListItem>
                        <Divider></Divider>
                      </div>
                    );
                  })}
            </List>

            {sessionStorage.getItem("role") == "admin" ? (
              <Box display="flex" alignItems="center" flexDirection="column">
                <Box ml={"20%"} width={"80%"}>
                  <GymHours
                    type="admin"
                    title="Orari di lavoro"
                    toggleDrawer={this.props.toggleDrawer("dateDrawer", true)}
                    date={this.props.date}
                  />
                </Box>
              </Box>
            ) : null}
          </div>
        )}
        <DateDrawer
          info={this.props.date}
          open={this.props.drawer.open}
          subtitle={this.props.drawer.title}
          toggleDrawer={this.props.toggleDrawer("dateDrawer", false)}
          handleChange={this.props.handleChange}
          handleCancel={this.props.handleCancel}
          handleSave={this.props.handleSave}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(UserDetails));
