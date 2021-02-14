import { TextField, Button, Typography } from "@material-ui/core";
import React, { Component } from "react";
import Calendar from "./calendar/Calendar";
import { withStyles } from "@material-ui/core/styles";
import Axios from "axios";
import CancelIcon from "@material-ui/icons/Cancel";
import ResponseDialog from "./ResponseDialog";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import socket from "./global/Socket";

var moment = require("moment");

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,

    minWidth: 300,
  },
  submit: {
    marginTop: 20,
    marginBottom: 10,
    minWidth: 150,
  },
  name: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

class ReservationPicker extends Component {
  constructor(props) {
    super(props);
    this.dialog = React.createRef();
    this.respDialog = React.createRef();

    this.state = {
      insertReservationDialog: {
        open: false,
        response: "",
      },
      errorDialog: {
        open: false,
        response: "",
      },
      date: {
        day: moment().format("yyyy-MM-DD"),
        initialHour: moment().format("HH:mm"),
        finalHour: moment().format("HH:mm"),
      },
    };
  }

  handleDateChange = (name) => (event) => {
    const { date } = this.state;
    date[name] = event.target.value;
    this.setState({
      date,
    });
  };

  handleSubmitDate = () => {
    if (this.checkDate()) {
      Axios.post(
        "http://localhost:3001/api/reservations",
        {
          idCoach: this.props.idCoach,
          date: this.state.date.day,
          initialHour: this.state.date.initialHour,
          finalHour: this.state.date.finalHour,
        },

        {
          headers: {
            "x-access-token": sessionStorage.getItem("accessToken"),
          }, 
        }
      )
        .then((res) => {
          socket.emit("notification", res.data);
          this.setDialogProperties(this.state.insertReservationDialog)(true)(
            "Allenamento personale richiesto."
          );
          this.setDialogClosing(this.state.insertReservationDialog);
        })
        .catch((err) => {
            this.setDialogProperties(this.state.errorDialog)(true)(err);
            this.setDialogClosing(this.state.errorDialog);
        });
    }
  };

  checkDate = () => {
    if (moment().format("yyyy-MM-DD") > this.state.date.day) {
      return false;
    }
    if (
      moment().format("yyyy-MM-DD") === this.state.date.day &&
      moment().format("HH:mm") >= this.state.date.initialHour
    ) {
      return false;
    }
    if (this.state.date.initialHour >= this.state.date.finalHour) {
      return false;
    }

    return true;
  };

  setDialogProperties = (dialog) => (open) => (response) => {
    dialog.open = open;
    dialog.response = response;
    this.setState({
      dialog,
    });
  };

  setDialogClosing = (dialog) => {
    setTimeout(
      () => this.setDialogProperties(dialog)(false)(""),
      2000
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.name}>CALENDARIO</Typography>
        <Calendar
          date={this.props.date}
          workingDays={this.props.workingDays}
          events={this.props.events}
        />
        <Typography className={classes.title}>PRENOTA UN PERSONAL</Typography>
        <form className={classes.form} noValidate>
          <TextField
            onChange={this.handleDateChange("day")}
            id="date"
            label="Data"
            type="date"
            defaultValue={moment().format("YYYY-MM-DD")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            onChange={this.handleDateChange("initialHour")}
            id="time"
            label="Ora inizio"
            type="time"
            defaultValue={moment().format("HH:mm")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            onChange={this.handleDateChange("finalHour")}
            id="time"
            label="Ora fine"
            type="time"
            defaultValue={moment().format("HH:mm")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.handleSubmitDate}
        >
          Prenota
        </Button>
        <ResponseDialog
          ref={this.dialog}
          open={this.state.insertReservationDialog.open}
          title={"Prenotazione Effettuata"}
          content={this.state.insertReservationDialog.response == null}
          icon={ 
            <CheckCircleRoundedIcon
            color="primary"
            style={{ fontSize: 40 }}
          />
          }
        />
        <ResponseDialog
          ref={this.respDialog}
          open={this.state.errorDialog.open}
          title={"Errore"}
          content={this.state.errorDialog.response == null}
          icon={ 
              <CancelIcon
                color="secondary"
                style={{ fontSize: 40 }}
              />
          }
        />
      </div>
    );
  }
}

export default withStyles(styles)(ReservationPicker);
