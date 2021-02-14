import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withRouter } from "react-router-dom";
import GeneralList from "../user/GeneralList";
import Axios from "axios";
import MediaQuery from "react-responsive";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    CircularProgress,
    Box,
} from "@material-ui/core";


const styles = (theme) => ({
    list: {
        marginTop: theme.spacing(8),
    },
});

class Tracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workout: {},
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:3001/api/maps`, {
            headers: { "x-access-token": sessionStorage.getItem("accessToken") },
        }).then((res) => {
            const workout = res.data;
            workout.sort((a, b) => {
                return a.date < b.date;
            });
            this.setState({ workout: workout });
        });
    }

    handleClickMapsDetail = (id) => (event) => {
        event.preventDefault();
        sessionStorage.setItem("dataMap", id);
        sessionStorage.setItem("axiosMap", "true");
        this.props.history.push({
            pathname: "/map",
        });
    };


    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar position="fixed" color="primary">
                    <Toolbar>
                        <MediaQuery maxDeviceWidth={992}>
                            <IconButton
                                aria-label=""
                                color="inherit"
                                onClick={this.props.history.goBack}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </MediaQuery>
                        <Typography variant="h6">Allenamenti Outdoor</Typography>
                    </Toolbar>
                </AppBar>
                {Object.keys(this.state.workout).length === 0 ? (
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
                ) : (
                        <div className={classes.list}>
                            <GeneralList
                                items={this.state.workout == null
                                    ? null
                                    : this.state.workout.map((wo) => {
                                        return {
                                            _id: wo._id,
                                            date: wo.date,
                                            time: wo.time,
                                        };
                                    })}
                                page="map"
                                handleClickItem={this.handleClickMapsDetail}
                            />
                        </div>)}
            </div>
        );
    }
}


export default withStyles(styles)(withRouter(Tracker));
