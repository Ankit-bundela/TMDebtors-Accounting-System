/*
import React from "react";
import { Button, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AddItemComponent from "../controler/AddItemComponent";
import DeleteItemComponent from "../controler/DeleteComponent";

const DialogComponent = ({ openDialog, closeDialog, dialogType }) => {
    return (
        <Dialog
            fullWidth
            disableEscapeKeyDown
            disableBackdropClick
            open={openDialog}
            onClose={closeDialog}
        >
            <DialogTitle>{dialogType === "add" ? "Add New Item" : "Delete Item"}</DialogTitle>
            
            <DialogContent>
                {dialogType === "add" ? (
                    <AddItemComponent closeDialog={closeDialog} />
                ) : (
                    <DeleteItemComponent closeDialog={closeDialog} />
                )}
            </DialogContent>
            
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={closeDialog}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogComponent;*/
import React from "react";
import { Button, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AddItemComponent from "../controler/AddItemComponent";
import DeleteItemComponent from "../controler/DeleteComponent";
import EditItemComponent from "../controler/EditComponent";

const DialogComponent = ({ openDialog, closeDialog, dialogType, selectedItem }) => {
    return (
        <Dialog fullWidth disableEscapeKeyDown disableBackdropClick open={openDialog} onClose={closeDialog}>
            <DialogTitle>
                {dialogType === "add" ? "Add New Item" : dialogType === "edit" ? "Edit Item" : "Delete Item"}
            </DialogTitle>
            
            <DialogContent>
                {dialogType === "add" ? (
                    <AddItemComponent closeDialog={closeDialog} />
                ) : dialogType === "edit" ? (
                    <EditItemComponent closeDialog={closeDialog} selectedItem={selectedItem} />
                ) : (
                    <DeleteItemComponent closeDialog={closeDialog} />
                )}
            </DialogContent>
            
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={closeDialog}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogComponent;
