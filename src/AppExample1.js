import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        margin: theme.spacing(5),
    }
}));

const AppExample1 = () => {
    const classes = useStyles();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [selectedState, setSelectedState] = useState(null);
    const [states, setStates] = useState([]);

    // API Call
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch("/getStates");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                alert("Fetched States: " + JSON.stringify(data)); // ✅ Console ki jagah Alert
                setStates(data); 
            } catch (error) {
                alert("Error fetching states: " + error.message); // ✅ Error Alert
            }
        };

        fetchStates();
    }, []);

    return (
        <Grid className={classes.mainContainer}>
            <Grid item>
                <TextField
                    label="User Name"
                    placeholder="Enter a name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </Grid>
            <Grid item>
                <TextField
                    label="Password"
                    type="password"
                    placeholder="Enter a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Autocomplete
                    options={states}
                    getOptionLabel={(option) => option.name || option.stateName}
                    onChange={(event, value) => setSelectedState(value)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select State" variant="outlined" />
                    )}
                />
            </Grid>
            <Grid item>
                <Button 
                    onClick={() => alert("User: " + userName + "\nPassword: " + password + "\nState: " + (selectedState ? selectedState.name || selectedState.stateName : "No State Selected"))} 
                    variant="contained">
                    Click me
                </Button>
            </Grid>
        </Grid>
    );
};

export default AppExample1;
