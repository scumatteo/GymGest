import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Drawer, Box, Button, TextField } from "@material-ui/core";
import { getNameByDay } from "../calendar/Utility";

const styles = (theme) => ({
  drawerDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },

  buttonBox: {
    margin: "0px 10px 0px 10px",
  },

  subtitle: {
    fontWeight: "600 !important",
  },
  mainBox: {
    margin: "10px 0px 10px 0px",
  },

  leftBox: {
    margin: "0px 10px 0px 0px",
  },

  rightBox: {
    width: 120,
    margin: "0px 0px 0px 10px",
  },
});

class DateDrawer extends Component {
  
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
                {this.props.info == null ? null : this.props.info.map((date) => {
                  return (
                    <Box
                      key={date.day}
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      className={classes.mainBox}
                    >
                      <Box className={classes.leftBox}>
                        <Typography variant="body2" color="initial">
                          {getNameByDay(date.day)}
                        </Typography>
                      </Box>
                      <Box className={classes.rightBox}>
                        <TextField
                          fullWidth
                          id="time"
                          label="Orario apertura"
                          type="time"
                          onChange={this.props.handleChange(
                            date.day,
                            "initialHour"
                          )}
                          value={
                            this.props.info.find((d) => d.day === date.day)
                              .initialHour
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, 
                          }}
                        />
                      </Box>
                      <Box className={classes.rightBox}>
                        <TextField
                          fullWidth
                          id="time"
                          label="Orario chiusura"
                          type="time"
                          onChange={this.props.handleChange(
                            date.day,
                            "finalHour"
                          )}
                          value={
                            this.props.info.find((d) => d.day === date.day)
                              .finalHour
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
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

export default withStyles(styles)(DateDrawer);
