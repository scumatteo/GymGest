import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Axios from "axios";
import ResponseDialog from "../ResponseDialog";
import CancelIcon from "@material-ui/icons/Cancel";
import GymHours from "../info/GymHours";
import FieldInfo from "../info/FieldInfo";
import DateDrawer from "../drawers/DateDrawer";
import FieldDrawer from "../drawers/FieldDrawer";
import LessonPage from "../lessons/LessonPage";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontWeight: "600 !important",
    marginTop: 20,
    "@media(min-width: 993px)": {
      marginTop: 40,
    },
  },
});

class InfoPage extends Component {
  constructor(props) {
    super(props);
    this.respDialog = React.createRef();


    this.state = {
      dateValue: this.getInitialValue(),
      info: {
        name: this.props.info.name,
        email: this.props.info.email,
        phone: this.props.info.phone,
        address: this.props.info.address,
      },
      dateDrawer: {
        title: "Orari di apertura",
        open: false,
      },
      nameDrawer: {
        title: "Amministratore",
        open: false,
      },
      emailDrawer: {
        title: "Email",
        open: false,
      },
      phoneDrawer: {
        title: "Cellulare",
        open: false,
      },
      addressDrawer: {
        title: "Indirizzo",
        open: false,
      },
      drawer: {
        title: "",
        open: false,
      },
      dialog: {
        open: false,
        content: "",
      },
    };
  }

  getInitialValue = () => {
    let initialValue = [];
    for (let elem in this.props.info.date) {
      initialValue.push(JSON.parse(JSON.stringify(this.props.info.date[elem])));
    }
    return initialValue;
  };

  handleSave = (name, drawer) => () => {
    const field = this.state.info[name];
    Axios.put(
      `http://localhost:3001/api/info/${this.props.info._id}`,
      { [name]: field },
      {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }
    )
      .then((res) => {
        let dr = this.state[drawer];
        dr.open = false;
        this.setState({ name: field, drawer: dr });
      })
      .catch((err) => {
        let { dialog } = this.state;
        dialog.open = true;
        dialog.content = err.response.data.description;
        this.setState({ dialog });
        this.closeDialog(dialog);
      });
  };

  handleCancel = (name, drawer) => () => {
    const { info } = this.state;
    let dr = this.state[drawer];
    dr = dr.open = false;
    info[name] = this.props.info[name];
    this.setState({
      info,
      drawer: dr,
    });
  };

  handleChange = (name) => (event) => {
    const { info } = this.state;
    info[name] = event.target.value;
    this.setState({
      info,
    });
  };

  handleSaveDate = () => {
    let { dateValue } = this.state;
    Axios.put(
      `http://localhost:3001/api/info/${this.props.info._id}`,
      { date: dateValue },
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

  handleCancelDate = () => {
    let { dateValue, dateDrawer } = this.state;
    dateValue = this.getInitialValue();
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

  closeDialog = (dialog) => {
    setTimeout(() => {
      dialog.content = "";
      dialog.open = false;
      this.setState({ dialog });
    }, 2000);
  };

  toggleDrawer = (name, open) => () => {
    let drawer = this.state[name];
    drawer.open = open;

    this.setState({ name: drawer });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="body1" color="initial" className={classes.title}>
          INFO PALESTRA
        </Typography>
        <FieldInfo
          title="Amministratore"
          name={this.state.info.name}
          type="admin"
          toggleDrawer={this.toggleDrawer("nameDrawer", true)}
        />

        <FieldInfo
          title="Email"
          name={this.state.info.email}
          type="admin"
          toggleDrawer={this.toggleDrawer("emailDrawer", true)}
        />
        <FieldInfo
          title="Cellulare"
          name={this.state.info.phone}
          type="admin"
          toggleDrawer={this.toggleDrawer("phoneDrawer", true)}
        />
        <FieldInfo
          title="Indirizzo"
          name={this.state.info.address}
          type="admin"
          toggleDrawer={this.toggleDrawer("addressDrawer", true)}
        />

        <GymHours
          type="admin"
          title="Orari di apertura"
          toggleDrawer={this.toggleDrawer("dateDrawer", true)}
          date={this.state.dateValue}
        />

        <Typography variant="body1" color="initial" className={classes.title}>
          CORSI
        </Typography>

        <LessonPage type="admin" coaches={this.props.coaches} />

        <FieldDrawer
          open={this.state.nameDrawer.open}
          subtitle={this.state.nameDrawer.title}
          toggleDrawer={this.toggleDrawer("nameDrawer", false)}
          handleChange={this.handleChange("name")}
          handleCancel={this.handleCancel("name", "nameDrawer")}
          handleSave={this.handleSave("name", "nameDrawer")}
          label={this.state.nameDrawer.title}
          value={this.state.info.name}
        />
        <FieldDrawer
          open={this.state.emailDrawer.open}
          subtitle={this.state.emailDrawer.title}
          toggleDrawer={this.toggleDrawer("emailDrawer", false)}
          handleChange={this.handleChange("email")}
          handleCancel={this.handleCancel("email", "emailDrawer")}
          handleSave={this.handleSave("email", "emailDrawer")}
          label={this.state.emailDrawer.title}
          value={this.state.info.email}
        />
        <FieldDrawer
          open={this.state.phoneDrawer.open}
          subtitle={this.state.phoneDrawer.title}
          toggleDrawer={this.toggleDrawer("phoneDrawer", false)}
          handleChange={this.handleChange("phone")}
          handleCancel={this.handleCancel("phone", "phoneDrawer")}
          handleSave={this.handleSave("phone", "phoneDrawer")}
          label={this.state.phoneDrawer.title}
          value={this.state.info.phone}
        />
        <FieldDrawer
          open={this.state.addressDrawer.open}
          subtitle={this.state.addressDrawer.title}
          toggleDrawer={this.toggleDrawer("addressDrawer", false)}
          handleChange={this.handleChange("address")}
          handleCancel={this.handleCancel("address", "addressDrawer")}
          handleSave={this.handleSave("address", "addressDrawer")}
          label={this.state.addressDrawer.title}
          value={this.state.info.address}
        />

        <DateDrawer
          info={this.state.dateValue}
          open={this.state.dateDrawer.open}
          subtitle={this.state.dateDrawer.title}
          toggleDrawer={this.toggleDrawer("dateDrawer", false)}
          handleChange={this.handleHourChange}
          handleCancel={this.handleCancelDate}
          handleSave={this.handleSaveDate}
        />

        <ResponseDialog
          ref={this.respDialog}
          title={"ERRORE"}
          open={this.state.dialog.open}
          content={this.state.dialog.content}
          icon={<CancelIcon color="secondary" />}
        />
      </div>
    );
  }
}

export default withStyles(styles)(InfoPage);
