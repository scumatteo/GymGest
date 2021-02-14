import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import imageEncode from "../ImageEncoder";
import { withRouter } from "react-router";
import { Button } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    marginTop: 110,
    "@media(min-width: 993px)": {
      marginTop: 140,
    },
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
});

class GridListView extends Component {
  constructor(props) {
    super(props);
    this.dialog = React.createRef();

    this.state = {
      open: false,
      clicked: {},
    };
  }

  handleClickOpenCoach = (coach) => (event) => {
    this.setState({
      open: true,
      clicked: {
        title: coach.name + " " + coach.surname,
        content:
          coach.bio == null
            ? "Il coach non ha nessuna biografia da mostrare"
            : coach.bio,
      },
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      clicked: {},
    });
  };

  render() {
    const { classes } = this.props;
    if (this.props.type == "coach") {
      return (
        <div className={classes.root}>
          <GridList cellHeight={180} className={classes.gridList}>
            {this.props.items == null ? null : this.props.items.map((coach) => (
              <GridListTile
                key={coach._id}
                onClick={this.handleClickOpenCoach(coach)}
              >
                <img
                  src={coach.image != null ? imageEncode(coach.image) : ""}
                  alt={coach.name + " " + coach.surname}
                />
                <GridListTileBar
                  title={coach.name + " " + coach.surname}
                  subtitle={<span>email: {coach.email}</span>}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${coach.name} ${coach.surname}`}
                      className={classes.icon}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
          <Dialog
            ref={this.dialog}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {this.state.clicked.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.clicked.content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    } else if (this.props.type == "course") {
      return (
        <div className={classes.root}>
          <GridList cellHeight={180} className={classes.gridList}>
            <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
              <ListSubheader component="div">
                GymGest: I nostri corsi
              </ListSubheader>
            </GridListTile>
            {this.props.items == null ? null : this.props.items.map((course) => (
              <GridListTile key={course.image}>
                <img src={course.image} alt={course.name} />
                <GridListTileBar
                  title={course.name}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${course.name}`}
                      className={classes.icon}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default withStyles(styles)(withRouter(GridListView));
