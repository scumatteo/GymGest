import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

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

  name: {
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

class FieldInfo extends Component {
  onClick = (event) => {
    this.props.handleClick();
    this.props.toggleDrawer(true)(event);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.name}>
          <Typography
            variant="body2"
            color="initial"
            className={classes.subtitle}
          >
            {this.props.title}
          </Typography>

          <Typography variant="body2" color="initial">
            {this.props.name}
          </Typography>
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

export default withStyles(styles)(FieldInfo);
