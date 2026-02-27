/*
import React, { useState } from "react";
import {
    Button,
    TextField,
    DialogActions,
    LinearProgress,
    Typography,
    Box,
    Paper,
    Divider
} from "@material-ui/core";
import { Delete as DeleteIcon, Cancel as CancelIcon } from "@material-ui/icons";
import TMAlert from "../components/TMAlert";

const DeleteItemComponent = ({ closeDialog }) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");

    const closeAlert = () => setAlertOpen(false);

    const deleteItem = async () => {
        if (!code.trim()) {
            setAlertMessage("Item code is required!");
            setAlertSeverity("warning");
            setAlertOpen(true);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/deleteItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemCode: code }),
            });

            const data = await response.json();
            setLoading(false);

            if (data.success) {
                setAlertMessage(" Item deleted successfully!");
                setAlertSeverity("success");
                setAlertOpen(true);

                setTimeout(() => {
                    setCode("");
                    closeDialog();
                }, 1000);
            } else {
                setAlertMessage(data.error || "Failed to delete item.");
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        } catch (error) {
            setLoading(false);
            setAlertMessage("⚠️ Error deleting item!");
            setAlertSeverity("error");
            setAlertOpen(true);
        }

        setTimeout(() => setAlertOpen(false), 5000);
    };

    return (
        <Paper elevation={3} style={{ padding: "24px", maxWidth: "400px", margin: "0 auto" }}>
            {loading && <LinearProgress color="secondary" />}
            <Box mb={2} textAlign="center">
                <Typography variant="h6" gutterBottom>
                    Confirm Deletion
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Please enter the item code you want to delete.
                </Typography>
            </Box>

            <TextField
                label="Item Code"
                value={code}
                onChange={(ev) => setCode(ev.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={loading}
            />

            <Divider style={{ margin: "16px 0" }} />

            <DialogActions>
                <Button
                    variant="outlined"
                    color="default"
                    startIcon={<CancelIcon />}
                    onClick={closeDialog}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={deleteItem}
                    disabled={loading}
                >
                    Delete
                </Button>
            </DialogActions>

            <TMAlert
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={closeAlert}
            />
        </Paper>
    );
};

export default DeleteItemComponent;
*/
import React, { useState } from "react";
import {
    Button,
    TextField,
    DialogActions,
    LinearProgress,
    Typography,
    Box,
    Paper,
    Divider
} from "@material-ui/core";
import { Delete as DeleteIcon, Cancel as CancelIcon } from "@material-ui/icons";
import TMAlert from "../components/TMAlert";

const DeleteItemComponent = ({ closeDialog }) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");

    const closeAlert = () => setAlertOpen(false);

    const deleteItem = async () => {
        if (!code.trim()) {
            setAlertMessage("Item code is required!");
            setAlertSeverity("warning");
            setAlertOpen(true);
            return;
        }

        setLoading(true);

        try {
            // ✅ Relative URL works with proxy
            const response = await fetch("/deleteItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: parseInt(code) }), // ✅ key must match backend
            });

            const data = await response.json();
            setLoading(false);

            if (data.success) {
                setAlertMessage(`Item ${code} deleted successfully!`);
                setAlertSeverity("success");
                setAlertOpen(true);

                // Reset form and close dialog
                setTimeout(() => {
                    setCode("");
                    closeDialog();
                }, 1000);
            } else {
                setAlertMessage(data.detail || "Failed to delete item.");
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        } catch (error) {
            setLoading(false);
            setAlertMessage("⚠️ Error deleting item!");
            setAlertSeverity("error");
            setAlertOpen(true);
        }

        // Auto close alert after 5 sec
        setTimeout(() => setAlertOpen(false), 5000);
    };

    return (
        <Paper elevation={3} style={{ padding: "24px", maxWidth: "400px", margin: "0 auto" }}>
            {loading && <LinearProgress color="secondary" />}
            <Box mb={2} textAlign="center">
                <Typography variant="h6" gutterBottom>
                    Confirm Deletion
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Please enter the item code you want to delete.
                </Typography>
            </Box>

            <TextField
                label="Item Code"
                value={code}
                onChange={(ev) => setCode(ev.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={loading}
            />

            <Divider style={{ margin: "16px 0" }} />

            <DialogActions>
                <Button
                    variant="outlined"
                    color="default"
                    startIcon={<CancelIcon />}
                    onClick={closeDialog}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={deleteItem}
                    disabled={loading}
                >
                    Delete
                </Button>
            </DialogActions>

            <TMAlert
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={closeAlert}
            />
        </Paper>
    );
};

export default DeleteItemComponent;