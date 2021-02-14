import React, { Component } from "react";
import {
  GridListTile,
  GridListTileBar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  TextField,
  DialogActions,
  Button,
  Input,
  Select,
  MenuItem,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { withStyles } from "@material-ui/core/styles";
import { getNameByDay } from "../calendar/Utility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Axios from "axios";

const styles = (theme) => ({
  root: {
    margin: 5,

    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  gridTile: {
    margin: 5,
    overflow: "hidden !important",
    width: 180,
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
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
    fontSize: 16,

  },

  textField: {
    width: "100%",
    fontSize: 14,
  },
});

class LessonCard extends Component {
  constructor(props) {
    super(props);
    this.dialog = React.createRef();
    this.state = {
      changeButtonPartecipate: this.props.lesson.users.some(user => user === sessionStorage.getItem("id")), // true 
      open: false,
      editing: false,
      form: {
        coach: this.props.lesson.coach,
        description: this.props.lesson.description,
        day: this.props.lesson.day,
        initialHour: this.props.lesson.initialHour,
        finalHour: this.props.lesson.finalHour,
        maxSubscriber: this.props.lesson.maxSubscriber,
        users: this.props.lesson.users,
        free: this.props.lesson.maxSubscriber - this.props.lesson.users.length,
      },
    };

  }

  handleOpenDialog = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  handleClickEdit = () => {
    this.setState({ editing: true });
  };

  handleChange = (name) => (event) => {
    let { form } = this.state;
    form[name] = event.target.value;
    this.setState({ form });
  };

  handleCancel = () => {
    let { form, open, editing } = this.state;
    form.coach = this.props.lesson.coach;
    form.description = this.props.lesson.description;
    form.day = this.props.lesson.day;
    form.initialHour = this.props.lesson.initialHour;
    form.finalHour = this.props.lesson.finalHour;
    form.free =
      this.props.lesson.maxSubscriber - this.props.lesson.users.length;
    form.users = this.props.lesson.users;
    open = false;
    editing = false;
    this.setState({ form, open, editing });
  };

  handleAddUser = () => {
    let { form } = this.state;
    form.users = form.users.concat(sessionStorage.getItem("id"));
    form.free = form.free - 1;

    Axios.put(`http://localhost:3001/api/subscribeLesson/${this.props.lesson._id}`, {}, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    })
      .then((res) => {
        form = res.data;
        this.setState({ changeButtonPartecipate: true });
        this.setState({ open: false });
        this.setState({ open: true });
        this.props.handleUpdate(form);
      })
  };

  handleCancelUser = () => {
    let { form } = this.state;
    form.free = form.free + 1;
    form.users = form.users.filter(item => item !== sessionStorage.getItem("id"));

    Axios.delete(`http://localhost:3001/api/subscribeLesson/${this.props.lesson._id}`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    })
      .then((res) => {
        form = res.data;
        this.setState({ changeButtonPartecipate: false });
        this.setState({ open: false });
        this.setState({ open: true });
        this.props.handleUpdate(form);
      })
  };

  handleSave = () => {
    let { open, editing, form } = this.state;

    Axios.put(
      `http://localhost:3001/api/lesson/${this.props.lesson._id}`,
      {
        coach: {
          _id: form.coach._id,
          name: form.coach.name,
          surname: form.coach.surname,
        },
        description: form.description,
        day: form.day,
        initialHour: form.initialHour,
        finalHour: form.finalHour,
      },
      { headers: { "x-access-token": sessionStorage.getItem("accessToken") } }
    )
      .then((res) => {
        form = res.data;
        open = false;
        editing = false;
        this.setState({ open, editing });
        this.props.handleUpdate(form);
      })
      
  };

  handleDelete = () => {
    let { open, editing } = this.state;
    Axios.delete(`http://localhost:3001/api/lesson/${this.props.lesson._id}`, {
      headers: { "x-access-token": sessionStorage.getItem("accessToken") },
    })
      .then((res) => {
        open = false;
        editing = false;
        this.setState({ open, editing });
        this.props.handleDelete(this.props.lesson);
      })
      
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridListTile className={classes.gridTile}>
          <img
            className={classes.image}
            src={"/crossfit.jpg"}
            alt={"crossfit"}
          />

          <GridListTileBar
            title={this.props.lesson.name}
            subtitle={
              <span>
                Coach:
                {" " +
                  this.state.form.coach.name +
                  " " +
                  this.state.form.coach.surname}
              </span>
            }
            actionIcon={
              <IconButton
                className={classes.icon}
                aria-label="info"
                onClick={this.handleOpenDialog}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </GridListTile>
        <Dialog
          ref={this.dialog}
          onClose={this.handleCloseDialog}
          fullWidth
          open={this.state.open}
          className={classes.content}
        >
          <DialogTitle id="alert-dialog-title" disableTypography align="center">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Box alignSelf="center" marginRight="20px">
                <h3>{this.props.lesson.name}</h3>
              </Box>
              {sessionStorage.getItem("page") === "admin" ? (
                <Box>
                  <div className={classes.iconDiv}>
                    <IconButton
                      className={classes.iconButton}
                      aria-label="edit"
                      onClick={this.handleClickEdit}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      className={classes.iconButton}
                      aria-label="edit"
                      onClick={this.handleDelete}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                </Box>
              ) : sessionStorage.getItem("page") === "user" ?
                  (
                    <Box>
                      <div className={classes.iconDiv}>
                        {this.state.changeButtonPartecipate === true ||
                          this.state.form.free === 0 ||
                          this.props.lesson.users.some(u => (u.id === sessionStorage.getItem("id"))) ? (
                            <IconButton
                              className={classes.iconButton}
                              aria-label="edit"
                              onClick={this.handleCancelUser}
                            >
                              Cancellami
                              <CancelIcon fontSize="medium" />
                            </IconButton>
                          ) : (
                            <IconButton
                              className={classes.iconButton}
                              aria-label="edit"
                              onClick={this.handleAddUser}
                            >
                              Partecipa
                              <CheckCircleIcon fontSize="medium" />
                            </IconButton>
                          )}
                      </div>
                    </Box>
                  )
                  : null
              }
            </Box>
          </DialogTitle>
          <DialogContent>
            <div>
              <Typography className={classes.title} variant="body2">
                Coach
              </Typography>
              {this.state.editing ? (
                <Select
                  id="coach"
                  value={this.state.form.coach}
                  onChange={this.handleChange("coach")}
                >
                  {this.props.coaches == null ? null : this.props.coaches.map((coach) => {
                    return (
                      <MenuItem
                        value={
                          coach._id === this.state.form.coach._id
                            ? this.state.form.coach
                            : coach
                        }
                      >
                        {coach.name + " " + coach.surname}
                      </MenuItem>
                    );
                  })}
                </Select>
              ) : (
                  <span className={classes.textField}>
                    {this.state.form.coach.name +
                      " " +
                      this.state.form.coach.surname}
                  </span>
                )}
              <Typography className={classes.title} variant="body2">
                Descrizione
              </Typography>

              <Input
                className={classes.textField}
                value={this.state.form.description}
                readOnly={!this.state.editing}
                disableUnderline={!this.state.editing}
                onChange={this.handleChange("description")}
              />
              <Typography className={classes.title} variant="body2">
                Giorno
              </Typography>
              {this.state.editing ? (
                <Select
                  id="day"
                  value={this.state.form.day}
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
              ) : (
                  <span className={classes.textField}>
                    {getNameByDay(this.state.form.day)}
                  </span>
                )}

              <Typography className={classes.title} variant="body2">
                Orario
              </Typography>
              {this.state.editing ? (
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
                        step: 300,
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
                        step: 300,
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                  <Typography variant="body2">
                    {this.state.form.initialHour} - {this.state.form.finalHour}
                  </Typography>
                )}
            </div>
            <div>
              <Typography className={classes.title} variant="body2">
                Posti liberi
              </Typography>
              <Typography variant="body2">{this.state.form.free}</Typography>
            </div>
          </DialogContent>
          {this.state.editing ? (
            <DialogActions>
              <Button autoFocus onClick={this.handleCancel} color="primary">
                <h4>ANNULLA</h4>
              </Button>
              <Button onClick={this.handleSave} color="primary">
                <h4>SALVA</h4>
              </Button>
            </DialogActions>
          ) : null}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(LessonCard);
