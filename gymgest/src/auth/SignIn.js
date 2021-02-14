import React, { Component } from "react";
import {
  Button,
  Grid,
  Avatar,
  Typography,
  CssBaseline,
  Container,
  IconButton,
  InputAdornment,
  Link,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Axios from "axios";
import { withRouter } from "react-router";
import SimpleFormComponent from "./SimpleFormComponent";
import passwordEncoder from "./PasswordEncoder";
import HamburgerMenu from "../user/HamburgerMenu";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import ResponseDialog from "../ResponseDialog";

const styles = (theme) => ({
  paper: {
    marginTop: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  link: {
    marginTop: theme.spacing(3),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  passwordIcon: {
    fontSize: 16,
  },
  formControl: {
    width: "50%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;

    this.state = {
      formData: {
        email: "",
        password: "",
      },
      submitted: false,
      passwordType: "password",
      correctDialog: {
        open: false,
        response: "",
      },
      errorDialog: {
        open: false,
        response: "",
      },
    };
  }

  handleChange = (name) => (event) => {
    const { formData } = this.state;
    formData[name] = event.target.value;
    this.setState({
      formData,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      submitted: true,
    });
    if (this.checkProperties()) {
      let password = passwordEncoder(this.state.formData.password);
      let user = {
        email: this.state.formData.email,
        password: password,
      };
      Axios.post("http://localhost:3001/api/auth/signin", user)
        .then((res) => {
          if (res.status === 200) {
            this.setDialogProperties(this.state.correctDialog)(true)(
              "Login avvenuto con successo!"
            );
          }
          this.setDialogClosing(this.state.correctDialog)(() => {
            Object.keys(res.data).forEach((k) => {
              //devo rendere stringa i campi json
              if (k === "workingDays" || k === "image") {
                sessionStorage.setItem(k, JSON.stringify(res.data[k]));
              } else {
                sessionStorage.setItem(k, res.data[k]);
              }
            });
            sessionStorage.setItem("role", "coach");
            let role = res.data.role;
            if (role === "admin") {
              this.props.history.push("/admin");
            } else if (role === "coach") {
              this.props.history.push("/coaches");
            }
            if (role === "user") {
              this.props.history.push("/view");
            }
          });
        })
        .catch((err) => {
          if (err.response) {
            this.setDialogProperties(this.state.errorDialog)(true)(
              err.response.data.description
            );

            this.setDialogClosing(this.state.errorDialog)(null);
          }
        });
    }
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

  checkProperties = () => {
    return Object.keys(this.state.formData).find(
      (k) => this.state.formData[k] === ""
    ) != null
      ? false
      : true;
  };

  handleClickShowPassword = () => {
    this.setState({
      passwordType:
        this.state.passwordType === "password" ? "text" : "password",
    });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  buildFields = () => {
    this.fields = [
      {
        id: "email",
        label: "Email",
        type: "text",
        autoFocus: true,
        error: this.state.submitted && this.state.formData.email === "",
        helperText:
          this.state.submitted && this.state.formData.email === ""
            ? "Field required"
            : null,
      },
      {
        id: "password",
        label: "Password",
        type: this.state.passwordType,
        autoFocus: false,
        error: this.state.submitted && this.state.formData.password === "",
        helperText:
          this.state.submitted && this.state.formData.password === ""
            ? "Field required"
            : null,
        inputProps: {
          endAdornment: (
            <InputAdornment>
              <IconButton
                aria-label="toggle password visibility"
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
                edge="start"
              >
                {this.state.passwordType !== "password" ? (
                  <Visibility className={this.classes.passwordIcon} />
                ) : (
                    <VisibilityOff className={this.classes.passwordIcon} />
                  )}
              </IconButton>
            </InputAdornment>
          ),
        },
      },
    ];
  };

  render() {
    this.buildFields();

    return (
      <Container maxWidth="xs">
        <CssBaseline />
        <HamburgerMenu></HamburgerMenu>
        <div className={this.classes.paper}>
          <Avatar
            alt="logo"
            src="/gymgest_logo.png"
            className={this.classes.avatar}
          />
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Link href="/signup" variant="body2" className={this.classes.link}>
           Non hai ancora un account? Registrati!
          </Link>
          <form className={this.classes.form} noValidate>
            <Grid container spacing={2} justify="center">
              {this.fields == null ? null : this.fields.map((f) => {
                return (
                  <Grid item xs={12} key={f.id}>
                    <SimpleFormComponent
                      id={f.id}
                      label={f.label}
                      type={f.type}
                      autoFocus={f.autoFocus}
                      value={this.state.formData[f.id]}
                      onChange={this.handleChange}
                      error={f.error}
                      helperText={f.helperText}
                      inputProps={f.inputProps}
                    />
                  </Grid>
                );
              })}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
              onClick={this.handleSubmit}
            >
              Sign In
            </Button>
          </form>
        </div>
        <ResponseDialog
          ref={this.respDialog}
          open={this.state.correctDialog.open}
          title={"LOGIN CORRETTO"}
          content={this.state.correctDialog.response}
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
          title={"ERRORE"}
          content={this.state.errorDialog.response}
          icon={
            <CancelIcon
              color="secondary"
              style={{ fontSize: 40 }}
            ></CancelIcon>
          }
        />
      </Container>
    );
  }
}

export default withStyles(styles)(withRouter(SignIn));
