import React, { Component } from "react";
import HamburgerMenu from "./HamburgerMenu";
import PersonListComponent from "./GeneralList.js";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  list: {
    width: "100%",
    marginTop: theme.spacing(7),
    "@media(min-width: 993px)": {
      marginTop: theme.spacing(9),
    },
  },
});

class Staff extends Component {
  constructor(props) {
    super(props);
    let coaches = sessionStorage.getItem("coaches");
    this.coaches = (coaches == null ? null : JSON.parse(coaches));
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <HamburgerMenu></HamburgerMenu>
        <div className={classes.list}>
          <PersonListComponent
            items={
              this.coaches == null
                ? null
                : this.coaches.map((coach) => {
                    return {
                      _id: coach._id,
                      image: coach.image,
                      alt: "profile image",
                      primary: coach.name + " " + coach.surname,
                      secondary: coach.email,
                    };
                  })
            }
            page="home"
          />
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(Staff));
