import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Drawer, Box, Button, TextField } from "@material-ui/core";

const styles = (theme) => ({
  drawerDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },

  buttonBox: {
    margin: "10px 10px 0px 10px",
  },

  subtitle: {
    fontWeight: "600 !important",
  },
});

class EditDrawer extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Drawer
          anchor="bottom"
          open={this.props.open}
          onClose={this.props.toggleDrawer}
        >
          {
            <div className={classes.drawerDiv}>
              <Typography
                variant="body2"
                color="initial"
                className={classes.subtitle}
              >
                {this.props.subtitle}
              </Typography>
              <form>
                <TextField
                  id="formfield"
                  label={this.props.label}
                  value={this.props.value}
                  onChange={this.props.handleChange}
                />
              </form>

              <Box display="flex" flexDirection="row" mb="10px">
                <Box className={classes.buttonBox}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.props.handleCancel}
                  >
                    ANNULLA
                  </Button>
                </Box>
                <Box className={classes.buttonBox}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.props.handleSave}
                  >
                    SALVA
                  </Button>
                </Box>
              </Box>
            </div>
          }
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(EditDrawer);
