import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import EventNoteIcon from "@material-ui/icons/EventNote";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withRouter } from "react-router-dom";
import Calendar from "../calendar/Calendar.js";
import AccountAppbar from "../AccountAppbar";
import GroupIcon from "@material-ui/icons/Group";
import ConfirmationDialog from "../ConfirmationDialog";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Axios from "axios";
import GeneralList from "./GeneralList.js";
import socket from "../global/Socket";
import { updateChat } from "../ChatFunctions";
import { composeDateTime } from "../calendar/Utility";
import {CircularProgress, Box } from "@material-ui/core";

var moment = require("moment");
const styles = (theme) => ({
  root: {
    display: "flex",
  },
  list: {
    marginTop: theme.spacing(13),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(16),
    },
  },
  calendar: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(18),
  
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(20),
     
    },
  },
});

class CoachBasicView extends Component {
  constructor(props) {
    super(props);
    sessionStorage.setItem("page", "coach");

    this.state = {
      messages: 0,
      notifications: 0,
      reservations: [],
      coachReservations: [],
      search: false,
      searchContent: "",
      user: [],
      plans: [],
      filteredPlans: [],
      filtered: [],
      contatore: "1",
      title: "Utenti",
      logoutDialog: {
        open: false,
      },
    };
  }

  componentDidMount() {
    sessionStorage.setItem("socketId", socket.id);
    window.addEventListener("load", (event) => {
      socket.emit("info", {
        socketId: socket.id,
        id: sessionStorage.getItem("id"),
      });
    });
    sessionStorage.setItem("messages", "0");
    Axios.get("http://localhost:3001/api/unreadmessages", {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      let unread = {};
      res.data.forEach((msg) => {
        unread[msg.fromUser] = 0;
      });
      res.data.forEach((msg) => {
        let i = unread[msg.fromUser];
        unread[msg.fromUser] = i + 1;
      });
      sessionStorage.setItem("unread", JSON.stringify(unread));
      let count = res.data.length;
      let messages = sessionStorage.getItem("messages");
      messages = parseInt(messages) + count;
      sessionStorage.setItem("messages", messages.toString());
      this.setState({ messages: messages });
    });
    socket.off("chat message");
    socket.on("chat message", (msg) => {
      let otherId = sessionStorage.getItem("onChat");
      if (otherId != null) {
        sessionStorage.setItem("chat", JSON.stringify(msg));
        updateChat();
      } else {
        let unread = JSON.parse(sessionStorage.getItem("unread"));

        let i = unread[msg.fromUser._id] == null ? 0 : unread[msg.fromUser._id];

        unread[msg.fromUser._id] = i + 1;
        sessionStorage.setItem("unread", JSON.stringify(unread));
        let messages = sessionStorage.getItem("messages");
        messages = parseInt(messages) + 1;
        sessionStorage.setItem("messages", messages.toString());

        this.setState({ messages: messages });
      }
    });
    Axios.get(`http://localhost:3001/api/info`).then((res) => {
      const info = res.data[0];


      this.setState({ info: info });
    });
    Axios.get(`http://localhost:3001/api/reservations`, {
      headers: {
        "x-access-token": sessionStorage.getItem("accessToken"),
      },
    }).then((res) => {
      const coachReservations = res.data;
      this.setState({ coachReservations: coachReservations });
    });
    Axios.get(`http://localhost:3001/api/pendingReservations`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      let reservations = res.data;
      this.setState({
        notifications: res.data.length,
        reservations: reservations,
      });
      socket.off("notification");
      socket.on("notification", (notification) => {
        let { reservations, notifications } = this.state;
        notifications += 1;
        reservations.push(notification);
        this.setState({ reservations, notifications });
      });
    });
    Axios.get(`http://localhost:3001/api/users`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      const user = res.data;
      this.setState({ user: user, filtered: user });
    });
    Axios.get(`http://localhost:3001/api/plans`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      const plans = res.data;
      this.setState({ plans: plans, filteredPlans: plans });
    });
  }

  handleClickAcceptNotification = (item) => () => {
    Axios.put(
      `http://localhost:3001/api/acceptReservation/${item._id}`,
      {},
      {
        headers: {
          "x-access-token": sessionStorage.getItem("accessToken"),
        },
      }
    ).then((res) => {
      let { reservations, notifications } = this.state;
      let reservation = reservations.find((r) => r._id === item._id);
      reservations.splice(reservations.indexOf(reservation), 1);
      notifications -= 1;
      this.setState({ reservations, notifications });
    });
  };

  handleClickRejectNotification = (item) => () => {
    Axios.put(
      `http://localhost:3001/api/rejectReservation/${item._id}`,
      {},
      {
        headers: {
          "x-access-token": sessionStorage.getItem("accessToken"),
        },
      }
    ).then((res) => {
      let { reservations, notifications } = this.state;
      let reservation = reservations.find((r) => r._id === item._id);
      reservations.splice(reservations.indexOf(reservation), 1);
      notifications -= 1;
      this.setState({ reservations, notifications });
    });
  };

  handleClickUserDetails = (id) => (event) => {
    event.preventDefault();
    sessionStorage.setItem("idUser", id);
    sessionStorage.setItem("role", "coach");
    sessionStorage.setItem("page", "details");
    this.props.history.push({
      pathname: "/details",
    });
  };

  handleChange = (event, newValue) => {
    this.setState({ contatore: newValue });
  };

  handleClickUser = (event) => {
    this.setState({ title: "Utenti" });
  };

  handleClickPlans = (event) => {
    this.setState({ title: "Schede" });
  };

  handleClickCalendar = (event) => {
    this.setState({ title: "Prenotazioni" });
  };

  handleClickCancel = (event) => {
    let { logoutDialog } = this.state;
    logoutDialog.open = false;
    this.setState({ logoutDialog });
  };

  handleClickOk = (event) => {
    let { logoutDialog } = this.state;
    logoutDialog.open = false;
    this.setState({ logoutDialog });
    this.props.history.replace("/signin");
  };

  handleClickProfilo = (event) => {
    this.props.history.push({
      pathname: "/cprofile",
    });
  };

  handleClickLogout = (event) => {
    let { logoutDialog } = this.state;
    logoutDialog.open = true;
    this.setState({ logoutDialog });
  };

  handleClickTab = (event, tab) => {
    this.setState({ title: tab });
  };

  handleClickPlansDetail = (id) => (event) => {
    event.preventDefault();
    sessionStorage.setItem("idPlan", id);
    this.props.history.push({
      pathname: "/plansDetails",
    });
  };

  handleClickSearch = (e) => {
    if (this.state.title !== "Prenotazioni") {
      this.setState({ search: true });
    }
  };

  handleSearchChange = (name) => (event) => {
    let content = this.state[name];
    content = event.target.value;
    let filteredPlans = this.state.plans.filter((plan) => {
      let completeName = "SCHEDA PER " + plan.goal.toUpperCase();
      return (
        completeName.includes(content.toUpperCase()) ||
        completeName.includes(content.toUpperCase())
      );
    });
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
      filteredPlans: filteredPlans,
      filtered: filtered,
    });
  };

  handleCloseSearch = (e) => {
    let users = this.state.user;
    let plans = this.state.plans;

    this.setState({
      search: false,
      searchContent: "",
      filtered: users,
      filteredPlans: plans,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <CssBaseline />
        <AccountAppbar
          messages={this.state.messages}
          notifications={this.state.notifications}
          reservations={this.state.reservations}
          handleAccept={this.handleClickAcceptNotification}
          handleReject={this.handleClickRejectNotification}
          tabs={[
            {
              name: "Utenti",
              function: this.handleClickUser,
              icon: <GroupIcon color="primary" />,
            },
            {
              name: "Schede",
              function: this.handleClickPlans,
              icon: <MenuBookIcon color="primary" />,
            },
            {
              name: "Prenotazioni",
              function: this.handleClickCalendar,
              icon: <EventNoteIcon color="primary" />,
            },
          ]}
          items={[
            {
              name: "Profilo",
              function: this.handleClickProfilo,
              icon: <AccountCircleIcon color="primary" />,
            },
          ]}
          title={this.state.title}
          tabFunction={this.handleClickTab}
          search={this.state.search}
          searchContent={this.state.searchContent}
          handleClickSearch={this.handleClickSearch}
          handleSearchChange={this.handleSearchChange}
          handleCloseSearch={this.handleCloseSearch}
        />
        <div className={classes.list}></div>
        {this.state.title === "Utenti" ? (
          <div>
            {Object.keys(this.state.filtered).length === 0 ? (
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
                <GeneralList
                  items={this.state.filtered == null ? null : this.state.filtered.map((user) => {
                    return {
                      _id: user._id,
                      image: user.image,
                      alt: "profile image",
                      primary: user.name + " " + user.surname,
                      secondary: user.email,
                    };
                  })}
                  handleClickItem={this.handleClickUserDetails}
                  type={this.state.type}
                  page="user"
                />
              )}
          </div>
        ) : this.state.title === "Schede" ? (
          <GeneralList
            items={this.state.filteredPlans == null ? null : this.state.filteredPlans.map((plan) => {
              return {
                _id: plan._id,
                initialDate: moment(plan.initialDate).format("YYYY-MM-DD"),
                finalDate: moment(plan.finalDate).format("YYYY-MM-DD"),
                goal: plan.goal,
              };
            })}
            handleClickItem={this.handleClickPlansDetail}
            type={this.state.type}
            page="plans"
          />
        ) : (
              <div className={classes.calendar}>
                <Calendar
                 
                  date={this.state.info.date}
                  workingDays={JSON.parse(sessionStorage.getItem("workingDays"))}
                  events={this.state.coachReservations == null ? null : this.state.coachReservations.map((reservation) => {
                    return {
                      title: "Personal",
                      start: composeDateTime(
                        reservation.date,
                        reservation.initialHour
                      ),
                      end: composeDateTime(
                        reservation.date,
                        reservation.finalHour
                      ),
                      color: reservation.notification.status.status === "pending" ? "black"
                        : "blue",
                    };
                  })}
                />
              </div>
            )}
        <ConfirmationDialog
          open={this.state.logoutDialog.open}
          title="ESCI"
          content="Vuoi uscire?"
          handleCancel={this.handleClickCancel}
          handleOk={this.handleClickOk}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(CoachBasicView));
