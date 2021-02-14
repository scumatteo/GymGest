import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import {
  AppBar,
  Typography,
  Toolbar,
  FormControl,
  Input,
  IconButton,
  Box,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MediaQuery from "react-responsive";
import socket from "../global/Socket";
import imageEncode from "../ImageEncoder";
import Axios from "axios";
import { setUpdateChat, updateMessages } from "../ChatFunctions";

const styles = (theme) => ({
  root: {
    height: "85%",
    overflow: "auto",
  },

  toolbar: {
    margin: 5,
  },

  avatar: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    "@media(min-width: 993px)": {
      width: 55,
      height: 55,
      marginLeft: 20,
      marginRight: 30,
    },
  },

  chat: {
    marginTop: 70,
    display: "flex",
    flexDirection: "column",

    "@media(min-width: 600px)": {
      marginTop: 78,
    },
    "@media(min-width: 993px)": {
      marginTop: 80,
    },
  },
  myMessage: {
    marginRight: 10,
    display: "flex",

    justifyContent: "flex-end !important",
  },
  otherMessage: {
    marginLeft: 10,
    display: "flex",
    justifyContent: "flex-start !important",
  },

  messageBox: {
    marginTop: 7.5,
    padding: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },

  myMessageBox: {
    backgroundColor: "Gainsboro",
  },

  otherCard: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },

  textBox: {
    position: "fixed",
    bottom: 20,
    width: "100%",
  },

  sendBox: {
    width: "70%",
  },

  sendDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 8,
  },

  formControl: {
    width: "100%",
    paddingBottom: "0 !important",
  },

  input: {
    marginTop: 5,
    marginBottom: 5,
    "@media(min-width: 993px)": {
      marginTop: 10,
      marginBottom: 10,
    },
  },

  iconAvatar: {
    backgroundColor: theme.palette.primary.main,
    width: 50,
    height: 50,
    marginTop: 5,
    marginLeft: 10,
    "@media(min-width: 993px)": {
      marginTop: 10,
    },
  },

  goBack: {
    left: -10,
    padding: 0,
    color: "inherit",
  },
  emptyDiv: {
    height: "100%",
    marginTop: 300,
    "@media(min-width: 993px)": {
      marginTop: 350,
    },
  },
});

class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.messagesEnd = React.createRef();
    this.state = {
      text: "",
    };

    this.data = this.props.history.location.data;
  }

  componentWillUnmount() {
    sessionStorage.removeItem("onChat");
    sessionStorage.removeItem("chatUpdater");
    sessionStorage.removeItem("chat");
    setUpdateChat(() => {});
  }

  scrollToBottom() {
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    this.scrollToBottom();
    updateMessages(this.data.user._id);
    sessionStorage.setItem("onChat", this.data.user._id);

    Axios.get(
      `http://localhost:3001/api/messages/${this.data.user._id}`,

      {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }
    ).then((res) => {
      const messages = res.data;
      messages.sort((a, b) => {
        return a.timestamp < b.timestamp;
      });
      this.setState({ messages: messages });
      setUpdateChat(() => {
        updateMessages(this.data.user._id);
        let { messages } = this.state;
        let message = JSON.parse(sessionStorage.getItem("chat"));
        messages.push(message);
        this.setState({ messages });
      });
    });
  }

  setValue = (name) => (event) => {
    let content = this.state[name];
    content = event.target.value;
    this.setState({ text: content });
  };

  sendMessage = () => {
    let timestamp = Date.now();
    let { messages } = this.state;
    Axios.post(
      "http://localhost:3001/api/messages",
      {
        toId: this.data.user._id,
        content: this.state.text,
        timestamp: timestamp,
      },
      { headers: { "x-access-token": sessionStorage.getItem("accessToken") } }
    ).then((res) => {
      messages.push(res.data);
      this.setState({ messages });
    });

    socket.emit("chat message", {
      content: this.state.text,
      toUser: { _id: this.data.user._id },
      fromUser: { _id: sessionStorage.getItem("id") },
      timestamp: timestamp,
    });
    this.setState({ text: "" });
  };

  getAvatar = (classes) => {
    return (
      <Avatar
        className={classes.avatar}
        alt="profile image"
        src={
          this.data.user.image == null
            ? null
            : imageEncode(this.data.user.image)
        }
      />
    );
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
              >
                <ArrowBackIcon />
                {this.getAvatar(classes)}
              </IconButton>
            </MediaQuery>
            <MediaQuery minDeviceWidth={993}>
              {this.getAvatar(classes)}
            </MediaQuery>
            <Typography variant="h6">
              {this.data.user.name + " " + this.data.user.surname}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.chat}>
          {this.state.messages == null ? (
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
          ) : (
            <div>
              {this.state.messages == null ? null : this.state.messages.map((msg) => {
                return (
                  <div
                    key={msg._id != null ? msg._id : msg.timestamp}
                    className={
                      msg.fromUser._id === this.data.user._id
                        ? classes.otherMessage
                        : classes.myMessage
                    }
                  >
                    <Box
                      className={`${classes.messageBox} ${
                        msg.fromUser._id === sessionStorage.getItem("id")
                          ? classes.myMessageBox
                          : null
                      }`}
                      border={1}
                      borderColor="Gainsboro"
                      borderRadius={20}
                    >
                      {msg.content}
                    </Box>
                  </div>
                );
              })}
              <div
                id="ending"
                style={{ float: "left", clear: "both" }}
                ref={(el) => {
                  this.messagesEnd = el;
                }}
              ></div>
            </div>
          )}
        </div>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          className={classes.textBox}
        >
          <Box
            className={classes.sendBox}
            border={1}
            borderColor="Gainsboro"
            borderRadius={20}
          >
            <div className={classes.sendDiv}>
              <FormControl className={classes.formControl}>
                <Input
                  fullWidth
                  disableUnderline
                  id="chat"
                  onChange={this.setValue("text")}
                  value={this.state.text}
                  autoFocus
                  multiline
                  rowsMax={10}
                  className={classes.input}
                />
              </FormControl>
            </div>
          </Box>

          <Box>
            <Avatar className={classes.iconAvatar}>
              <IconButton color="inherit" onClick={this.sendMessage}>
                <SendIcon />
              </IconButton>
            </Avatar>
          </Box>
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(ChatPage));
