import React, { Component } from "react";
import {
  List,
  Divider,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItem,
  Avatar,
  IconButton,
} from "@material-ui/core";
import imageEncode from "../ImageEncoder";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";


const styles = (theme) => ({
  inline: {
    display: "inline",
  },
  avatar: {
    width: 40,
    height: 40,

    "@media(min-width: 993px)": {},
  },
  divider: {
    "@media(min-width: 993px)": {},
  },
  actionDiv: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    top: 0,
  },
  actionIcon: {
    fontSize: 20,
  },
});

class NotificationList extends Component {
  render() {
    const { classes } = this.props;
    return (
      <List>
      {this.props.items.length === 0 ? (<Typography align="center">Non hai alcuna notifica da mostrare</Typography>) : null}
        {this.props.items == null ? null : this.props.items.map((item) => {
          return (
            <div key={item._id}>
              <ListItem alignItems="flex-start" button={true}>
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    alt={item.alt}
                    src={item.image != null ? imageEncode(item.image) : null}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.primary}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {item.secondary}
                    </Typography>
                  }
                />

                {sessionStorage.getItem("page") === "coach" ? (
                  <div className={classes.actionDiv}>
                    <IconButton
                      size="small"
                      onClick={this.props.handleAccept(item)}
                      edge="end"
                      aria-label="accept"
                      color="primary"
                    >
                      <CheckCircleIcon className={classes.actionIcon} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={this.props.handleReject(item)}
                      edge="end"
                      aria-label="reject"
                      color="secondary"
                    >
                      <CancelIcon className={classes.actionIcon} />
                    </IconButton>
                  </div>
                ) : null}
              </ListItem>
              <Divider
                variant="inset"
                component="li"
                className={classes.divider}
              />
            </div>
          );
        })}
      </List>
    );
  }
}

export default withStyles(styles)(NotificationList);
