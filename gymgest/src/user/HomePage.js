import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { withRouter } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import HamburgerMenu from "./HamburgerMenu";
import Axios from "axios";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Contacts from "./Contacts";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  contentDiv: {
    marginTop: theme.spacing(13),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(16),
    },
  },
  title: {
    textAlign: "center",
    fontWeight: "600 !important",
    color: theme.palette.primary.main,
  },
  avatar: {
    margin: theme.spacing(2),
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  imgDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0px",
    "@media(min-width: 993px)": {
      margin: "30px",
    },
  },
  img: {
    width: "80%",
    "@media(min-width: 993px)": {
      width: "60%",
    },
  },
  backButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },

  content: {
    margin: "20px",
    "@media(min-width: 993px)": {
      margin: "20px 80px 20px 80px",
    },
  },

  divider: {
    width: "100%",
    marginBottom: 20,
  },

  info: {
    fontWeight: "600 !important",
  },
});

class Homepage extends Component {
  constructor(props) {
    super(props);
    sessionStorage.setItem("page", "home");
    this.state = {
      open: false,
      index: 0,
    };
  }

  componentDidMount() {
    Axios.get("http://localhost:3001/api/info").then((res) => {
      this.setState({ info: res.data[0] });
    });
    Axios.get("http://localhost:3001/api/coaches").then((res) => {
      sessionStorage.setItem("coaches", JSON.stringify(res.data));
    });
  }

  handleNext = () => {
    let { index } = this.state;
    index = (index + 1) % 3;
    this.setState({ index });
  };

  handlePrev = () => {
    let { index } = this.state;
    index -= 1;
    if (index < 0) {
      index = 2;
    }
    this.setState({ index });
  };

  render() {
    const { classes } = this.props;
    this.images = [
      <img className={classes.img} alt="" src="/gym1.jpg"></img>,
      <img className={classes.img} alt="" src="/gym2.jpg"></img>,
      <img className={classes.img} alt="" src="/gym3.jpg"></img>,
    ];
    return (
      <div className={classes.root}>
        <CssBaseline />

        <HamburgerMenu></HamburgerMenu>

        <div className={classes.contentDiv}>
          <Typography variant="h2" className={classes.title}>
            GymGest
          </Typography>
          <Typography variant="h6" color="primary">
            La tua palestra a portata di click!
          </Typography>
        </div>
        <div className={classes.imgDiv}>
          <Avatar className={classes.backButton}>
            <IconButton aria-label="back" onClick={this.handlePrev}>
              <NavigateBeforeIcon />
            </IconButton>
          </Avatar>
          {this.images[this.state.index]}
          <Avatar className={classes.nextButton}>
            <IconButton aria-label="next" onClick={this.handleNext}>
              <NavigateNextIcon />
            </IconButton>
          </Avatar>
        </div>
        <Typography
          className={classes.content}
          variant="body2"
          color="initial"
          align="center"
        >
          Siamo una palestra immersa nel verde, che fornisce allenamenti
          personalizzati e dispone di attrezzature all'avanguardia.
          <br />
          I nostri allenatori sono laureati e qualificati in tipi diversi di
          allenamento.
          <br />
          Mettiamo a disposizione corsi settimanali e lezioni private.
          <br />
          Se vuoi usufruire di tutti i nostri servizi, registrati e accedi dal
          menu!
        </Typography>

        <Divider className={classes.divider} />

        <Typography className={classes.info}>Informazioni</Typography>
        <Contacts info={this.state.info} />
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(Homepage));
