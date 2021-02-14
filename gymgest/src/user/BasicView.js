import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import AccountAppbar from "../AccountAppbar";
import GroupIcon from "@material-ui/icons/Group";
import ExploreIcon from "@material-ui/icons/Explore";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import InfoIcon from "@material-ui/icons/Info";
import PeopleIcon from "@material-ui/icons/People";
import GeneralList from "../user/GeneralList";
import Axios from "axios";
import socket from "../global/Socket";
import { updateChat } from "../ChatFunctions";
import { getStatus } from "../NotificationStatus";
import { Box, CircularProgress } from "@material-ui/core";

const styles = (theme) => ({
  list: {
    marginTop: theme.spacing(13),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(16),
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
});

class BasicView extends Component {
  constructor(props) {
    super(props);
    sessionStorage.setItem("page", "user");

    this.state = {
      messages: 0,
      title: "Coach",
      notifications: 0,
      reservations: [],
      search: false,
      searchContent: "",
      coaches: [],
      filteredCoaches: [],
      plans: [],
      filteredPlans: [],
      reservation: [],
      filteredReservation: [],
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

    Axios.get(`http://localhost:3001/api/coaches`).then((res) => {
      const coaches = res.data;
      this.setState({ coaches: coaches, filteredCoaches: coaches });
    });

    Axios.get(`http://localhost:3001/api/plans`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      const plans = res.data;
      this.setState({ plans: plans, filteredPlans: plans });
    });

    Axios.get(`http://localhost:3001/api/reservations`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      const reservation = res.data;
      reservation.sort((a, b) => {
        return a.date < b.date ? 1 : -1;
      });
      this.setState({
        reservation: reservation,
        filteredReservation: reservation,
      });
    });
    Axios.get(`http://localhost:3001/api/respondedReservations`, {
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

    Axios.get(`http://localhost:3001/api/info`).then((res) => {
      const info = res.data[0];
      this.setState({ info: info });
    });
  }
  handleUpdateNotifications = () => {
    let { reservations, notifications } = this.state;
    if (notifications > 0) {
      let ids = [];
      reservations.forEach((r) => ids.push(r._id));
      Axios.put(
        `http://localhost:3001/api/seenReservations/${JSON.stringify(ids)}`,
        {},
        { headers: { "x-access-token": sessionStorage.getItem("accessToken") } }
      )
        .then((res) => {
          reservations = [];
          notifications = 0;
          this.setState({ reservations, notifications });
        })
    }
  };

  updateUsers = (users) => {
    this.setState({ users: users, filteredUsers: users });
  };

  handleClickTab = (event, tab) => {
    this.setState({ title: tab });
  };

  handleClickPlan = (event) => {
    this.setState({ title: "Schede" });
  };

  handleClickCoach = (event) => {
    this.setState({ title: "Coach" });
  };

  handleClickCalendar = (event) => {
    this.setState({ title: "Prenotazioni" });
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
    let filteredCoaches = this.state.coaches.filter((coach) => {
      let completeName =
        coach.name.toUpperCase() + " " + coach.surname.toUpperCase();
      return (
        completeName.includes(content.toUpperCase()) ||
        completeName.includes(content.toUpperCase())
      );
    });
    let filteredReservation = this.state.reservation.filter((res) => {
      let completeName = res.date.toUpperCase();
      return (
        completeName.includes(content.toUpperCase()) ||
        completeName.includes(content.toUpperCase())
      );
    });

    this.setState({
      searchContent: content,
      filteredPlans: filteredPlans,
      filteredCoaches: filteredCoaches,
      filteredReservation: filteredReservation,
    });
  };
  handleCloseSearch = (e) => {
    let coaches = this.state.coaches;
    let plans = this.state.plans;
    let reservation = this.state.reservation;

    this.setState({
      search: false,
      searchContent: "",
      filteredCoaches: coaches,
      filteredPlans: plans,
      filteredReservation: reservation,
    });
  };

  setDialogProperties = (dialog) => (open) => (error) => (response) => {
    dialog.open = open;
    dialog.error = error;
    dialog.response = response;
    this.setState({
      dialog,
    });
  };

  setDialogClosing = (dialog) => {
    setTimeout(
      () => this.setDialogProperties(dialog)(false)(false)(""),

      2000
    );
  };

  handleClickCoachDetail = (id) => (event) => {
    event.preventDefault();
    sessionStorage.setItem("idUser", id);
    sessionStorage.setItem("role", "user");
    sessionStorage.setItem("page", "details");
    this.props.history.push({
      pathname: "/details",
    },
    );
  };

  handleClickReservationDetail = (event) => { };

  handleClickPlansDetail = (id) => (event) => {
    event.preventDefault();
    sessionStorage.setItem("idPlan", id);
    this.props.history.push({
      pathname: "/plansDetails",
    });
  };

  handleClickProfile = (event) => {
    this.props.history.push({
      pathname: "/uprofile",
    });
  };

  handleClickMaps = (event) => {
    this.props.history.push("/tracker");
  };

  handleClickCourse = (event) => {
    sessionStorage.setItem("coaches", this.state.coaches)
    this.props.history.push({
      pathname: "/courses",
    });
  };

  formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AccountAppbar
          messages={this.state.messages}
          reservations={this.state.reservations}
          notifications={this.state.notifications}
          updateNotifications={this.handleUpdateNotifications}
          tabs={[
            {
              name: "Coach",
              function: this.handleClickCoach,
              icon: <GroupIcon color="primary" />,
            },
            {
              name: "Schede",
              function: this.handleClickPlan,
              icon: <GroupIcon color="primary" />,
            },
            {
              name: "Prenotazioni",
              function: this.handleClickCalendar,
              icon: <InfoIcon color="primary" />,
            },
          ]}
          items={[
            {
              name: "Corsi",
              function: this.handleClickCourse,
              icon: <PeopleIcon color="primary" />,
            },
            {
              name: "Outdoor",
              function: this.handleClickMaps,
              icon: <ExploreIcon color="primary" />,
            },
            {
              name: "Profilo",
              function: this.handleClickProfile,
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
        {this.state.title === "Coach" ? (
          <div>
            {Object.keys(this.state.filteredCoaches).length === 0 ? (
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
                  items={
                    this.state.filteredCoaches == null
                      ? null
                      : this.state.filteredCoaches.map((coach) => {
                        return {
                          _id: coach._id,
                          image: coach.image,
                          alt: "profile image",
                          primary: coach.name + " " + coach.surname,
                          secondary: coach.email,
                        };
                      })
                  }
                  page="user"
                  handleClickItem={this.handleClickCoachDetail}
                />
              )}
          </div>
        ) : this.state.title === "Schede" ? (
          <GeneralList
            items={this.state.filteredPlans == null ? null : this.state.filteredPlans.map((plan) => {
              return {
                _id: plan._id,
                initialDate: this.formatDate(plan.initialDate),
                finalDate: this.formatDate(plan.finalDate),
                goal: plan.goal,
              };
            })}
            page="plans"
            handleClickItem={this.handleClickPlansDetail}
          />
        ) : (
              <GeneralList
                items={
                  this.state.filteredReservation == null
                    ? null
                    : this.state.filteredReservation.map((res) => {
                      return {
                        _id: res._id,
                        image: res.coach.image,
                        primary:
                          "Allenamento personale del " +
                          this.formatDate(res.date),
                        secondary: (
                          <Box display="flex" flexDirection="column">
                            <Box>
                              {"Orario: " +
                                res.initialHour +
                                " - " +
                                res.finalHour}
                            </Box>
                            <Box>
                              {"Stato: " +
                                getStatus(res.notification.status.status)}
                            </Box>
                          </Box>
                        ),
                      };
                    })
                }
                page="user"
                handleClickItem={this.handleClickReservationDetail}
              />
            )}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(BasicView));
