import React, { Component } from "react";
import { DialogTitle, Dialog, DialogContent, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  title: {
    textAlign: "center",
    fontSize: "1.2rem",
  },
  content: {
    textAlign: "center",
  },
  contentBox: {
    margin: theme.spacing(2),
  },
});

class ResponseDialog extends Component {
  constructor(props) {
    super(props);
    this.responseDialog = React.createRef();
  }
  render() {
    const { classes } = this.props;
    return (
      <Dialog 
      ref={this.responseDialog}
      open={this.props.open}>
        <DialogTitle
          id="alert-dialog-title"
          className={classes.title}
          disableTypography
        >
          {this.props.title}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Box className={classes.contentBox}> {this.props.content}</Box>
            <Box>{this.props.icon}</Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ResponseDialog);
