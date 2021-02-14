import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import HamburgerMenu from "./HamburgerMenu";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Contacts from "./Contacts";
import Axios from "axios";

const styles = (theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginTop: theme.spacing(13),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(16),
    },
  },
  title: {
    fontWeight: "600 !important",
  },
});

class ContactsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Axios.get("http://localhost:3001/api/info").then((res) => {
      this.setState({ info: res.data[0] });
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <HamburgerMenu />
        <div className={classes.content}>
          <Typography className={classes.title} variant="h5" align="center">
            Contatti
          </Typography>
          <Typography>Non esitare a contattarci!</Typography>
        </div>
        <Contacts info={this.state.info} />
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(ContactsPage));
