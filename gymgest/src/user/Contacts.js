import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import CallIcon from "@material-ui/icons/Call";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/Email";
import GymHours from "../info/GymHours";

const styles = (theme) => ({
  root: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  lista: {
    width: "100%",
    marginLeft: 20,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  elem: {
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  primary: {
    fontWeight: "600 !important",
  },
});

class Contacts extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.props.info != null ? (
          <List className={classes.lista}>
            <div className={classes.elem}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography className={classes.primary} variant="body2">
                      Proprietario
                    </Typography>
                  }
                  secondary={this.props.info.name}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography className={classes.primary} variant="body2">
                      Email
                    </Typography>
                  }
                  secondary={this.props.info.email}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <CallIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography className={classes.primary} variant="body2">
                      Cellulare
                    </Typography>
                  }
                  secondary={this.props.info.phone}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LocationOnIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography className={classes.primary} variant="body2">
                      Indirizzo
                    </Typography>
                  }
                  secondary={this.props.info.address}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <QueryBuilderIcon />
                  </Avatar>
                </ListItemAvatar>
                <GymHours type="home" title="Orari di apertura" date={this.props.info.date} />
              </ListItem>
            </div>
          </List>
        ) : null}
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(Contacts));
