import React, { Component } from "react";
import Axios from "axios";
import {
  Box,
  GridList,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  DialogActions,
  Button,
  Input,
  Select,
  MenuItem,
  Fab,
} from "@material-ui/core";
import LessonCard from "./LessonCard";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import ResponseDialog from "../ResponseDialog";

const styles = (theme) => ({
  root: {
    width: "80%",
    marginTop: 10,
    "@media(min-width: 993px)": {
      width: " 50%",
    },
  },
  days: {
    minWidth: 120,
    borderRight: '0.1em solid grey',
    padding: '0.5em'
  },
  cardBox: {
    width: "60%",
  },

  icon: {
    marginTop: -40,
    marginBottom: 20,
    marginRight: -20,
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontWeight: "600 !important",
  },

  iconDiv: {
    position: "absolute",
    right: 10,
    top: 22,
  },

  iconButton: {
    margin: "0px -8px 0px -8px",
  },

  textField: {
    width: "100%",
    fontSize: 14,
  },
});

class LessonPage extends Component {
  constructor(props) {
    super(props);
    this.dialog = React.createRef();
    this.state = {
      index: 0,
      open: false,
      form: {},
      errorDialog: {
        open: false,
        response: "",
      },
    };
    this.buttons = [
      { name: "Lunedì", index: 0, day: 1 },
      { name: "Martedì", index: 1, day: 2 },
      { name: "Mercoledì", index: 2, day: 3 },
      { name: "Giovedì", index: 3, day: 4 },
      { name: "Venerdì", index: 4, day: 5 },
      { name: "Sabato", index: 5, day: 6 },
      { name: "Domenica", index: 6, day: 0 },
    ];
  }

  componentDidMount() {
    Axios.get("http://localhost:3001/api/lessons")
      .then((res) => {
        let currentLessons = res.data.filter((lesson) => {
          return lesson.day === 1;
        });
        this.setState({
          lessons: res.data,
          currentLessons: currentLessons,
        });
      })
      .catch((err) => {
        this.setDialogProperties(this.state.errorDialog)(true)(
          err
        );

        this.setDialogClosing(this.state.errorDialog)(null);
      });
  }

  handleChange = (name) => (event) => {
    let { form } = this.state;
    form[name] = event.target.value;
    this.setState({ form });
  };

  handleClickButton = (button) => () => {
    let currentLessons = this.state.lessons.filter((lesson) => {
      return lesson.day === button.day;
    });
    this.setState({
      index: button.index,
      day: button.day,
      currentLessons: currentLessons,
    });
  };

  handleOpenDialog = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  handleUpdate = (les) => {
    let { lessons } = this.state;
    let l = lessons.filter((lesson) => {
      return lesson._id === les._id;
    });

    let index = lessons.indexOf(l[0]);
    lessons[index] = les;
    let currentLessons = lessons.filter((lesson) => {
      return lesson.day === this.state.day;
    });
    this.setState({ lessons: lessons, currentLessons: currentLessons });
  };

  handleDelete = (les) => {
    let { lessons } = this.state;
    let l = lessons.filter((lesson) => {
      return lesson._id === les._id;
    });

    let index = lessons.indexOf(l[0]);
    lessons.splice(index, 1);
    let currentLessons = lessons.filter((lesson) => {
      return lesson.day === this.state.day;
    });
    this.setState({ lessons: lessons, currentLessons: currentLessons });
  };

  handleSave = () => {
    let { open, form, lessons, currentLessons } = this.state;

    Axios.post(
      `http://localhost:3001/api/lessons`,
      {
        name: form.name,
        coach: form.coach._id,
        description: form.description,
        day: form.day,
        initialHour: form.initialHour,
        finalHour: form.finalHour,
        maxSubscriber: form.maxSubscriber,
      },
      { headers: { "x-access-token": sessionStorage.getItem("accessToken") } }
    )
      .then((res) => {
        form = res.data;
        open = false;
        lessons.push(form);
        currentLessons = lessons.filter((lesson) => {
          return lesson.day === this.state.day;
        });
        this.setState({ open, lessons, currentLessons, form: {} });
      })
      .catch((err) => {
        this.setDialogProperties(this.state.errorDialog)(true)(
          err
        );

        this.setDialogClosing(this.state.errorDialog)(null);
      });
  };

