import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const TMAlert = ({ 
    open, 
    message, 
    severity = "info",  // ✅ Default: info
    duration = 5000,    // ✅ Default: 5 sec
    onClose,
    horizontalAlignment = "center",
    verticalAlignment = "bottom"
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            anchorOrigin={{ horizontal: horizontalAlignment, vertical: verticalAlignment }}
            onClose={onClose}
        >
            <Alert
                elevation={6}
                variant="filled"
                severity={severity}
                onClose={onClose}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default TMAlert;
