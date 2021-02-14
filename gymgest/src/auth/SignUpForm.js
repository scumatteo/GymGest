import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@material-ui/core";
import ResponseDialog from "../ResponseDialog";
import SimpleFormComponent from "./SimpleFormComponent";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import CancelIcon from "@material-ui/icons/Cancel";

const styles = (theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },

  formControl: {
    width: "50%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

export class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.respDialog = React.createRef();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <form className={classes.form} noValidate>
          <Grid container spacing={2} justify="center">
            {this.props.fields == null ? null : this.props.fields.map((f) => {
              return (
                <Grid item xs={12} key={f.id}>
                  <SimpleFormComponent
                    id={f.id}
                    label={f.label}
                    type={f.type}
                    autoFocus={f.autoFocus}
                    value={this.props.formData[f.id]}
                    onChange={this.props.onChange}
                    error={f.error}
                    helperText={f.helperText}
                    inputProps={f.inputProps}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Box display="flex" justifyContent="center">
            <Box p={1} className={classes.formControl}>
              <FormControl
                fullWidth
                error={
                  this.props.submitted && this.props.formData.gender === ""
                }
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  id="gender"
                  value={this.props.formData.gender}
                  onChange={this.props.onChange("gender")}
                >
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                </Select>
                <FormHelperText>
                  {this.props.submitted && this.props.formData.gender === ""
                    ? "Field required"
                    : null}
                </FormHelperText>
              </FormControl>
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.props.onClick}
          >
            Sign Up
          </Button>
        </form>
        <ResponseDialog
          ref={this.respDialog}
          open={this.props.dialog.open}
          title={this.props.dialog.error ? "ERRORE" : "REGISTRAZIONE AVVENUTA"}
          content={this.props.dialog.response}
          icon={
            this.props.dialog.error ? (
              <CancelIcon
                color="secondary"
                style={{ fontSize: 40 }}
              ></CancelIcon>
            ) : (
              <CheckCircleRoundedIcon
                color="primary"
                style={{ fontSize: 40 }}
              />
            )
          }
        />
      </div>
    );
  }
}

export default withStyles(styles)(SignUpForm);
