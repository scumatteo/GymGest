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
  Menu,
  MenuItem,
  ClickAwayListener,
  Box,
  Tabs,
  FormControl,
  Card,
  Input,
  Tab,
  Badge,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import NotificationsIcon from "@material-ui/icons/Notifications";
import TelegramIcon from "@material-ui/icons/Telegram";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import MediaQuery from "react-responsive";
import clsx from "clsx";
import ConfirmationDialog from "./ConfirmationDialog";
import NotificationList from "./user/NotificationList";
import { getStatus } from "./NotificationStatus";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
    "z-index": "99 !important",
  },
  appbar: {
    "z-index": "99 !important",
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5px",
    "z-index": "99 !important",
    "@media(min-width: 993px)": {
      margin: theme.spacing(1),
    },
  },

  start: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "60%",
  },

  title: {
    fontSize: 22,
    marginTop: 10,
    "@media(min-width: 993px)": {
      fontSize: 26,
      marginLeft: theme.spacing(1),
    },
  },

  image: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    width: theme.spacing(25),
    height: theme.spacing(13),
  },

  hamburger: {
    fontSize: 26,
    marginRight: theme.spacing(2),
    "@media(min-width: 993px)": {
      margin: theme.spacing(1),
      fontSize: 30,
    },
  },

  icons: {
    width: "40%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  menuButton: {
    fontSize: 26,
    color: "white",
    margin: -3,
    "@media(min-width: 993px)": {
      margin: theme.spacing(1),
      marginTop: 10,
      fontSize: 30,
    },
  },
  search: {
    marginTop: 5,
    color: "white !important",
    "@media(min-width: 993px)": {
      marginTop: 20,
      minWidth: 260,
      width: "60%",
    },
  },
  underline: {
    color: "white !important",
    "&:before": {
      borderBottom: "1px solid white",
    },
    "&:after": {
      borderBottom: "1px solid white",
    },
    "@media(min-width: 993px)": {
      fontSize: 20,
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
  notificationCard: {
    position: "fixed",
    right: 0,
    top: 60,
    width: "70%",
    maxWidth: 350,
    maxHeight: "70%",

    overflow: "auto",
    "z-index": 100,
    "@media(min-width: 993px)": {
      top: 90,
      right: 20,
    },
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
});

class AccountAppbar extends Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
    this.page = sessionStorage.getItem("page");

    this.classes = this.props.classes;
    this.state = {
      notificationDiv: {
        hidden: true,
      },
      open: false,
      settings: null,
      logoutDialog: {
        open: false,
      },
    };

    this.items = this.props.tabs == null ? null : this.props.tabs.map((tab) => {
      return {
        name: tab.name,
        function: tab.function,
        icon: tab.icon,
      };
    });

    this.settingsItems =
      this.props.items == null
        ? []
        : this.props.items.map((item) => {
          return {
            name: item.name,
            function: item.function,
            icon: item.icon,
          };
        });

    this.settingsItems.push({
      name: "Esci",
      function: this.handleClickLogout,
      icon: <ExitToAppIcon color="primary" />,
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    if (window.innerWidth > 992 && this.state.open) {
      this.setState({ open: false });
    }
  };

  handleClickCancelLogout = (event) => {
    let { logoutDialog } = this.state;
    logoutDialog.open = false;
    this.setState({ logoutDialog });
  };

  handleClickOkLogout = (event) => {
    let { logoutDialog } = this.state;
    logoutDialog.open = false;
    this.setState({ logoutDialog });
    this.props.history.replace("/signin");
  };

  handleClickLogout = (event) => {
    let { logoutDialog } = this.state;
    logoutDialog.open = true;
    this.setState({ logoutDialog });
  };

  handleOpenSettingsMenu = (event) => {
    this.setState({ settings: event.currentTarget });
  };

  handleCloseSettingsMenu = () => {
    this.setState({ settings: null });
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

  handleClickSignIn = (e) => {
    e.preventDefault();
    this.props.history.push("/signin");
  };

  handleClickStaff = (e) => {
    e.preventDefault();
    this.props.history.push("/staff");
  };

  handleClickContacts = (e) => {
    e.preventDefault();
    this.props.history.push("/contacts");
  };

  handleOpenChat = () => {
    this.props.history.push("/chatList");
  };

  handleToggleNotificationList = () => {
    let { notificationDiv } = this.state;
    notificationDiv.hidden = !notificationDiv.hidden;
    if (notificationDiv.hidden && this.page === "user") {
      this.props.updateNotifications();
    }
    this.setState({
      notificationDiv,
    });
  };

  getMenuIconButton = (icon) => {
    return (
      <IconButton key={icon.key} aria-label="" onClick={icon.function}>
        {icon.icon}
      </IconButton>
    );
  };

  getFormControl = () => {
    return (
      <FormControl className={this.classes.search}>
        <Input
          id="standard-adornment-weight"
          onChange={this.props.handleSearchChange("searchContent")}
          value={this.props.searchContent}
          className={this.classes.underline}
          autoFocus
        />
      </FormControl>
    );
  };

  render() {
    this.icons = [
      {
        icon: <ExitToAppIcon className={this.classes.menuButton} />,
        function: this.handleClickLogout,
        show: "often",
        key: "exit",
      },
    ];

    if (sessionStorage.getItem("page") !== "admin") {
      this.icons.push({
        icon: (
          <Badge
            badgeContent={
              this.props.notifications === 0 ? null : this.props.notifications
            }
            color="secondary"
          >
            <NotificationsIcon className={this.classes.menuButton} />
          </Badge>
        ),
        function: this.handleToggleNotificationList,
        show: "always",
        key: "notification",
      });
      this.icons.push({
        icon: (
          <Badge
            badgeContent={
              this.props.messages === 0 ? null : this.props.messages
            }
            color="secondary"
          >
            <TelegramIcon className={this.classes.menuButton} />
          </Badge>
        ),
        function: this.handleOpenChat,
        show: "always",
        key: "chat",
      });
    }
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <div className={this.classes.root}>
          <AppBar position="fixed" className={this.classes.appbar}>
            <Toolbar className={this.classes.toolbar}>
              <div className={this.classes.start}>
                <MediaQuery maxDeviceWidth={992}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    edge="start"
                    className={clsx(
                      this.classes.hamburger,
                      this.state.open && this.classes.hide
                    )}
                  >
                    <MenuIcon />
                  </IconButton>
                  {this.props.search ? (
                    this.getFormControl()
                  ) : (
                      <Typography variant="h5" className={this.classes.title}>
                        {this.props.title}
                      </Typography>
                    )}
                </MediaQuery>
                <MediaQuery minDeviceWidth={993}>
                  <Typography variant="h5" className={this.classes.title}>
                    {this.props.title}
                  </Typography>
                </MediaQuery>
              </div>

              <div className={this.classes.icons}>
                <MediaQuery minDeviceWidth={993}>
                  {this.props.search ? this.getFormControl() : null}
                </MediaQuery>

                {this.props.search ? (
                  <IconButton
                    aria-label=""
                    onClick={this.props.handleCloseSearch}
                  >
                    <CloseIcon className={this.classes.menuButton} />
                  </IconButton>
                ) : (
                    <IconButton
                      aria-label=""
                      onClick={this.props.handleClickSearch}
                    >
                      <SearchIcon className={this.classes.menuButton} />
                    </IconButton>
                  )}
                {this.icons.length <= 1
                  ? this.icons.map((icon) => this.getMenuIconButton(icon))
                  : this.icons
                    .filter((icon) => {
                      return icon.show === "always";
                    })
                    .map((icon) => this.getMenuIconButton(icon))}

                <MediaQuery minDeviceWidth={993}>
                  {this.icons.length > 1 ? (
                    <IconButton
                      aria-label=""
                      onClick={this.handleOpenSettingsMenu}
                    >
                      <MoreVertIcon className={this.classes.menuButton} />
                    </IconButton>
                  ) : null}

                  <Menu
                    ref={this.menuRef}
                    id="styled-menu"
                    anchorEl={this.state.settings}
                    keepMounted
                    open={this.state.settings != null}
                    onClose={this.handleCloseSettingsMenu}
                  >
                    {this.settingsItems == null ? null : this.settingsItems.map((item) => {
                      return (
                        <MenuItem
                          key={item.name}
                          onClick={() => {
                            item.function();
                            this.handleCloseSettingsMenu();
                          }}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.name} />
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </MediaQuery>
              </div>
            </Toolbar>
            <Tabs
              value={this.props.title}
              onChange={this.props.tabFunction}
              variant="fullWidth"
            >
              {this.props.tabs == null ? null : this.props.tabs.map((tab) => {
                return <Tab key={tab.name} label={tab.name} value={tab.name} />;
              })}
            </Tabs>
          </AppBar>

          <Drawer
            className={this.classes.drawer}
            variant="persistent"
            anchor="left"
            open={this.state.open}
            classes={{
              paper: this.classes.drawerPaper,
            }}
          >
            <div className={this.classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Box display="flex" justifyContent="center">
              <Box>
                <img
                  className={this.classes.image}
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
              <Divider />
              {this.settingsItems == null ? null : this.settingsItems.map((item) => {
                return (
                  <ListItem button key={item.name} onClick={item.function}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
          <ConfirmationDialog
            open={this.state.logoutDialog.open}
            title="ESCI"
            content="Vuoi uscire?"
            handleCancel={this.handleClickCancelLogout}
            handleOk={this.handleClickOkLogout}
          />
          <Card
            className={this.classes.notificationCard}
            hidden={this.state.notificationDiv.hidden}
          >
            {sessionStorage.getItem("page") !== "admin" ? <NotificationList
              handleAccept={this.props.handleAccept}
              handleReject={this.props.handleReject}
              items={this.props.reservations == null ? [] : this.props.reservations.map((n) => {
                return this.page === "coach"
                  ? {
                    _id: n._id,
                    image: n.user.image,
                    alt: "profile image",
                    primary: n.user.name + " " + n.user.surname,
                    secondary:
                      n.date + " " + n.initialHour + " " + n.finalHour,
                  }
                  : {
                    _id: n._id,
                    image: n.coach.image,
                    alt: "profile image",
                    primary:
                      "Stato: " + getStatus(n.notification.status.status),
                    secondary:
                      n.date + " " + n.initialHour + " " + n.finalHour,
                  };
              })}
            /> : null}

          </Card>
        </div>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(withRouter(AccountAppbar));
