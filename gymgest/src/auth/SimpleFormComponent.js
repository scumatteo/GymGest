import React, { Component } from "react";
import { TextField } from "@material-ui/core";

class SimpleFormComponent extends Component {
  render() {
    return (
      <TextField
        id={this.props.id}
        label={this.props.label}
        value={this.props.value}
        onChange={this.props.onChange(this.props.id)}
        variant="outlined"
        required
        fullWidth
        autoFocus={this.props.autoFocus}
        type={this.props.type}
        error={this.props.error}
        helperText={this.props.helperText}
        InputProps={this.props.inputProps}
      />
    );
  }
}

export default SimpleFormComponent;
