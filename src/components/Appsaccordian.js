import { apiRequest } from "../controler/api";
import { Divider } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
    Button, Dialog, DialogActions, CircularProgress,
    DialogContent, DialogTitle, Fab, Grid,
    makeStyles, Paper, Typography, TextField
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import TMAlert from "./TMAlert";

// ================= STYLE =================
const mystyles = makeStyles(() => ({
    mainContainer: { display: "flex" },
    leftContainer: {
        marginLeft: "5px",
        paddingRight: "10px",
        borderRight: "1px solid black",
        padding: "2px"
    },
    rightContainer: { flexGrow: 1, marginLeft: "20px" },
    leftCustomer: {
        width: "100%",
        backgroundColor: "#d14c13",
        textAlign: 'center',
        padding: "3px"
    }
}));

// ================= API =================
const getCustomers = async () => {
    const res = await apiRequest("/getCustomers");
    return await res.json();
};

const addCustomer = async (customer) => {
    const data = new URLSearchParams(customer);
    const res = await apiRequest("/addCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
    });
    return await res.json();
};

const updateCustomer = async (customer) => {
    const data = new URLSearchParams(customer);
    const res = await apiRequest("/updateCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
    });
    return await res.json();
};

const removeCustomer = async (code) => {
    const data = new URLSearchParams();
    data.append("code", code);

    const res = await apiRequest("/removeCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
    });

    return await res.json();
};

// ================= MAIN =================
/*const Appsaccordian = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const refreshCustomers = async () => {
        const res = await getCustomers();
        if (res.success) setCustomers(res.data || []);
    };

    useEffect(() => {
        refreshCustomers();
    }, []);

    const classes = mystyles();

    return (
        <div>
            <Typography variant="h6">Customer Information</Typography>

            <div className={classes.mainContainer}>
                <div className={classes.leftContainer}>
                    <Typography className={classes.leftCustomer}>Customer</Typography>

                    {customers.map(c => (
                        <Button key={c.code} onClick={() => setSelectedCustomer(c)}>
                            {c.name}
                        </Button>
                    ))}
                </div>

                <div className={classes.rightContainer}>
                    <CustomerListComponent
                        selectedCustomer={selectedCustomer}
                        refreshCustomers={refreshCustomers}
                    />
                </div>
            </div>
        </div>
    );
};*/
const Appsaccordian = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const refreshCustomers = async () => {
        const res = await getCustomers();
        if (res.success) setCustomers(res.data || []);
    };

    useEffect(() => {
        refreshCustomers();
    }, []);

    const classes = mystyles();

    return (
        <div>
            <Typography variant="h6" style={{ marginBottom: 10 }}>
                Customer Information
            </Typography>

            <div className={classes.mainContainer}>

                {/* LEFT SIDE */}
                <div className={classes.leftContainer}>
                    <Typography className={classes.leftCustomer}>
                        Customers
                    </Typography>

                    <Divider style={{ margin: "10px 0" }} />

                    {/* ✅ VERTICAL LIST */}
                    {customers.map(c => (
                        <Paper
                            key={c.code}
                            elevation={selectedCustomer?.code === c.code ? 4 : 1}
                            style={{
                                padding: 10,
                                marginBottom: 8,
                                cursor: "pointer",
                                background:
                                    selectedCustomer?.code === c.code
                                        ? "#e3f2fd"
                                        : "#fff"
                            }}
                            onClick={() => setSelectedCustomer(c)}
                        >
                            <Typography variant="subtitle1">
                                {c.name}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                {c.contact1}
                            </Typography>
                        </Paper>
                    ))}
                </div>

                {/* RIGHT SIDE */}
                <div className={classes.rightContainer}>
                    <CustomerListComponent
                        selectedCustomer={selectedCustomer}
                        refreshCustomers={refreshCustomers}
                    />
                </div>
            </div>
        </div>
    );
};

