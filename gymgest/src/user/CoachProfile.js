import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@material-ui/core";
import ResponseDialog from "../ResponseDialog";
import CancelIcon from "@material-ui/icons/Cancel";
import FieldInfo from "../info/FieldInfo";
import FieldDrawer from "../drawers/FieldDrawer";
import ImageDrawer from "../drawers/ImageDrawer.js";
import imageEncode from "../ImageEncoder";
import MediaQuery from "react-responsive";

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

  primary: {
    fontSize: 14,
  },

  secondary: {
    fontSize: 16,
  },
});

class CoachProfile extends Component {
  constructor(props) {
    super(props);
    this.respDialog = React.createRef();

    this.state = {
      info: {
        image:
          sessionStorage.getItem("image") == null
            ? null
            : JSON.parse(sessionStorage.getItem("image")),
        name:
          sessionStorage.getItem("name") == null
            ? "..."
            : sessionStorage.getItem("name"),
        surname:
          sessionStorage.getItem("surname") == null
            ? "..."
            : sessionStorage.getItem("surname"),
        email:
          sessionStorage.getItem("email") == null
            ? "..."
            : sessionStorage.getItem("email"),
        gender:
          sessionStorage.getItem("gender") == null
            ? "..."
            : sessionStorage.getItem("gender"),
        bio:
          sessionStorage.getItem("bio") == null
            ? "..."
            : sessionStorage.getItem("bio"),
        phone:
          sessionStorage.getItem("phone") == null
            ? "..."
            : sessionStorage.getItem("phone"),
        birthday:
          sessionStorage.getItem("birthday") == null
            ? "..."
            : sessionStorage.getItem("birthday"),
      },
      nameDrawer: {
        title: "Nome",
        open: false,
      },
      surnameDrawer: {
        title: "Cognome",
        open: false,
      },
      phoneDrawer: {
        title: "Telefono",
        open: false,
      },
      birthdayDrawer: {
        title: "Data di Nascita",
        open: false,
      },
      biographyDrawer: {
        title: "Biografia",
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

  handleSave = (name, drawer) => () => {
    const field = this.state.info[name];
    Axios.put(
      `http://localhost:3001/api/coaches/${sessionStorage.getItem("id")}`,
      { [name]: field },
      {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }
    )
      .then((res) => {
        let dr = this.state[drawer];
        dr.open = false;
        this.setState({ name: field, drawer: dr });
        sessionStorage.setItem(name, field);
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
    info[name] = sessionStorage.getItem(name);
    this.setState({
      info,
      drawer: dr,
    });
  };

  handleBin = () => {
    let pages = "coaches";
    Axios.put(
      `http://localhost:3001/api/${pages}/${sessionStorage.getItem("id")}`,
      {},
      {
        headers: { "x-access-token": sessionStorage.getItem("accessToken") },
      }
    )
      .then((res) => {
        const { info } = this.state;
        info.image = {};
        sessionStorage.setItem("image", JSON.stringify({}));
        this.setState({
          info,
        });
      })
  };

  handleChangeImage = (imm) => () => {
    this.handleImageDrawerCancel();
    let file = imm;
    let formdata = new FormData();
    formdata.append("image", file);
    this.setState({ form: formdata });
    let pages = "coaches";
    Axios.put(
      `http://localhost:3001/api/${pages}/${sessionStorage.getItem("id")}`,
      formdata,
      {
        headers: {
          "x-access-token": sessionStorage.getItem("accessToken"),
          "Content-Type": file.type,
        },
      }
    )
      .then((res) => {
        const { info } = this.state;
        info.image = res.data.image;
        sessionStorage.setItem("image", JSON.stringify(res.data.image));
        this.setState({
          info,
        });
      })
      .catch((err) => {});
  };

  handleAvatar = (imm) => () => {
    const { info } = this.state;
    info.image = imm;
    this.setState({ info });
  };

  handleImageDrawerCancel = () => {
    let { drawer } = this.state;
    drawer.open = false;
    this.setState({ drawer });
  };

  handleChange = (name) => (event) => {
    const { info } = this.state;
    info[name] = event.target.value;
    this.setState({
      info,
    });
  };

  drawerImage = (openD) => () => {
    let { drawer } = this.state;
    drawer.open = openD;
    this.setState({ drawer });
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
            <Typography variant="h6">Profilo</Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Box>
              <Avatar
                className={classes.avatar}
                alt="profile image"
                src={
                  Object.keys(this.state.info.image).length !== 0
                    ? imageEncode(this.state.info.image)
                    : null
                }
              />
            </Box>
            <Box>
              <IconButton position="fixed" className={classes.photoIconButton}>
                <img
                  src="/camera.ico"
                  alt=""
                  className={classes.photoIcon}
                  onClick={this.drawerImage(true)}
                ></img>
              </IconButton>
              <ImageDrawer
                open={this.state.drawer.open}
                handleCancel={this.handleImageDrawerCancel}
                handleChangeImage={this.handleChangeImage}
                handleChangeBin={this.handleBin}
              />
            </Box>
          </Box>

          <div className={classes.root}>
            <FieldInfo
              title="Nome"
              name={this.state.info.name}
              type="admin"
              toggleDrawer={this.toggleDrawer("nameDrawer", true)}
            />

            <FieldInfo
              title="Cognome"
              name={this.state.info.surname}
              type="admin"
              toggleDrawer={this.toggleDrawer("surnameDrawer", true)}
            />

            <FieldInfo title="Email" name={this.state.info.email} />

            <FieldInfo
              title="Sesso"
              name={this.state.info.gender === "male" ? "Uomo" : "Donna"}
            />

            <FieldInfo
              title="Telefono"
              name={this.state.info.phone}
              type="admin"
              toggleDrawer={this.toggleDrawer("phoneDrawer", true)}
            />

            <FieldInfo
              title="Data di nascita"
              name={this.state.info.birthday}
              type="admin"
              toggleDrawer={this.toggleDrawer("birthdayDrawer", true)}
            />

            <FieldInfo
              title="Bio"
              name={this.state.info.bio}
              type="admin"
              toggleDrawer={this.toggleDrawer("biographyDrawer", true)}
            />

            <FieldDrawer
              open={this.state.nameDrawer.open}
              subtitle={this.state.nameDrawer.title}
              toggleDrawer={this.toggleDrawer("nameDrawer", false)}
              handleChange={this.handleChange("name")}
              handleCancel={this.handleCancel("name", "nameDrawer")}
              handleSave={this.handleSave("name", "nameDrawer")}
              value={this.state.info.name}
            />

            <FieldDrawer
              open={this.state.surnameDrawer.open}
              subtitle={this.state.surnameDrawer.title}
              toggleDrawer={this.toggleDrawer("surnameDrawer", false)}
              handleChange={this.handleChange("surname")}
              handleCancel={this.handleCancel("surname", "surnameDrawer")}
              handleSave={this.handleSave("surname", "surnameDrawer")}
              value={this.state.info.surname}
            />

            <FieldDrawer
              open={this.state.phoneDrawer.open}
              subtitle={this.state.phoneDrawer.title}
              toggleDrawer={this.toggleDrawer("phoneDrawer", false)}
              handleChange={this.handleChange("phone")}
              handleCancel={this.handleCancel("phone", "phoneDrawer")}
              handleSave={this.handleSave("phone", "phoneDrawer")}
              value={this.state.info.phone}
            />
            <FieldDrawer
              open={this.state.birthdayDrawer.open}
              subtitle={this.state.birthdayDrawer.title}
              toggleDrawer={this.toggleDrawer("birthdayDrawer", false)}
              handleChange={this.handleChange("birthday")}
              handleCancel={this.handleCancel("birthday", "birthdayDrawer")}
              handleSave={this.handleSave("birthday", "birthdayDrawer")}
              value={this.state.info.birthday}
            />

            <FieldDrawer
              open={this.state.biographyDrawer.open}
              subtitle={this.state.biographyDrawer.title}
              toggleDrawer={this.toggleDrawer(
                "biographyDrawer",
                false
              )}
              handleChange={this.handleChange("bio")}
              handleCancel={this.handleCancel("bio", "biographyDrawer")}
              handleSave={this.handleSave("bio", "biographyDrawer")}
              value={this.state.info.biography}
            />

            <ResponseDialog
              ref={this.respDialog}
              title={"ERRORE"}
              open={this.state.dialog.open}
              content={this.state.dialog.content}
              icon={<CancelIcon color="secondary" />}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(CoachProfile));
