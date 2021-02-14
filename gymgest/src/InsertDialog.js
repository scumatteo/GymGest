import React, { Component } from "react";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  Box,
  IconButton,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  title: {
    textAlign: "center",
  },
  content: {
    textAlign: "center",
  },
  closeIcon: {
    position: "fixed",
    margin: 0,
    right: 40,
  },
});

class InsertDialog extends Component {
  constructor(props) {
    super(props);
    this.insertDialog = React.createRef();
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        ref={this.insertDialog}
        fullWidth
        maxWidth="xs"
        open={this.props.open}
      >
        <DialogTitle
          id="alert-dialog-title"
          className={classes.title}
          disableTypography
        >
          <Box display="flex" direction="row" justifyContent="center">
            <Box>
              <h3>{this.props.title}</h3>
            </Box>
            <Box className={classes.closeIcon}>
              <IconButton aria-label="" onClick={this.props.onClick}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {this.props.content}
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(InsertDialog);
