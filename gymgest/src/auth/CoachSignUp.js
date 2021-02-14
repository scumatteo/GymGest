import React, { Component } from "react";
import { IconButton, InputAdornment } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Axios from "axios";
import SignUpForm from "./SignUpForm";
import passwordEncoder from "./PasswordEncoder";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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

class CoachSignUp extends Component {
  constructor(props) {
    super(props);

    this.emailRegEx = RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]");
    this.classes = this.props.classes;

    this.state = {
      formData: {
        email: "",
        password: "",
        passwordRepeat: "",
        name: "",
        surname: "",
        phone: "",
        CF: "",
        gender: "",
      },
      submitted: false,
      passwordType: "password",
      dialog: {
        open: false,
        error: false,
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

      let coach = {
        email: this.state.formData.email,
        password: password,
        name: this.state.formData.name,
        surname: this.state.formData.surname,
        phone: this.state.formData.phone,
        CF: this.state.formData.CF,
        gender: this.state.formData.gender,
      };
      const { dialog } = this.state;
      Axios.post("http://localhost:3001/api/auth/signupCoach", coach, {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      })
        .then((res) => {
          if (res.status === 201) {
            this.setDialogProperties(dialog)(true)(false)(
              "Registrazione avvenuta con successo!"
            );
            this.setDialogClosing(dialog);
            this.props.addCoach(res.data);
          }
        })
        .catch((err) => {
          if (err.response) {
            this.setDialogProperties(dialog)(true)(true)(
              err.response.data.description
            );

            this.setDialogClosing(dialog);
          }
        });
    }
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
    setTimeout(() => {
      this.setDialogProperties(dialog)(false)(false)("");
      this.props.onSubmit();
    }, 2000);
  };

  //possibile aggiungere password troppo corta
  checkProperties = () => {
    if (
      Object.keys(this.state.formData).find(
        (k) => this.state.formData[k] === ""
      ) != null
    ) {
      return false;
    }
    if (this.state.formData.password !== this.state.formData.passwordRepeat) {
      return false;
    }
    if (!this.emailRegEx.test(this.state.formData.email)) {
      return false;
    }
    return true;
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
        error:
          (this.state.submitted && this.state.formData.email === "") ||
          (this.state.formData.email !== "" &&
            !this.emailRegEx.test(this.state.formData.email)),
        helperText:
          this.state.submitted && this.state.formData.email === ""
            ? "Field required"
            : this.state.formData.email !== "" &&
              !this.emailRegEx.test(this.state.formData.email)
            ? "Email not valid!"
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
      {
        id: "passwordRepeat",
        label: "Repeat password",
        type: "password",
        autoFocus: false,
        error:
          (this.state.submitted && this.state.formData.passwordRepeat === "") ||
          this.state.formData.passwordRepeat !== this.state.formData.password,
        helperText:
          this.state.submitted && this.state.formData.passwordRepeat === ""
            ? "Field required"
            : this.state.formData.passwordRepeat !==
              this.state.formData.password
            ? "Password mismatch"
            : null,
      },
      {
        id: "name",
        label: "Name",
        type: "text",
        autoFocus: false,
        error: this.state.submitted && this.state.formData.name === "",
        helperText:
          this.state.submitted && this.state.formData.name === ""
            ? "Field required"
            : null,
      },
      {
        id: "surname",
        label: "Surname",
        type: "text",
        autoFocus: false,
        error: this.state.submitted && this.state.formData.surname === "",
        helperText:
          this.state.submitted && this.state.formData.surname === ""
            ? "Field required"
            : null,
      },
      {
        id: "phone",
        label: "Phone Number",
        type: "number",
        autoFocus: false,
        error: this.state.submitted && this.state.formData.phone === "",
        helperText:
          this.state.submitted && this.state.formData.phone === ""
            ? "Field required"
            : null,
      },
      {
        id: "CF",
        label: "CF",
        type: "text",
        autoFocus: false,
        error: this.state.submitted && this.state.formData.CF === "",
        helperText:
          this.state.submitted && this.state.formData.CF === ""
            ? "Field required"
            : null,
      },
    ];
  };

  render() {
    this.buildFields();
    return (
      <SignUpForm
        fields={this.fields}
        formData={this.state.formData}
        onChange={this.handleChange}
        genderHelperText={
          this.state.submitted && this.state.formData.gender === ""
            ? "Field required"
            : null
        }
        onClick={this.handleSubmit}
        submitted={this.state.submitted}
        dialog={this.state.dialog}
      />
    );
  }
}

export default withStyles(styles)(CoachSignUp);
