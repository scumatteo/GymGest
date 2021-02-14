import React, { Component } from "react";
import {
    Avatar,
    Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";


const styles = (theme) => ({

    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontWeight: "600 !important",
        marginTop: 20,
        "@media(min-width: 993px)": {
            marginTop: 40,
        },
    },
    avatar: {
        "z-index": 1,
        width: theme.spacing(17),
        height: theme.spacing(17),
        margin: 100,
        marginBottom: 10,
        "@media(min-width: 993px)": {
            marginLeft: theme.spacing(5),
            marginRight: theme.spacing(5),
        },
    },
   
});



class ImagePreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classNameFullScreen: '',
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Box display="flex" alignItems="center" flexDirection="column">
                    <Box>
                        <Avatar
                            className={classes.avatar}
                            alt="profile image"
                            src={this.props.dataUri != null ? this.props.dataUri : null}
                        />
                    </Box>

                </Box>
            </div>
        );
    }
}


export default withStyles(styles)(ImagePreview);
