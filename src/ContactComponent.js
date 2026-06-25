import React from "react";
import { withStyles } from "@material-ui/core";
import myStyles from "../styles/styles";

const ContactComponent = () => {
    return (
        <div>
            <h1>Contact Us</h1>
            <p>Get in touch with us.</p>
        </div>
    );
};

export default withStyles(myStyles)(ContactComponent);
