import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
    Typography,
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemSecondaryAction,
    AppBar,
    Toolbar,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ReceiptIcon from '@material-ui/icons/Receipt';
import { withRouter } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MediaQuery from "react-responsive";
import CancelIcon from "@material-ui/icons/Cancel";
import ResponseDialog from "../ResponseDialog";

var moment = require("moment");

const styles = (theme) => ({

    listItem: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 20,
    },

    primary: {
        fontSize: 14,
    },

    secondary: {
        fontSize: 16,
    },

    container: {
        marginRight: theme.spacing(3),
    },
    avatar: {
        "z-index": 1,
        width: theme.spacing(17),
        height: theme.spacing(17),
        marginRight: theme.spacing(3),
        marginTop: 80,
        "@media(min-width: 993px)": {
            marginLeft: theme.spacing(5),
            marginRight: theme.spacing(5),
        },
    },
    formControl: {
        margin: theme.spacing(3),
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5),
    },
    icon: {
        "z-index": 1,
        width: theme.spacing(12),
        height: theme.spacing(12),
        "@media(max-width: 993px)": {
            width: theme.spacing(5),
            height: theme.spacing(5),
        },
    },

});

class PlansDetails extends Component {
    constructor(props) {
        super(props);
        this.dialog = React.createRef();

        this.state = {
            plans: [],
            planLabel: [],
            dialogClick: false,
            exercices: {},
            errorDialog: {
                open: false,
                response: "",
            },
        };
        this.id = sessionStorage.getItem("idPlan");
    }

    handleClickCloseDialog = () => {
        this.setState({ dialogClick: false });
    };

    handleClickOpenDialog = () => {
        this.setState({ dialogClick: true });
    };

    handleClickModifyDialog = () => {
        Axios.put(
            `http://localhost:3001/api/plan/${this.state.plans._id}`,
            {
                exercises: this.state.exercices,
            },
            { headers: { "x-access-token": sessionStorage.getItem("accessToken") } }
        )
            .then((res) => {
                this.setState({ dialogClick: false });
                let { planLabel } = this.state;
                let { plans } = this.state;
                plans.exercises = this.state.exercices;
                planLabel[4].value = this.state.exercices;
                this.setState({ plans: plans, planLabel: planLabel });
            })
            .catch((err) => {
                this.setDialogProperties(this.state.errorDialog)(true)(
                    err
                  );
      
                  this.setDialogClosing(this.state.errorDialog)(null);
            });
    };

    handleChangeValue = (event) => {
        this.setState({ exercices: event.target.value });
    }

    handleGoBack = (event) => {
        event.preventDefault();
        this.props.history.goBack();
       
    }

    componentDidMount() {
        Axios.get(`http://localhost:3001/api/planDetail/${this.id}`, {
            headers: { "x-access-token": sessionStorage.getItem("accessToken") },
        }).then((res) => {
            const plans = res.data;
            const planLabel = [
                {
                    label: "Obiettivo della scheda",
                    value: res.data.goal,
                    enabled: false,
                },
                { label: "Data di inizio: ", value: moment(res.data.initialDate).format("DD-MM-YYYY"), enabled: false, type: "date" },
                { label: "Data di fine: ", value: moment(res.data.finalDate).format("DD-MM-YYYY"), enabled: false, type: "date" },
                { label: "Durata: ", value: res.data.duration, enabled: false },
                {
                    label: "Esercizi: ",
                    value: res.data.exercises,
                    enabled: res.data.coach._id === sessionStorage.getItem("id") ? true : false,
                },
            ];
            this.setState({ plans: plans, planLabel: planLabel, exercices: plans.exercises });
        });
    }

    setDialogProperties = (dialog) => (open) => (response) => {
        dialog.open = open;
        dialog.response = response;
        this.setState({
            dialog,
        });
    };

    setDialogClosing = (dialog) => (navigate) => {
        setTimeout(() => {
            this.setDialogProperties(dialog)(false)("");
            if (navigate != null) {
                navigate();
            }
        }, 2000);
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
                                onClick={this.handleGoBack}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </MediaQuery>
                        <Typography variant="h6">Dettaglio Scheda</Typography>
                    </Toolbar>
                </AppBar>
                <div className={classes.details}>
                    <Box display="flex" alignItems="center" flexDirection="column">
                        <Avatar alt="" className={classes.avatar}><ReceiptIcon className={classes.icon} /></Avatar>
                    </Box>
                    <List>
                        {this.state.planLabel == null ? null : this.state.planLabel.map((plan) => {
                            return (
                                <div key={plan.label}>
                                    <ListItem button={true}>
                                        <ListItemText
                                            className={classes.listItem}
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.primary}
                                                    color="textPrimary"
                                                >
                                                    {plan.label}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.secondary}
                                                    color="textPrimary"
                                                >
                                                    {plan.value}
                                                </Typography>
                                            }
                                        />
                                        {plan.enabled ? (
                                            <div>
                                                <ListItemSecondaryAction>
                                                    <IconButton onClick={this.handleClickOpenDialog}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                                <Dialog
                                                    ref={this.dialog}
                                                    open={this.state.dialogClick} onClose={this.handleClickCloseDialog} aria-labelledby="form-dialog-title">
                                                    <DialogTitle id="form-dialog-title">Modifica scheda</DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="name"
                                                            label="Obiettivo della scheda"
                                                            defaultValue={this.state.plans.goal}
                                                            disabled={true}
                                                            fullWidth
                                                        />
                                                        <form className={classes.container} noValidate>
                                                            <TextField
                                                                id="date"
                                                                label="Data di inizio"
                                                                type="date"
                                                                defaultValue={moment(this.state.plans.initialDate).format("YYYY-MM-DD")}
                                                                className={classes.textField}
                                                                disabled={true}
                                                            />
                                                        </form>
                                                        <form className={classes.containerSecond} noValidate>
                                                            <TextField
                                                                id="date"
                                                                label="Data di fine"
                                                                type="date"
                                                                defaultValue={moment(this.state.plans.finalDate).format("YYYY-MM-DD")}
                                                                className={classes.textField}
                                                                disabled={true}
                                                            />
                                                        </form>
                                                        <TextField
                                                            id="filled-basic"
                                                            label="Esercizi"
                                                            multiline
                                                            rows={8}
                                                            variant="filled"
                                                            value={this.state.exercices}
                                                            onChange={this.handleChangeValue}
                                                        />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={this.handleClickCloseDialog} color="primary">
                                                            Cancel
                                                    </Button>
                                                        <Button onClick={this.handleClickModifyDialog} color="primary">
                                                            Modifica
                                                     </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        ) : null}
                                    </ListItem>
                                    <Divider></Divider>
                                </div>
                            );
                        })}
                    </List>
                </div>
                <ResponseDialog
                    open={this.state.errorDialog.open}
                    title={"ERRORE"}
                    content={this.state.errorDialog.response}
                    icon={
                        <CancelIcon
                            color="secondary"
                            style={{ fontSize: 40 }}
                        ></CancelIcon>
                    }
                />
            </div>
        );
    }
}

export default withStyles(styles)(withRouter(PlansDetails));