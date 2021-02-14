import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { Typography, Drawer, Box, Button, IconButton } from "@material-ui/core";
import ConfirmationDialog from "../ConfirmationDialog";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Axios from "axios";

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

    icon: {
        width: "70px",
        "@media(max-width: 993px)": {
            width: "40px",
        },
    },
});

class ImageDrawer extends Component {

    constructor(props) {
        super(props);
        this.dialog = React.createRef();

        this.state = {
            videoConstraints: {
                width: 1280,
                height: 720,
                facingMode: "user"
            },
            webcamRef: {},
            src: {},
            alt: {},
            confirmDialog: {
                open: false,
            },
            dialogClick: false,
            file: null,
        };
    }

    handleBinImage = () => {
        let { confirmDialog } = this.state;
        this.setState({ open: false });
        confirmDialog.open = true;
    }

    handleClickCancelImage = (event) => {
        event.preventDefault();
        let { confirmDialog } = this.state;
        confirmDialog.open = false;
        this.setState({ confirmDialog: confirmDialog });
    };

    handleCloseBin = () => {
        let { confirmDialog } = this.state;
        confirmDialog.open = false;
        this.setState({ confirmDialog: confirmDialog });
        this.props.handleChangeBin()
    };

    handleClickOkImage = (event) => {
        event.preventDefault();
        let { confirmDialog } = this.state;
        confirmDialog.open = false;
        this.setState({ confirmDialog: confirmDialog });
        sessionStorage.removeItem("image");
        Axios.put(`http://localhost:3001/api/users/${sessionStorage.getItem("id")}`,
            {},
            {
                headers: { "x-access-token": sessionStorage.getItem("accessToken") },
            }
        )
            
    };

    handleFile = () => {
        this.setState({ dialogClick: true });
    };

    handleClickCloseDialog = () => {
        this.setState({ dialogClick: false });
    };

    handleFileChange = (event) => {
        let file = event.target.files[0];
        this.setState({ file: file });
    };

    handleCapture = React.useCallback
    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.handleSet}
                <Drawer
                    anchor="bottom"
                    open={this.props.open}
                    onClose={this.props.toggleDrawer}
                    onSave={this.props.onSave}
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
                                <Box>
                                    <IconButton
                                        position="fixed"
                                        className={classes.photoIconButton}
                                        onClick={this.handleFile}
                                    >
                                        <img alt="GalleryImage" src="/gallery.ico" className={classes.icon}>
                                        </img>
                                    </IconButton>
                                    <IconButton
                                        position="fixed"
                                        className={classes.photoIconButton}
                                        onClick={this.handleBinImage}
                                    >
                                        <img alt="BinImage" src="/bin.ico" className={classes.icon}>
                                        </img>
                                    </IconButton>
                                    <ConfirmationDialog
                                        open={this.state.confirmDialog.open}
                                        title="Elimina immagine"
                                        content="Sei sicuro di voler eliminare l'immagine di profilo?"
                                        handleCancel={this.handleClickCancelImage}
                                        handleOk={this.handleCloseBin}
                                    />
                                    <Dialog
                                        ref={this.dialog}
                                        open={this.state.dialogClick} onClose={this.handleClickCloseDialog} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Modifica immagine di profilo</DialogTitle>
                                        <DialogContent>
                                            <label for="myfile" >Seleziona un file:</label>
                                            <input type="file" id="myfile" name="myfile" onChange={this.handleFileChange} />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this.handleClickCloseDialog} color="primary">
                                                Annulla
                                                    </Button>
                                            <Button onClick={this.props.handleChangeImage(this.state.file)} color="primary">
                                                Modifica
                                                     </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </form>
                            <Box display="flex" flexDirection="row" mb="10px">
                                <Box className={classes.buttonBox}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.props.handleCancel}
                                    >
                                        CHIUDI
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

export default withStyles(styles)(withRouter(ImageDrawer));
