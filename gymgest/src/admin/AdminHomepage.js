import React, { Component } from "react";
import AccountAppbar from "../AccountAppbar";
import { Fab } from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";
import InfoIcon from "@material-ui/icons/Info";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import ConfirmationDialog from "../ConfirmationDialog";
import GeneralList from "../user/GeneralList";
import Axios from "axios";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import ResponseDialog from "../ResponseDialog";
import CoachSignUp from "../auth/CoachSignUp";
import InsertDialog from "../InsertDialog";
import InfoPage from "./InfoPage";
import socket from "../global/Socket";

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

class AdminHomepage extends Component {
  constructor(props) {
    super(props);
    this.respDialog = React.createRef();

    sessionStorage.setItem("page", "admin");

    this.state = {
      title: "Utenti",

      deleteDialog: {
        open: false,
        id: "",
        type: "",
      },
      correctdeleteRespDialog: {
        open: false,
        response: "",
      },
      errordeleteRespDialog: {
        open: false,
        response: "",
      },
      coachSignUpDialog: {
        open: false,
      },

      search: false,
      searchContent: "",
    };
  }

  componentDidMount() {
    sessionStorage.setItem("socketId", socket.id);
    socket.emit("info", {
      socketId: socket.id,
      id: sessionStorage.getItem("id"),
    });
    Axios.get(`http://localhost:3001/api/users`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      const users = res.data;

      this.setState({ users: users, filteredUsers: users });
    });
    Axios.get(`http://localhost:3001/api/coaches`).then((res) => {
      const coaches = res.data;

      this.setState({ coaches: coaches, filteredCoaches: coaches });
    });
    Axios.get(`http://localhost:3001/api/info`).then((res) => {
      const info = res.data[0];

      this.setState({ info: info });
    });
    Axios.get(`http://localhost:3001/api/lessons`).then((res) => {
      const lessons = res.data;

      this.setState({ lessons: lessons });
    });

  }

  updateUsers = (users) => {
    this.setState({ users: users, filteredUsers: users });
  };

  addCoach = (coach) => {
    this.handleCloseSearch();
    let { coaches } = this.state;
    coaches.push(coach);
    this.setState({
      coaches: coaches,
      filteredCoaches: coaches,
    });
  };

  handleClickTab = (event, tab) => {
    this.setState({ title: tab });
  };

  handleClickUser = (event) => {
    this.setState({ title: "Utenti" });
  };

  handleClickCoach = (event) => {
    this.setState({ title: "Coach" });
  };

  handleClickInfo = (event) => {
    this.setState({ title: "Info" });
  };

  handleSignUpCoach = (event) => {
    let { coachSignUpDialog } = this.state;
    coachSignUpDialog.open = true;
    this.setState({ coachSignUpDialog });
  };

  handleCloseSignUpCoach = () => {
    let { coachSignUpDialog } = this.state;
    coachSignUpDialog.open = false;
    this.setState({ coachSignUpDialog });
  };

  handleClickCancelDelete = (event) => {
    let { deleteDialog } = this.state;
    deleteDialog.open = false;
    deleteDialog.id = "";
    deleteDialog.type = "";
    this.setState({ deleteDialog });
  };

  handleClickOkDelete = (event) => {
    let { deleteDialog } = this.state;
    let id = deleteDialog.id;
    let type = deleteDialog.type;
    deleteDialog.open = false;
    deleteDialog.id = "";
    deleteDialog.type = "";
    this.setState({ deleteDialog });
    if (type === "user") {
      Axios.delete(`http://localhost:3001/api/users/${id}`, {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setDialogProperties(this.state.correctdeleteRespDialog)(true)(
              res.data.message
            );
            let users = this.state.users.filter((user) => {
              return user._id !== id;
            });
            let filteredUsers = this.state.filteredUsers.filter((user) => {
              return user._id !== id;
            });
            this.setDialogClosing(this.state.correctdeleteRespDialog);
            this.setState({ users: users, filteredUsers: filteredUsers });
          }
        })
        .catch((err) => {
          if (err.response) {
            this.setDialogProperties(this.state.errordeleteRespDialog)(true)(true)(
              err.response.data.description
            );

            this.setDialogClosing(this.state.errordeleteRespDialog);
          }
        });
    } else if (type === "coach") {
      Axios.delete(`http://localhost:3001/api/coaches/${id}`, {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setDialogProperties(this.state.correctdeleteRespDialog)(true)(false)(
              res.data.message
            );
            let coaches = this.state.coaches.filter((coach) => {
              return coach._id !== id;
            });
            let filteredCoaches = this.state.filteredCoaches.filter((coach) => {
              return coach._id !== id;
            });
            this.setDialogClosing(this.state.correctdeleteRespDialog);
            this.setState({
              coaches: coaches,
              filteredCoaches: filteredCoaches,
            });
          }
        })
        .catch((err) => {
          if (err.response) {
            this.setDialogProperties(this.state.errordeleteRespDialog)(true)(true)(
              err.response.data.description
            );

            this.setDialogClosing(this.state.errordeleteRespDialog);
          }
        });
    }
  };

  handleClickSearch = (e) => {
    this.setState({ search: true });
  };

  handleSearchChange = (name) => (event) => {
    let content = this.state[name];
    content = event.target.value;
    let filteredUsers = this.state.users.filter((user) => {
      let completeName =
        user.name.toUpperCase() + " " + user.surname.toUpperCase();
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

    this.setState({
      searchContent: content,
      filteredUsers: filteredUsers,
      filteredCoaches: filteredCoaches,
    });
  };
  handleCloseSearch = (e) => {
    let users = this.state.users;
    let coaches = this.state.coaches;
    this.setState({
      search: false,
      searchContent: "",
      filteredUsers: users,
      filteredCoaches: coaches,
    });
  };

  setDialogProperties = (dialog) => (open) => (response) => {
    dialog.open = open;
    dialog.response = response;
    this.setState({
      dialog,
    });
  };

  handleClickCoachDetail = (id) => (event) => {
    event.preventDefault();
    sessionStorage.setItem("idUser", id);
    sessionStorage.setItem("role", "admin");
    sessionStorage.setItem("page", "details");
    this.props.history.push({
      pathname: "/details",
    });
  };

  setDialogClosing = (dialog) => (navigate) => {
    setTimeout(() => {
      this.setDialogProperties(dialog)(false)("");
      if (navigate != null) {
        navigate();
      }
    }, 2000);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AccountAppbar
          type="admin"
          tabs={[
            {
              name: "Utenti",
              function: this.handleClickUser,
              icon: <GroupIcon color="primary" />,
            },
            {
              name: "Coach",
              function: this.handleClickCoach,
              icon: <GroupIcon color="primary" />,
            },
            {
              name: "Info",
              function: this.handleClickInfo,
              icon: <InfoIcon color="primary" />,
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
          <GeneralList
            items={
              this.state.filteredUsers == null
                ? null
                : this.state.filteredUsers.map((user) => {
                  return {
                    _id: user._id,
                    image: user.image,
                    alt: "profile image",
                    primary: user.name + " " + user.surname,
                    secondary: user.email,
                  };
                })
            }
            page="admin"
            
          />
        ) : this.state.title === "Coach" ? (
          <GeneralList
          handleClickItem={this.handleClickCoachDetail}
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
            page="admin"
            
          />
        ) : (

              <InfoPage
                coaches={this.state.coaches}
                info={this.state.info}
                lessons={this.state.lessons}
              />
            )}
        {this.state.title === "Coach" ? (
          <Fab
            color="primary"
            aria-label="add"
            className={classes.fab}
            onClick={this.handleSignUpCoach}
          >
            <AddIcon className={classes.fabIcon} />
          </Fab>
        ) : null}

        <ConfirmationDialog
          open={this.state.deleteDialog.open}
          title="ELIMINA"
          content={
            this.state.deleteDialog.type === "user"
              ? "Vuoi eliminare questo utente?"
              : "Vuoi eliminare questo coach?"
          }
          handleCancel={this.handleClickCancelDelete}
          handleOk={this.handleClickOkDelete}
        />

        <ResponseDialog
          ref={this.respDialog}
          open={this.state.correctdeleteRespDialog.open}
          title={"CANCELLAZIONE AVVENUTA"}
          content={this.state.correctdeleteRespDialog.response}
          icon={
            <CheckCircleRoundedIcon
              color="primary"
              style={{ fontSize: 40 }}
            />
          }
        />
        <ResponseDialog
          ref={this.respDialog}
          open={this.state.errordeleteRespDialog.open}
          title={"ERRORE"}
          content={this.state.errordeleteRespDialog.response}
          icon={
            <CancelIcon
              color="secondary"
              style={{ fontSize: 40 }}
            ></CancelIcon>
          }
        />
        <InsertDialog
          open={this.state.coachSignUpDialog.open}
          onClick={this.handleCloseSignUpCoach}
          title="REGISTRA COACH"
          content={
            <CoachSignUp
              onSubmit={this.handleCloseSignUpCoach}
              addCoach={this.addCoach}
            />
          }
        />
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(AdminHomepage));
