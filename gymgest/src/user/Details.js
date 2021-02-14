import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import UserDetails from "./UserDetails";
import GeneralList from "./GeneralList";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import ResponseDialog from "../ResponseDialog";
import MediaQuery from "react-responsive";
import ReservationPicker from "../ReservationPicker";
import { composeDateTime } from "../calendar/Utility";

var moment = require("moment");

const styles = (theme) => ({
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

  details: {
    marginTop: theme.spacing(13),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(16),
    },
  },

  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  formControl: {
    margin: theme.spacing(3),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },

  input: {
    marginBottom: theme.spacing(15),
    marginLeft: theme.spacing(5),
  },

  selectionDialog: {
    margin: 20,
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
  container: {
    marginRight: theme.spacing(3),
  },

  calendar: {
    marginTop: "150px",
    margin: "20px",
    "@media(min-width: 993px)": {
      margin: "12px",
    },
  },
});

class Details extends Component {
  constructor(props) {
    super(props);
    this.dialog = React.createRef();

    this.state = {
      dateValue: [],
      dateDrawer: {
        title: "Orari di lavoro",
        open: false,
      },
      user: {},
      userLabel: [],
      planLabel: [],
      nameUser: "",
      addPlans: false,
      info: {},
      businessHours: [],
      dialogClick: false,
      fullWidth: true,
      maxWidth: "Trimestrale",
      selectedDate: {},
      selectTab: "Dettaglio",
      addNewPlans: {
        user: sessionStorage.getItem("idUser"),
        coach: sessionStorage.getItem("id"),
        intialDate: "",
        finalDate: "",
        goal: "",
        duration: "Trimestrale",
        exercices: "",
      },
      correctDialog: {
        open: false,
        response: "",
      },
      errorDialog: {
        open: false,
        response: "",
      },
    };
    this.id = sessionStorage.getItem("idUser");
  }

  componentDidMount() {

    this.setState({
      dialogClick: false,
      maxWidth: "Trimestrale",
      fullWidth: true,
    });
    Axios.get(`http://localhost:3001/api/info`).then((res) => {
      const info = res.data[0];
      this.setState({ info: info });
    });
    if (sessionStorage.getItem("role") === "coach") {
      this.handleAxiosPlans();

      Axios.get(`http://localhost:3001/api/users/${this.id}`, {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }).then((res) => {
        const user = res.data;

        const userLabel = [
          {
            label: "Nome",
            value: res.data.name + " " + res.data.surname,
            enabled: true,
          },
          { label: "Email", value: res.data.email, enabled: false },
          { label: "Codice fiscale", value: res.data.CF, enabled: false },
        ];
        this.setState({
          user: user,
          userLabel: userLabel,
          nameUser: user.name.toUpperCase() + " " + user.surname.toUpperCase(),
        });
      });
    } else {
      Axios.get(`http://localhost:3001/api/coaches/${this.id}`, {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }).then((res) => {
        const user = res.data;

        const userLabel = [
          {
            label: "Nome",
            value: res.data.name + " " + res.data.surname,
            enabled: true,
          },
          { label: "Email", value: res.data.email, enabled: false },
        ];

        if (user.bio != null) {
          userLabel.push({
            label: "Bio",
            value: res.data.bio,
            enabled: true,
          });
        }
        this.setState({
          dateValue: this.getInitialValue(user.workingDays),
          user: user,
          userLabel: userLabel,
          nameUser: user.name.toUpperCase() + " " + user.surname.toUpperCase(),
        });
      });
    }
    Axios.get(`http://localhost:3001/api/reservations`, {
      headers: {
        "x-access-token": sessionStorage.getItem("accessToken"),
      },
    }).then((res) => {
      const reservations = res.data;
      this.setState({ reservations: reservations });
    });
  }

