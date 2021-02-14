import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReceiptIcon from "@material-ui/icons/Receipt";
import MapIcon from '@material-ui/icons/Map';
import { withRouter } from "react-router";
import {
  List,
  Divider,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItem,
  Avatar,
  CircularProgress,
  ListItemSecondaryAction,
  Box,
  IconButton,
  Badge,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import imageEncode from "../ImageEncoder";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  inline: {
    display: "inline",
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginRight: theme.spacing(3),
    "@media(min-width: 993px)": {
      marginLeft: theme.spacing(5),
      marginRight: theme.spacing(5),
    },
  },
  divider: {
    marginLeft: theme.spacing(15),
    "@media(min-width: 993px)": {
      marginLeft: theme.spacing(22),
    },
  },
});

class GeneralList extends Component {
  formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  render() {
    const { classes } = this.props;
    return (
      <List className={classes.root}>
        {this.props.items == null ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="60%"
          >
            <Box>
              <CircularProgress />
            </Box>
          </Box>
        ) : this.props.page === "plans" ? (
          <List className={classes.root}>
            {this.props.items == null ? null : this.props.items.map((plan) => {
              return (
                <div key={plan._id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={this.props.handleClickItem(plan._id)}
                    button={true}
                  >
                    <ListItemAvatar>
                      <Avatar alt="">
                        <ReceiptIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={"Scheda per " + plan.goal}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {plan.secondary}
                            {"Dal " +
                              plan.initialDate +
                              " " +
                              "al " +
                              plan.finalDate}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              );
            })}
          </List>
        ) : this.props.page === "reservation" ? (
          <List className={classes.root}>
            {this.props.items == null ? null : this.props.items.map((plan) => {
              return (
                <div key={plan._id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={this.props.handleClickItem(plan._id)}
                    button={true}
                  >
                    <ListItemAvatar>
                      <Avatar alt="">
                        <ReceiptIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={"Scheda per " + plan.goal}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {plan.secondary}
                            {"Dal " +
                              this.formatDate(plan.initialDate) +
                              " " +
                              "al " +
                              this.formatDate(plan.finalDate)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              );
            })}
          </List>
        ) : this.props.page === "map" ? (
          <List className={classes.root}>
            {this.props.items == null ? null : this.props.items.map((map) => {
              return (
                <div key={map._id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={this.props.handleClickItem(map._id)}
                    button={true}
                  >
                    <ListItemAvatar>
                      <Avatar alt="">
                        <MapIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={"Allenamento del " + this.formatDate(map.date)}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {"Tempo Impiegato: " +
                              ("0" + Math.floor(map.time / 3600000)).slice(-2)
                              + " : " +
                              ("0" + (Math.floor(map.time / 60000) % 60)).slice(-2)
                              + " : " +
                              ("0" + (Math.floor(map.time / 1000) % 60)).slice(-2)
                              + " : " +
                              ("0" + (Math.floor(map.time / 10) % 100)).slice(-2)
                            }
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              );
            })}
          </List>
        ) : (
                  this.props.items == null ? null : this.props.items.map((item) => {

                    let messages = JSON.parse(sessionStorage.getItem("unread"));

                    return (
                      <div key={item._id}>
                        <ListItem
                          alignItems="flex-start"
                          onClick={
                            this.props.handleClickItem != null
                              ? this.props.handleClickItem(item._id)
                              : null
                          }
                          button={true}
                        >
                  
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

                          {this.props.page === "chat" ? (
                            messages == null ? null : messages[item.other._id] ==
                              null ? null : (
                                <ListItemSecondaryAction edge="end" aria-label="delete">

                                  <Badge badgeContent={messages[item.other._id]} color="primary" />
                                </ListItemSecondaryAction>
                              )
                          ) : null}

                      
                        </ListItem>
                        <Divider
                          variant="inset"
                          component="li"
                          className={classes.divider}
                        />
                      </div>
                    );
                  })
                )}
      </List>
    );
  }
}

export default withStyles(styles)(withRouter(GeneralList));
