import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import itLocale from "@fullcalendar/core/locales/it";
import { minHour, maxHour } from "./Utility";

const styles = (theme) => ({
  calendar: {
    margin: "30px 0px 30px 0px",
    fontSize: 12,
    minWidth: "90%",
    "@media(min-width: 993px)": {
      marginLeft: 50,
      marginRight: 50,
      fontSize: 16,
    },
  },

  businessHours: {
    backgroundColor: "grey",
  },
});

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.props.date,
    }

    this.events = this.props.workingDays == null ? null : this.props.workingDays.map((data) => {
      return {
        title: "Orario di lavoro",
        daysOfWeek: [data.day],
        startTime: data.initialHour,
        endTime: data.finalHour,
        color: "gray",
        rendering: "background",
      };
    });
    this.props.events.forEach((ev) => {
      return this.events.push(ev);
    })
  }

  getBusinessHour = () => {
    let businessHour = [];
    for (let i = 0; i < this.props.date.length; i++) {
      businessHour.push(this.props.date[i]);
    }
    return businessHour;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.calendar}>
        <FullCalendar
          slotMinTime={minHour(this.props.date)}
          slotMaxTime={maxHour(this.props.date)}
          height={600}
          locale={itLocale}
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          businessHours={this.state.date == null ? null : this.state.date.map((data) => {
            return {
              daysOfWeek: [data.day],
              startTime: data.initialHour,
              endTime: data.finalHour,
            };
          })}
          events={this.events}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Calendar);