  setDialogProperties = (dialog) => (open) => (response) => {
    dialog.open = open;
    dialog.response = response;
    this.setState({
      dialog,
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
      <div className={classes.root}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="column" className={classes.days}>
            {this.buttons == null ? null : this.buttons.map((button) => {
              return (
                <Box key={button.index} mt={2}>
                  <Button
                    onClick={this.handleClickButton(button)}
                    variant={
                      this.state.index === button.index ? "contained" : "text"
                    }
                    color={
                      this.state.index === button.index ? "primary" : "default"
                    }
                  >
                    {button.name}
                  </Button>
                </Box>
              );
            })}
          </Box>
          <Box className={classes.cardBox} mt={1}>
            {this.state.currentLessons != null ? (
              <GridList>
                {this.state.currentLessons == null ? null : this.state.currentLessons.map((lesson) => {
                  return (
                    <LessonCard
                      key={lesson._id}
                      coaches={this.props.coaches}
                      lesson={lesson}
                      handleUpdate={this.handleUpdate}
                      handleDelete={this.handleDelete}
                    />
                  );
                })}
              </GridList>
            ) : null}
          </Box>
        </Box>
        {sessionStorage.getItem("page") === "admin" ? (
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Box className={classes.icon}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={this.handleOpenDialog}
              >
                <AddIcon />
              </Fab>
            </Box>
          </Box>
        ) : null}
        {sessionStorage.getItem("page") === "admin" ? (
        <Dialog
          ref={this.dialog}
          onClose={this.handleCloseDialog}
          fullWidth
          open={this.state.open}
          className={classes.content}
        >
          <DialogTitle id="alert-dialog-title" disableTypography align="center">
            Inserisci corso
          </DialogTitle>
          <DialogContent>
            <div>
              <Typography className={classes.title} variant="body2">
                Nome corso
              </Typography>
              <Input
                className={classes.textField}
                value={this.state.form.name}
                onChange={this.handleChange("name")}
              />
              <Typography className={classes.title} variant="body2">
                Coach
              </Typography>

              <Select
                id="coach"
                value={
                  this.state.form.coach == null ? "" : this.state.form.coach
                }
                onChange={this.handleChange("coach")}
              >
                {this.props.coaches == null
                  ? null
                  : this.props.coaches.map((coach) => {
                    return (
                      <MenuItem value={coach} key={coach._id}>
                        {coach.name + " " + coach.surname}
                      </MenuItem>
                    );
                  })}
              </Select>

              <Typography className={classes.title} variant="body2">
                Descrizione
              </Typography>

              <Input
                className={classes.textField}
                value={this.state.form.description}
                onChange={this.handleChange("description")}
              />
              <Typography className={classes.title} variant="body2">
                Giorno
              </Typography>

              <Select
                id="day"
                value={this.state.form.day == null ? "" : this.state.form.day}
                onChange={this.handleChange("day")}
              >
                <MenuItem value={1}>Lunedì</MenuItem>
                <MenuItem value={2}>Martedì</MenuItem>
                <MenuItem value={3}>Mercoledì</MenuItem>
                <MenuItem value={4}>Giovedì</MenuItem>
                <MenuItem value={5}>Venerdì</MenuItem>
                <MenuItem value={6}>Sabato</MenuItem>
                <MenuItem value={0}>Domenica</MenuItem>
              </Select>

              <Typography className={classes.title} variant="body2">
                Orario
              </Typography>

              <Box display="flex" flexDirection="row">
                <Box>
                  <TextField
                    id="initial"
                    label="Ora inizio"
                    type="time"
                    defaultValue={this.state.form.initialHour}
                    onChange={this.handleChange("initialHour")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </Box>
                <Box>
                  <TextField
                    id="final"
                    label="Ora fine"
                    type="time"
                    defaultValue={this.state.form.finalHour}
                    onChange={this.handleChange("finalHour")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </Box>
              </Box>
            </div>
            <div>
              <Typography className={classes.title} variant="body2">
                Posti disponibili
              </Typography>
              <Input
                className={classes.textField}
                value={this.state.form.maxSubscriber}
                onChange={this.handleChange("maxSubscriber")}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button autoFocus onClick={this.handleCloseDialog} color="primary">
              <h4>ANNULLA</h4>
            </Button>
            <Button onClick={this.handleSave} color="primary">
              <h4>SALVA</h4>
            </Button>
          </DialogActions>
        </Dialog>)
        : null}
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
    );
  }
}

export default withStyles(styles)(LessonPage);
