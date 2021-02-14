import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  ClickAwayListener,
  Box,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import HomeIcon from "@material-ui/icons/Home";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import PeopleIcon from "@material-ui/icons/People";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import MediaQuery from "react-responsive";
import clsx from "clsx";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(4),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: "5px",
    marginBottom: "5px",
    "@media(min-width: 993px)": {
      margin: theme.spacing(1),
      justifyContent: "space-between",
    },
  },

  title: {
    fontSize: 22,
    "@media(min-width: 993px)": {
      fontSize: 26,
    },
  },

  image: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    width: theme.spacing(25),
    height: theme.spacing(13),
  },

  menuButton: {
    marginRight: theme.spacing(2),
    "@media(min-width: 993px)": {
      margin: theme.spacing(1),
    },
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
});

class HamburgerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "GymGest",
    };

    this.items = [
      {
        name: "Home",
        function: this.handleClickHome,
        icon: <HomeIcon color="primary" />,
      },
      {
        name: "Registrati",
        function: this.handleClickSignUp,
        icon: <AddCircleIcon color="primary" />,
      },
      {
        name: "Login",
        function: this.handleClickSignIn,
        icon: <VpnKeyIcon color="primary" />,
      },
      {
        name: "Lo staff",
        function: this.handleClickStaff,
        icon: <PeopleIcon color="primary" />,
      },
      {
        name: "I corsi",
        function: this.handleClickLessons,
        icon: <ListAltIcon color="primary" />,
      },
      {
        name: "Contatti",
        function: this.handleClickContacts,
        icon: <ContactSupportIcon color="primary" />,
      },
    ];
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    if (window.innerWidth > 992) {
      this.setState({ open: false });
    }
  };

  handleClickAway = () => {
    if (this.state.open) {
      this.handleDrawerClose();
    }
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleClickHome = (e) => {
    e.preventDefault();
    this.props.history.push("/");
  };

  handleClickSignUp = (e) => {
    e.preventDefault();
    this.props.history.push("/signup");
  };

  handleClickSignIn = (e) => {
    e.preventDefault();
    this.props.history.push("/signin");
  };

  handleClickStaff = (e) => {
    e.preventDefault();
    this.props.history.push("/staff");
  };

  handleClickLessons = (e) => {
    e.preventDefault();
    this.props.history.push("/homepagelessons");
  };

  handleClickContacts = (e) => {
    e.preventDefault();
    this.props.history.push("/contacts");
  };

  render() {
    const { classes } = this.props;
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <div className={classes.root}>
          <AppBar position="fixed">
            <Toolbar className={classes.toolbar}>
              <MediaQuery maxDeviceWidth={992}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.handleDrawerOpen}
                  edge="start"
                  className={clsx(
                    classes.menuButton,
                    this.state.open && classes.hide
                  )}
                >
                  <MenuIcon />
                </IconButton>
              </MediaQuery>

              <Typography variant="h5" className={classes.title}>
                {this.state.title}
              </Typography>
              <MediaQuery minDeviceWidth={993}>
                <div>
                  {this.items == null ? null : this.items.map((item) => {
                    return (
                      <Button
                        key={item.name}
                        onClick={item.function}
                        color="inherit"
                        className={classes.menuButton}
                      >
                        {item.name}
                      </Button>
                    );
                  })}
                </div>
              </MediaQuery>
            </Toolbar>
          </AppBar>

          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={this.state.open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Box display="flex" justifyContent="center">
              <Box>
                <img
                  className={classes.image}
                  src="/gymgest_drawer.png"
                  alt="Gymgest logo"
                />
              </Box>
            </Box>
            <Divider />
            <List>
              {this.items == null ? null : this.items.map((item) => {
                return (
                  <ListItem button key={item.name} onClick={item.function}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
        </div>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(withRouter(HamburgerMenu));