// ================= CUSTOMER VIEW =================
const CustomerListComponent = ({ selectedCustomer, refreshCustomers }) => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [customerData, setCustomerData] = useState({});

    if (!selectedCustomer) return <Typography>Select Customer</Typography>;

    return (
        <div style={{ padding: 20 }}>
            <Fab color="primary" onClick={() => setOpenAdd(true)}>
                <Add />
            </Fab>

            <Paper style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h5" gutterBottom>
                    {selectedCustomer.name}
                </Typography>

                <Divider style={{ margin: "10px 0" }} />

                {/*  VERTICAL DETAILS */}
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Typography><b>Code:</b> {selectedCustomer.code}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography><b>Address:</b> {selectedCustomer.address}</Typography>
                    </Grid>

                    {/* Registration */}
                    <Grid item xs={6}>
                        <Typography><b>{selectedCustomer.regTitle1}:</b> {selectedCustomer.regValue1}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography><b>{selectedCustomer.regTitle2}:</b> {selectedCustomer.regValue2}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography><b>{selectedCustomer.regTitle3}:</b> {selectedCustomer.regValue3}</Typography>
                    </Grid>

                    {/* Contacts */}
                    <Grid item xs={4}>
                        <Typography><b>Contact 1:</b> {selectedCustomer.contact1}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography><b>Contact 2:</b> {selectedCustomer.contact2}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography><b>Contact 3:</b> {selectedCustomer.contact3}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography><b>State Code:</b> {selectedCustomer.stateCode}</Typography>
                    </Grid>

                </Grid>

                <Divider style={{ margin: "20px 0" }} />

                {/* ACTION BUTTONS */}
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: 10 }}
                    onClick={() => {
                        setCustomerData(selectedCustomer);
                        setOpenEdit(true);
                    }}
                >
                    Edit
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setCustomerData(selectedCustomer);
                        setOpenDelete(true);
                    }}
                >
                    Delete
                </Button>
            </Paper>

            {/* Dialogs */}
            <AddDialogComponent
                open={openAdd}
                handleClose={() => setOpenAdd(false)}
                onDone={refreshCustomers}
            />

            <EditDialogComponent
                open={openEdit}
                handleClose={() => setOpenEdit(false)}
                customerData={customerData}
                onDone={refreshCustomers}
            />

            <DeleteDialogComponent
                open={openDelete}
                handleClose={() => setOpenDelete(false)}
                customerData={customerData}
                onDone={refreshCustomers}
            />
        </div>
    );
};
// ================= ADD =================
const AddDialogComponent = ({ open, handleClose, onDone }) => {
    const [data, setData] = useState({
        code: "",
        name: "",
        address: "",
        regTitle1: "",
        regValue1: "",
        regTitle2: "",
        regValue2: "",
        regTitle3: "",
        regValue3: "",
        contact1: "",
        contact2: "",
        contact3: "",
        stateCode: ""
    });

    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        setLoading(true);

        const res = await addCustomer(data);

        setLoading(false);

        if (res.success) {
            onDone();
            handleClose();

            setData({
                code: "",
                name: "",
                address: "",
                regTitle1: "",
                regValue1: "",
                regTitle2: "",
                regValue2: "",
                regTitle3: "",
                regValue3: "",
                contact1: "",
                contact2: "",
                contact3: "",
                stateCode: ""
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Customer</DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <TextField label="Code" fullWidth
                            value={data.code}
                            onChange={e => setData({ ...data, code: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="Name" fullWidth
                            value={data.name}
                            onChange={e => setData({ ...data, name: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="Address" fullWidth multiline rows={3}
                            value={data.address}
                            onChange={e => setData({ ...data, address: e.target.value })}
                        />
                    </Grid>

                    {/* Registration Fields */}
                    <Grid item xs={6}>
                        <TextField label="Reg Title 1" fullWidth
                            value={data.regTitle1}
                            onChange={e => setData({ ...data, regTitle1: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Reg Value 1" fullWidth
                            value={data.regValue1}
                            onChange={e => setData({ ...data, regValue1: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Reg Title 2" fullWidth
                            value={data.regTitle2}
                            onChange={e => setData({ ...data, regTitle2: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Reg Value 2" fullWidth
                            value={data.regValue2}
                            onChange={e => setData({ ...data, regValue2: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Reg Title 3" fullWidth
                            value={data.regTitle3}
                            onChange={e => setData({ ...data, regTitle3: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Reg Value 3" fullWidth
                            value={data.regValue3}
                            onChange={e => setData({ ...data, regValue3: e.target.value })}
                        />
                    </Grid>

                    {/* Contacts */}
                    <Grid item xs={4}>
                        <TextField label="Contact 1" fullWidth
                            value={data.contact1}
                            onChange={e => setData({ ...data, contact1: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField label="Contact 2" fullWidth
                            value={data.contact2}
                            onChange={e => setData({ ...data, contact2: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField label="Contact 3" fullWidth
                            value={data.contact3}
                            onChange={e => setData({ ...data, contact3: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="State Code" fullWidth
                            value={data.stateCode}
                            onChange={e => setData({ ...data, stateCode: e.target.value })}
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>

                <Button onClick={handleAdd} color="primary" variant="contained">
                    {loading ? <CircularProgress size={20} /> : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ================= EDIT =================
const EditDialogComponent = ({ open, handleClose, customerData, onDone }) => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        address: "",
        regTitle1: "",
        regValue1: "",
        regTitle2: "",
        regValue2: "",
        regTitle3: "",
        regValue3: "",
        contact1: "",
        contact2: "",
        contact3: "",
        stateCode: ""
    });

    const [loading, setLoading] = useState(false);

    // Dialog open → data fill
    useEffect(() => {
        if (customerData) {
            setFormData({
                code: customerData.code || "",
                name: customerData.name || "",
                address: customerData.address || "",
                regTitle1: customerData.regTitle1 || "",
                regValue1: customerData.regValue1 || "",
                regTitle2: customerData.regTitle2 || "",
                regValue2: customerData.regValue2 || "",
                regTitle3: customerData.regTitle3 || "",
                regValue3: customerData.regValue3 || "",
                contact1: customerData.contact1 || "",
                contact2: customerData.contact2 || "",
                contact3: customerData.contact3 || "",
                stateCode: customerData.stateCode || ""
            });
        }
    }, [customerData, open]);

    const handleSave = async () => {
        setLoading(true);

        const res = await updateCustomer(formData);

        setLoading(false);

        if (res.success) {
            onDone();
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Customer</DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>

                    {/* Name */}
                    <Grid item xs={12}>
                        <TextField
                            label="Customer Name"
                            fullWidth
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </Grid>

                    {/* Registration Fields */}
                    <Grid item xs={6}>
                        <TextField
                            label="Reg Title 1"
                            fullWidth
                            value={formData.regTitle1}
                            onChange={e => setFormData({ ...formData, regTitle1: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Reg Value 1"
                            fullWidth
                            value={formData.regValue1}
                            onChange={e => setFormData({ ...formData, regValue1: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Reg Title 2"
                            fullWidth
                            value={formData.regTitle2}
                            onChange={e => setFormData({ ...formData, regTitle2: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Reg Value 2"
                            fullWidth
                            value={formData.regValue2}
                            onChange={e => setFormData({ ...formData, regValue2: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Reg Title 3"
                            fullWidth
                            value={formData.regTitle3}
                            onChange={e => setFormData({ ...formData, regTitle3: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Reg Value 3"
                            fullWidth
                            value={formData.regValue3}
                            onChange={e => setFormData({ ...formData, regValue3: e.target.value })}
                        />
                    </Grid>

                    {/* Contacts */}
                    <Grid item xs={4}>
                        <TextField
                            label="Contact 1"
                            fullWidth
                            value={formData.contact1}
                            onChange={e => setFormData({ ...formData, contact1: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            label="Contact 2"
                            fullWidth
                            value={formData.contact2}
                            onChange={e => setFormData({ ...formData, contact2: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            label="Contact 3"
                            fullWidth
                            value={formData.contact3}
                            onChange={e => setFormData({ ...formData, contact3: e.target.value })}
                        />
                    </Grid>

                    {/* State Code */}
                    <Grid item xs={12}>
                        <TextField
                            label="State Code"
                            fullWidth
                            value={formData.stateCode}
                            onChange={e => setFormData({ ...formData, stateCode: e.target.value })}
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>

                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} /> : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};// ================= DELETE =================
const DeleteDialogComponent = ({ open, handleClose, customerData, onDone }) => {
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await removeCustomer(customerData.code);

            if (res.success) {
                setMessage("Deleted successfully");
                setSeverity("success");
                onDone();
            } else {
                setMessage(res.detail || "Delete failed");
                setSeverity("error");
            }

        } catch (err) {
            setMessage(err.message);
            setSeverity("error");
        }

        setLoading(false);
        setAlertOpen(true);
        handleClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle style={{ color: "red" }}>Confirm Delete</DialogTitle>

                <DialogContent>
                    <Typography>
                        Delete <b>{customerData?.name}</b> ?
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>

                    <Button onClick={handleDelete} disabled={loading}>
                        {loading ? <CircularProgress size={20}/> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            <TMAlert
                open={alertOpen}
                message={message}
                severity={severity}
                onClose={() => setAlertOpen(false)}
            />
        </>
    );
};

export default Appsaccordian;