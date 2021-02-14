import React, { Component } from "react";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  title: {
    textAlign: "center",
  },
  content: {
    textAlign: "center",
  },
});

class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);
    this.confirmDialog = React.createRef();
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        ref={this.confirmDialog}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
        open={this.props.open}
      >
        <DialogTitle
          id="alert-dialog-title"
          className={classes.title}
          disableTypography
        >
          <h3>{this.props.title}</h3>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {this.props.content}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.props.handleCancel} color="primary">
            <h4>No</h4>
          </Button>
          <Button onClick={this.props.handleOk} color="primary">
            <h4>Sì</h4>
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ConfirmationDialog);
