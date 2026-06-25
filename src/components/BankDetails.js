import React, { useState } from "react";
//import { TextField, Button, Typography, Container, Paper, Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
const Register = () => {
    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolder: "",
        
    });

    const handleChange = (e) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Bank Details Submitted:", bankDetails);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{textAlign:"center",color:"purple"}} >
                    Bank Details
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Bank Name"
                                name="bankName"
                                fullWidth
                                variant="outlined"
                                value={bankDetails.bankName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Account Number"
                                name="accountNumber"
                                fullWidth
                                variant="outlined"
                                value={bankDetails.accountNumber}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="IFSC Code"
                                name="ifscCode"
                                fullWidth
                                variant="outlined"
                                value={bankDetails.ifscCode}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Account Holder Name"
                                name="accountHolder"
                                fullWidth
                                variant="outlined"
                                value={bankDetails.accountHolder}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;
