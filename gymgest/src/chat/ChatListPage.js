import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Fab,
  Box,
  IconButton,
  FormControl,
  Input,
  CircularProgress,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import MediaQuery from "react-responsive";
import GeneralList from "../user/GeneralList";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  toolbar: {
    margin: 5,
  },
  search: {
    color: "white !important",
  },

  list: {
    marginTop: theme.spacing(7),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(10),
    },
  },

  goBack: {
    left: -10,
  },

  menuButton: {
    position: "fixed",
    right: 10,
    "@media(min-width: 993px)": {
      right: 30,
    },
  },

  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
    "@media(min-width: 993px)": {
      right: 40,
      bottom: 40,
      width: 70,
      height: 70,
    },
  },
  fabIcon: {
    "@media(min-width: 993px)": {
      fontSize: 30,
    },
  },
  emptyDiv: {
    height: "100%",
    marginTop: 300,
    "@media(min-width: 993px)": {
      marginTop: 350,
    },
  },
});

class ChatListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: false,
      searchContent: "",
    };

    this.type = sessionStorage.getItem("page");
  }

  componentDidMount() {
    Axios.get("http://localhost:3001/api/chat", {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      const chats = res.data;
      this.setState({ chats: chats, filteredChats: chats });
    });
  }

  handleOpenSearch = () => {
    this.setState({ search: true });
  };

  handleCloseSearch = () => {
    this.setState({ search: false, searchContent: "", filteredChats: this.state.chats });
  };

  handleSearchChange = (name) => (event) => {
    let content = this.state[name];
    content = event.target.value;
    let filtered = this.state.chats.filter((chat) => {
      let other =
        chat.user1._id === sessionStorage.getItem("id") ? chat.user2 : chat.user1;

      let completeName =
        other.name.toUpperCase() + " " + other.surname.toUpperCase();
      return (
        completeName.includes(content.toUpperCase()) ||
        completeName.includes(content.toUpperCase())
      );
    });

    this.setState({
      searchContent: content,
      filteredChats: filtered,
    });
  };

  openCoachList = () => {
    this.props.history.push("/selectList");
  };

  openUserList = () => {
    this.props.history.push("/selectList");
  };

  handleClickUser = (id) => (event) => {
    const chat = this.state.chats.find((c) => {
      return c._id === id;
    });
    const other =
      sessionStorage.getItem("id") === chat.user1._id ? chat.user2 : chat.user1;
    this.props.history.push({
      pathname: "/chat",
      data: {
        user: other,
      },
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="primary">
          <Toolbar className={classes.toolbar}>
            <MediaQuery maxDeviceWidth={992}>
              <IconButton
                onClick={this.props.history.goBack}
                className={classes.goBack}
                color="inherit"
              >
                <ArrowBackIcon />
              </IconButton>
            </MediaQuery>
            {this.state.search ? (
              <FormControl>
                <Input
                  className={classes.search}
                  disableUnderline
                  id="search"
                  onChange={this.handleSearchChange("searchContent")}
                  value={this.state.searchContent}
                  autoFocus
                />
              </FormControl>
            ) : (
              <Typography variant="h6">Chat</Typography>
            )}

            <div className={classes.menuButton}>
              {this.state.search ? (
                <IconButton
                  aria-label="search"
                  color="inherit"
                  onClick={this.handleCloseSearch}
                >
                  <CloseIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="search"
                  color="inherit"
                  onClick={this.handleOpenSearch}
                >
                  <SearchIcon />
                </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.list}>
          {this.state.chats != null ? (
            this.state.chats.length === 0 ? (
              <Box
                className={classes.emptyDiv}
                display="flex"
                flexDirection="row"
                justifyContent="center"
              >
                <Box>
                  <Typography variant="body2">
                    Non hai iniziato ancora nessuna conversazione
                  </Typography>
                </Box>
              </Box>
            ) : (
              <GeneralList
                page="chat"
                handleClickItem={this.handleClickUser}
                items={this.state.filteredChats == null ? null : this.state.filteredChats.map((chat) => {
                  const other =
                    chat.user1._id === sessionStorage.getItem("id")
                      ? chat.user2
                      : chat.user1;
                  return {
                    _id: chat._id,
                    other: other,
                    image: other.image,
                    alt: "profile image",
                    primary: other.name + " " + other.surname,
                    secondary: other.phone,
                  };
                })}
              />
            )
          ) : (
            <Box
              className={classes.emptyDiv}
              display="flex"
              flexDirection="row"
              justifyContent="center"
            >
              <Box>
                <CircularProgress />
              </Box>
            </Box>
          )}
        </div>

        <Fab
          className={classes.fab}
          color="primary"
          aria-label="chat"
          onClick={
            sessionStorage.getItem("page") === "coach"
              ? this.openUserList
              : this.openCoachList
          }
        >
          <AddIcon className={classes.fabIcon} />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(ChatListPage));
