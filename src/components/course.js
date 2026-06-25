import React from "react";
import { IconButton, Typography, withStyles } from "@material-ui/core";
import myStyles from "../styles/styles";
import { AccountBox } from "@material-ui/icons";

const Courses = () => {
    return (
        <div>
            <Typography variant="h3">
                <IconButton style={{ width: "100px", height: "100px",color:"blue" }} color="inherit">
                    <AccountBox style={{ fontSize: "60px" }} />
                </IconButton>
                TMDebtors Accounting
            </Typography>
        </div>
    );
};

export default withStyles(myStyles)(Courses);
