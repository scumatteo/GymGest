import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  ListItem,
  ListItemAvatar,
  Avatar,
  List,
  ListItemText,
  Divider,
  FormControl,
  Input,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MediaQuery from "react-responsive";
import Axios from "axios";
import imageEncode from "../ImageEncoder";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  toolbar: {
    margin: 5,
  },
  goBack: {
    left: -10,
    color: "inherit",
  },
  menuButton: {
    position: "fixed",
    right: 10,
    "@media(min-width: 993px)": {
      right: 30,
    },
  },

  list: {
    marginTop: 60,
    "@media(min-width: 600px)": {
      marginTop: 68,
    },
    "@media(min-width: 993px)": {
      marginTop: 70,
    },
  },
  search: {
    color: "white !important",
  },

  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginRight: theme.spacing(3),
    "@media(min-width: 993px)": {
      marginLeft: theme.spacing(5),
      marginRight: theme.spacing(5),
      width: theme.spacing(13),
      height: theme.spacing(13),
    },
  },
  divider: {
    marginLeft: theme.spacing(15),
    "@media(min-width: 993px)": {
      marginLeft: theme.spacing(22),
    },
  },
});

class SelectList extends Component {
  constructor(props) {
    super(props);
    this.type = sessionStorage.getItem("page");

    this.state = {
      user: [],
      filtered: [],
      search: false,
      searchContent: "",
    };
  }

  componentDidMount() {
    if (this.type === "coach") {
      Axios.get(`http://localhost:3001/api/users`, {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }).then((res) => {
        const user = res.data;

        this.setState({ user: user, filtered: user });
      });
    } else {
      Axios.get(`http://localhost:3001/api/coaches`).then((res) => {
        const user = res.data;

        this.setState({ user: user, filtered: user });
      });
    }
  }

  handleGoBack = () => {
    this.props.history.goBack();
  };

  handleOpenSearch = () => {
    this.setState({ search: true });
  };

  handleCloseSearch = () => {
    this.setState({ search: false, searchContent: "", filtered: this.state.user });
  };

  handleSearchChange = (name) => (event) => {
    let content = this.state[name];
    content = event.target.value;
    let filtered = this.state.user.filter((user) => {
      let completeName =
        user.name.toUpperCase() + " " + user.surname.toUpperCase();
      return (
        completeName.includes(content.toUpperCase()) ||
        completeName.includes(content.toUpperCase())
      );
    });

    this.setState({
      searchContent: content,
      filtered: filtered,
    });
  };

  handleSelectUser = (user) => {
    this.props.history.push({
      pathname: "/chat",
      data: {
        user: user,
      },
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed" color="primary">
          <Toolbar className={classes.toolbar}>
            <MediaQuery maxDeviceWidth={992}>
              <IconButton
                onClick={this.handleGoBack}
                className={classes.goBack}
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
              <Typography variant="h6">
                {this.type === "coach" ? "Seleziona Utente" : "Seleziona Coach"}
              </Typography>
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
        <List className={classes.list}>
          {this.state.filtered == null ? null : this.state.filtered.map((user) => {
            return (
              <div key={user._id}>
                <ListItem button onClick={() => this.handleSelectUser(user)}>
                  <ListItemAvatar>
                    <Avatar
                      className={classes.avatar}
                      alt={"profile image"}
                      src={user.image != null ? imageEncode(user.image) : null}
                    />
                  </ListItemAvatar>
                  <ListItemText>{user.name + " " + user.surname}</ListItemText>
                </ListItem>
                <Divider className={classes.divider} />
              </div>
            );
          })}
        </List>
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(SelectList));