  handleAxiosPlans = () => {
    Axios.get(`http://localhost:3001/api/plans/${this.id}`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    }).then((res) => {
      const plans = res.data;
      const planLabel = [
        {
          label: "Obiettivo della scheda",
          value: res.data.goal,
          enabled: false,
        },
        {
          label: "Data di inizio: ",
          value: moment(res.data.initialDate).format("DD-MM-YYYY"),
          enabled: false,
          type: "date",
        },
        {
          label: "Data di fine: ",
          value: moment(res.data.finalDate).format("DD-MM-YYYY"),
          enabled: false,
          type: "date",
        },
        { label: "Durata: ", value: res.data.duration, enabled: false },
        {
          label: "Esercizi: ",
          value: res.data.exercises,
          enabled: true,
        },
      ];
      this.setState({ plans: plans, planLabel: planLabel });
    });
  };

  handleAddPlans = (event) => {
    this.setState({ addPlans: true });
  };

  handleClickPlansDetail = (id) => (event) => {
    event.preventDefault();
    sessionStorage.setItem("idPlan", id);
    this.props.history.push({
      pathname: "/plansDetails",
    });
  };

  handleClickCloseDialog = () => {
    this.setState({ dialogClick: false });
  };

  handleClickOpenDialog = () => {
    this.setState({ dialogClick: true });
  };

  getInitialValue = (workingDays) => {
    let initialValue = [];
    if (workingDays != null) {
      for (let elem in workingDays) {
        initialValue.push(JSON.parse(JSON.stringify(workingDays[elem])));
      }
    }
    else {
      for (let i in [0, 1, 2, 3, 4, 5, 6]) {
        initialValue.push({ day: parseInt(i), initialHour: "08:00", finalHour: "16:00" });
      }

    }

    return initialValue;
  };

  setDialogProperties = (dialog) => (open) => (response) => {
    dialog.open = open;
    dialog.response = response;
    this.setState({
      dialog,
    });
  };

  setDialogClosing = (dialog) => {
    setTimeout(() => {
      this.setDialogProperties(dialog)(false)("");
    }, 2000);
  };

  handleCheck = () => {
    if (
      this.state.addNewPlans.goal === "" ||
      this.state.addNewPlans.initialDate === "" ||
      this.state.addNewPlans.finalDate === ""
    ) {
      this.setDialogProperties(this.state.errorDialog)(true)(
        "Campi obbligatori non inseriti!"
      );
      this.setDialogClosing(this.state.errorDialog);
    } else {
      if (
        this.state.addNewPlans.initialDate > this.state.addNewPlans.finalDate
      ) {
        this.setDialogProperties(this.state.errorDialog)(true)(
          "La data di inizio scheda inserita è successiva alla data di fine!"
        );
        this.setDialogClosing(this.state.errorDialog);
      } else this.handleClickAddPlans();
    }
  };

  handleClickAddPlans = () => {
    let plan = {
      idUser: sessionStorage.getItem("idUser"),
      initialDate: this.state.addNewPlans.initialDate,
      finalDate: this.state.addNewPlans.finalDate,
      goal: this.state.addNewPlans.goal,
      duration: this.state.addNewPlans.duration,
      exercises: this.state.addNewPlans.exercices,
    };
    this.handleClickCloseDialog();
    Axios.post(`http://localhost:3001/api/plans`, plan, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    })
      .then((res) => {
        if (res.status === 201) {
          this.setDialogProperties(this.state.correctDialog)(true)(
            "Inserimento andato a buon fine!"
          );
          this.setDialogClosing(this.state.correctDialog);
          let { addNewPlans } = this.state;
          addNewPlans.goal = "";
          addNewPlans.initialDate = "";
          addNewPlans.finalDate = "";
          addNewPlans.duration = "Trimestrale";
          addNewPlans.exercices = "";
          this.setState({ dialogClick: false, addNewPlans: addNewPlans });
          this.handleAxiosPlans();
        }
      })
      .catch((err) => {
        if (err.response) {
          this.setDialogProperties(this.state.errorDialog)(true)(
            err.response.data.description
          );

          this.setDialogClosing(this.state.errorDialog);
          let { addNewPlans } = this.state;
          addNewPlans.goal = "";
          addNewPlans.initialDate = "";
          addNewPlans.finalDate = "";
          addNewPlans.duration = "Trimestrale";
          addNewPlans.exercices = "";
          this.setState({ addNewPlans: addNewPlans });
        }
      });
    let { plans } = this.state;
    plans.push(plan);
    this.setState({
      plans: plans,
    });
  };

  handleChangeObj = (event) => {
    let { addNewPlans } = this.state;
    addNewPlans.goal = event.target.value;
    this.setState({ addNewPlans: addNewPlans });
  };

  handleChangeInitial = (event) => {
    let { addNewPlans } = this.state;
    addNewPlans.initialDate = event.target.value;
    this.setState({ addNewPlans: addNewPlans });
  };

  handleChangeFinal = (event) => {
    let { addNewPlans } = this.state;
    addNewPlans.finalDate = event.target.value;
    this.setState({ addNewPlans: addNewPlans });
  };

  handleChangeExercices = (event) => {
    let { addNewPlans } = this.state;
    addNewPlans.exercices = event.target.value;
    this.setState({ addNewPlans: addNewPlans });
  };

  handleMaxWidthChange = (event) => {
    this.setState({ maxWidth: event.target.value });
    let { addNewPlans } = this.state;
    addNewPlans.duration = event.target.value;
    this.setState({ addNewPlans: addNewPlans });
  };

  handleFullWidthChange = (event) => {
    this.setState({ fullWidth: event.target.checked });
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };

  handleClickTab = (event, tab) => {
    this.setState({ selectTab: tab });
  };

  handleCancelDate = () => {
    let { dateValue, dateDrawer } = this.state;
    dateValue = this.getInitialValue(this.state.user.workingDays);
    dateDrawer.open = false;
    this.setState({ dateValue, dateDrawer });
  };

  handleHourChange = (day, hour) => (event) => {
    let dateValue = this.state.dateValue;
    let date = dateValue.find((d) => d.day === day);
    let index = dateValue.indexOf(date);
    date[hour] = event.target.value;
    dateValue.splice(index, 1, date);
    this.setState({ dateValue });
  };


  handleSaveDate = () => {
    let { dateValue } = this.state;

    Axios.put(
      `http://localhost:3001/api/coaches/${this.state.user._id}`,
      { workingDays: dateValue },
      {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }
    )
      .then((res) => {
        let { dateDrawer } = this.state;
        dateDrawer.open = false;
        this.setState({ dateValue, dateDrawer });
      })
      .catch((err) => {
        let { dialog } = this.state;
        dialog.open = true;
        dialog.content = err.response.data.description;
        this.setState({ dialog });
        this.closeDialog(dialog);
      });

  };

  toggleDrawer = (name, open) => () => {
    let drawer = this.state[name];
    drawer.open = open;

    this.setState({ name: drawer });
  };

  render() {
    const { classes } = this.props;
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
            <Typography variant="h6">{this.state.nameUser}</Typography>
          </Toolbar>
          <Tabs
            variant="fullWidth"
            value={this.state.selectTab}
            onChange={this.handleClickTab}
          >
            <Tab label="Dettaglio" value="Dettaglio" />
            {sessionStorage.getItem("role") !== "admin" ?
              <Tab
                label={
                  sessionStorage.getItem("role") === "user"
                    ? "Personal"
                    : "Schede"
                }
                value={
                  sessionStorage.getItem("role") === "user"
                    ? "Personal"
                    : "Schede"
                }
              /> : null}
          </Tabs>
        </AppBar>

        <div className={classes.details}>
          {this.state.selectTab === "Dettaglio" ? (
            <UserDetails
              user={this.state.user}
              userLabel={this.state.userLabel}
              page={sessionStorage.getItem("page")}
              date={this.state.dateValue}
              drawer={this.state.dateDrawer}
              handleChange={this.handleHourChange}
              handleCancel={this.handleCancelDate}
              toggleDrawer={this.toggleDrawer}
              handleSave={this.handleSaveDate}
            />
          ) : (
              <div>
                {sessionStorage.getItem("role") === "user" ? (
                  <div className={classes.calendar}>
                    <ReservationPicker
                      idCoach={this.id}
                      date={this.state.info.date}
                      workingDays={this.state.user.workingDays}
                      events={
                        this.state.reservations == null
                          ? null
                          : this.state.reservations
                            .filter(
                              (res) =>
                                res.notification.status.status === "accepted"
                            )
                            .map((reservation) => {
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
                                color: "blue",
                              };
                            })
                      }
                    />
                  </div>
                ) : sessionStorage.getItem("role") === "coach" ? (
                  <div>
                    <GeneralList
                      items={
                        this.state.plans == null
                          ? null
                          : this.state.plans.map((plan) => {
                            return {
                              _id: plan._id,
                              initialDate: moment(plan.initialDate).format(
                                "YYYY-MM-DD"
                              ),
                              finalDate: moment(plan.finalDate).format(
                                "YYYY-MM-DD"
                              ),
                              goal: plan.goal,
                            };
                          })
                      }
                      page="plans"
                      handleClickItem={this.handleClickPlansDetail}
                    />
                    <div className={classes.fab}>
                      <Fab
                        color="secondary"
                        aria-label="add"
                        className={classes.margin}
                        onClick={this.handleClickOpenDialog}
                      >
                        <AddIcon />
                      </Fab>
                      <Dialog
                        ref={this.dialog}
                        open={this.state.dialogClick}
                        onClose={this.handleClickCloseDialog}
                        aria-labelledby="form-dialog-title"
                      >
                        <DialogTitle id="form-dialog-title">
                          Aggiungi una nuova scheda
                      </DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Obiettivo della scheda"
                            onChange={this.handleChangeObj}
                            required
                            id="standard-required"
                            fullWidth
                          />
                          <form className={classes.container} noValidate>
                            <TextField
                              label="Data di inizio"
                              type="date"
                              required
                              id="standard-required"
                              value={
                                this.state.addPlans.initialDate === ""
                                  ? moment().format("YYYY-MM-DD")
                                  : this.state.addNewPlans.initialDate
                              }
                              onChange={this.handleChangeInitial}
                              className={classes.textField}
                              inputProps={{ min: moment().format("YYYY-MM-DD") }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </form>
                          <form className={classes.containerSecond} noValidate>
                            <TextField
                              label="Data di fine"
                              type="date"
                              required
                              id="standard-required"
                              value={
                                this.state.addPlans.initialDate === ""
                                  ? moment().format("YYYY-MM-DD")
                                  : this.state.addNewPlans.finalDate
                              }
                              onChange={this.handleChangeFinal}
                              className={classes.textField}
                              inputProps={{ min: moment().format("YYYY-MM-DD") }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </form>
                          <form className={classes.form}>
                            <FormControl className={classes.formControl}>
                              <InputLabel
                                className={classes.input}
                                htmlFor="max-width"
                              >
                                Durata scheda
                            </InputLabel>
                              <Select
                                className={classes.selectionDialog}
                                autoFocus
                                value={this.state.maxWidth}
                                onChange={this.handleMaxWidthChange}
                                inputProps={{
                                  name: "max-width",
                                  id: "max-width",
                                }}
                                defaultValue="Trimestrale"
                              >
                                <MenuItem value="Trimestrale">
                                  Trimestrale
                              </MenuItem>
                                <MenuItem value="Settimanale">
                                  Settimanale
                              </MenuItem>
                                <MenuItem value="Bimestrale">Bimestrale</MenuItem>
                                <MenuItem value="Mensile">Mensile</MenuItem>
                                <MenuItem value="Annuale">Annuale</MenuItem>
                              </Select>
                            </FormControl>
                          </form>
                          <TextField
                            id="filled-basic"
                            label="Esercizi"
                            multiline
                            rows={8}
                            variant="filled"
                            onChange={this.handleChangeExercices}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={this.handleClickCloseDialog}
                            color="primary"
                          >
                            Cancel
                        </Button>
                          <Button onClick={this.handleCheck} color="primary">
                            Aggiungi
                        </Button>
                        </DialogActions>
                      </Dialog>
                      <ResponseDialog
                        open={this.state.correctDialog.open}
                        title={"SCHEDA INSERITA"}
                        content={this.state.correctDialog.response}
                        icon={
                          <CheckCircleRoundedIcon
                            color="primary"
                            style={{ fontSize: 40 }}
                          />
                        }
                      />
                      <ResponseDialog
                        open={this.state.errorDialog.open}
                        title={"ERRORE"}
                        content={this.state.errorDialog.response}
                        icon={
                          <CancelIcon
                            color="secondary"
                            style={{ fontSize: 40 }}
                          ></CancelIcon>
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Details));
