import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { getStringDate } from "../calendar/Utility";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

    width: "80%",
    marginTop: 10,
    "@media(min-width: 993px)": {
      width: " 50%",
    },
  },

  days: {
    display: "flex",
    flexDirection: "column",
  },

  editInfoIcon: {
    top: -10,
  },
  subtitle: {
    fontWeight: "600 !important",
  },
});

class GymHours extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.days}>
          {
            <Typography
              variant="body2"
              color="initial"
              className={classes.subtitle}
            >
              {this.props.title}
            </Typography>
          }

          {this.props.date != null
            ? this.props.date.map((date) => {
                return (
                  <Typography key={date.day} variant="body2" color="initial">
                    {getStringDate(date)}
                  </Typography>
                );
              })
            : null}
        </div>
        {this.props.type === "admin" ? (
          <div>
            <IconButton
              aria-label="edit"
              onClick={this.props.toggleDrawer}
              className={classes.editInfoIcon}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(GymHours);
