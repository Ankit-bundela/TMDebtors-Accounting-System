/*import { apiRequest } from "../controler/api";
import {
  Button,
  CircularProgress,
  Fab,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
  Tooltip
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { DeleteForever, Edit } from "@material-ui/icons";
import DialogComponent from "./DialogComponent";

const getItems = async () => {
  try {
    const response = await fetch("/getItems");
    if (!response.ok) throw new Error("Failed to fetch API data");
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

const getItemsDetails = async (code) => {
  try {
    const response = await fetch(`/getItemsDetails?code=${code}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching item details:", error);
    return null;
  }
};

const deleteItem = async (code) => {
  try {
    const response = await fetch("/deleteItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    if (!response.ok) throw new Error("Failed to delete item");
    return response.json();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: theme.spacing(3),
    backgroundColor: "#f5f7fa",
    minHeight: "100vh"
  },
  mainPaper: {
    padding: theme.spacing(3),
    position: "relative",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
  },
  title: {
    fontWeight: 700,
    color: theme.palette.primary.dark
  },
  fabContainer: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: "flex",
    gap: theme.spacing(1)
  },
  tableContainer: {
    maxHeight: 400,
    marginTop: theme.spacing(2),
    borderRadius: 8,
    overflow: "hidden"
  },
  tableCell: { whiteSpace: "nowrap" },
  rowHover: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer"
    }
  },
  detailPaper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    borderRadius: 12,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
  }
}));

const TableComponent = () => {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  useEffect(() => {
    getItems().then((data) => {
      setShowProgress(false);
      setItems(data);
    });
  }, []);

  const openAddDialog = () => {
    setDialogType("add");
    setDialogOpen(true);
  };

  const openDeleteDialog = () => {
    setDialogType("delete");
    setDialogOpen(true);
  };

  const openEditDialog = async (item) => {
    setSelectedItem(item);
    setDialogType("edit");
    setDialogOpen(true);
    const details = await getItemsDetails(item.code);
    setSelectedItemDetails(details);
  };

  const closeDialog = () => setDialogOpen(false);

  const onPageSizeChanged = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const onPageChanged = (event, newPage) => setPageNumber(newPage);

  const isItemSelected = (code) => selectedItems.includes(code);

  const onSelectedClicked = () => {
    if (areAllSelected) {
      setSelectedItems([]);
      setAreAllSelected(false);
    } else {
      setSelectedItems(items.map((item) => item.code));
      setAreAllSelected(true);
    }
  };

  const onTableRowClicked = (code) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.includes(code);
      return isSelected
        ? prevSelected.filter((itemCode) => itemCode !== code)
        : [...prevSelected, code];
    });
  };

  return (
    <div className={classes.mainContainer}>
      <Paper className={classes.mainPaper}>
        <Typography variant="h5" className={classes.title} gutterBottom>
          Debtors Accounting
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Number of Items Selected: {selectedItems.length}
        </Typography>

        <div className={classes.fabContainer}>
          <Tooltip title="Add Item">
            <Fab color="primary" onClick={openAddDialog} size="small">
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Delete Selected">
            <Fab color="secondary" onClick={openDeleteDialog} size="small">
              <DeleteForever />
            </Fab>
          </Tooltip>
        </div>

        <DialogComponent
          openDialog={dialogOpen}
          closeDialog={closeDialog}
          dialogType={dialogType}
          selectedItem={selectedItem}
        />

        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedItems.length > 0 &&
                      selectedItems.length < items.length
                    }
                    checked={areAllSelected}
                    onClick={onSelectedClicked}
                  />
                </TableCell>
                <TableCell>S.No</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>HSN Code</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showProgress ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                items
                  .slice(
                    pageNumber * pageSize,
                    pageNumber * pageSize + pageSize
                  )
                  .map((item, idx) => (
                    <TableRow
                      key={item.code}
                      hover
                      className={classes.rowHover}
                      onClick={() => onTableRowClicked(item.code)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected(item.code)} />
                      </TableCell>
                      <TableCell>{pageNumber * pageSize + (idx + 1)}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.hsnCode}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Item">
                          <Fab
                            size="small"
                            color="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(item);
                            }}
                          >
                            <Edit />
                          </Fab>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider style={{ margin: "16px 0" }} />

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          count={items.length}
          rowsPerPage={pageSize}
          page={pageNumber}
          onPageChange={onPageChanged}
          onRowsPerPageChange={onPageSizeChanged}
        />
      </Paper>

      {selectedItem && selectedItemDetails && (
        <ItemDetailComponent
          item={selectedItem}
          details={selectedItemDetails}
        />
      )}
    </div>
  );
};

const ItemDetailComponent = ({ item, details }) => (
  <Paper elevation={3} style={{ padding: 20, marginTop: 24 }}>
    <Typography variant="h6" color="primary" gutterBottom>
      Item Details
    </Typography>
    <Typography><strong>Name:</strong> {item.name}</Typography>
    <Typography><strong>CGST:</strong> {item.cgst}</Typography>
    <Typography><strong>SGST:</strong> {item.sgst}</Typography>
    <Typography><strong>IGST:</strong> {item.igst}</Typography>
    <Typography>
      <strong>Units:</strong> {details.unitofMeasurements?.length > 0
        ? details.unitofMeasurements.map((u) => u.name).join(", ")
        : "N/A"}
    </Typography>
  </Paper>
);

export default TableComponent;*/
import { apiRequest } from "../controler/api";
import {
  Button,
  CircularProgress,
  Fab,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
  Tooltip
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { DeleteForever, Edit } from "@material-ui/icons";
import DialogComponent from "./DialogComponent";

/* ---------------- API CALLS ---------------- */

const getItems = async () => {
  try {
    const response = await apiRequest("/getItems");
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

const getItemsDetails = async (code) => {
  try {
    const response = await apiRequest(`/getItemsDetails?code=${code}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching item details:", error);
    return null;
  }
};

const deleteItem = async (code) => {
  try {
    const response = await apiRequest("/deleteItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

/* ---------------- STYLES ---------------- */

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: theme.spacing(3),
    backgroundColor: "#f5f7fa",
    minHeight: "100vh"
  },
  mainPaper: {
    padding: theme.spacing(3),
    position: "relative",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
  },
  title: {
    fontWeight: 700,
    color: theme.palette.primary.dark
  },
  fabContainer: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: "flex",
    gap: theme.spacing(1)
  },
  tableContainer: {
    maxHeight: 400,
    marginTop: theme.spacing(2),
    borderRadius: 8,
    overflow: "hidden"
  },
  rowHover: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer"
    }
  }
}));

/* ---------------- COMPONENT ---------------- */

const TableComponent = () => {
  const classes = useStyles();

  const [items, setItems] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  useEffect(() => {
    getItems().then((data) => {
      setShowProgress(false);
      setItems(data);
    });
  }, []);

  const openAddDialog = () => {
    setDialogType("add");
    setDialogOpen(true);
  };

  const openDeleteDialog = () => {
    setDialogType("delete");
    setDialogOpen(true);
  };

  const openEditDialog = async (item) => {
    setSelectedItem(item);
    setDialogType("edit");
    setDialogOpen(true);

    const details = await getItemsDetails(item.code);
    setSelectedItemDetails(details);
  };

  const closeDialog = () => setDialogOpen(false);

  const onPageSizeChanged = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const onPageChanged = (event, newPage) => setPageNumber(newPage);

  const isItemSelected = (code) => selectedItems.includes(code);

  const onSelectedClicked = () => {
    if (areAllSelected) {
      setSelectedItems([]);
      setAreAllSelected(false);
    } else {
      setSelectedItems(items.map((item) => item.code));
      setAreAllSelected(true);
    }
  };

  const onTableRowClicked = (code) => {
    setSelectedItems((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  return (
    <div className={classes.mainContainer}>
      <Paper className={classes.mainPaper}>
        <Typography variant="h5" className={classes.title}>
          Debtors Accounting
        </Typography>

        <Typography variant="subtitle1" color="textSecondary">
          Selected: {selectedItems.length}
        </Typography>

        <div className={classes.fabContainer}>
          <Tooltip title="Add Item">
            <Fab color="primary" onClick={openAddDialog} size="small">
              <AddIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="Delete Selected">
            <Fab color="secondary" onClick={openDeleteDialog} size="small">
              <DeleteForever />
            </Fab>
          </Tooltip>
        </div>

        <DialogComponent
          openDialog={dialogOpen}
          closeDialog={closeDialog}
          dialogType={dialogType}
          selectedItem={selectedItem}
        />

        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedItems.length > 0 &&
                      selectedItems.length < items.length
                    }
                    checked={areAllSelected}
                    onClick={onSelectedClicked}
                  />
                </TableCell>
                <TableCell>S.No</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>HSN Code</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {showProgress ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                items
                  .slice(
                    pageNumber * pageSize,
                    pageNumber * pageSize + pageSize
                  )
                  .map((item, idx) => (
                    <TableRow
                      key={item.code}
                      hover
                      className={classes.rowHover}
                      onClick={() => onTableRowClicked(item.code)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected(item.code)} />
                      </TableCell>

                      <TableCell>
                        {pageNumber * pageSize + idx + 1}
                      </TableCell>

                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.hsnCode}</TableCell>

                      <TableCell align="center">
                        <Tooltip title="Edit Item">
                          <Fab
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(item);
                            }}
                          >
                            <Edit />
                          </Fab>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider style={{ margin: "16px 0" }} />

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          count={items.length}
          rowsPerPage={pageSize}
          page={pageNumber}
          onPageChange={onPageChanged}
          onRowsPerPageChange={onPageSizeChanged}
        />
      </Paper>

      {selectedItem && selectedItemDetails && (
        <Paper style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h6">Item Details</Typography>
          <Typography>Name: {selectedItem.name}</Typography>
          <Typography>CGST: {selectedItem.cgst}</Typography>
          <Typography>SGST: {selectedItem.sgst}</Typography>
          <Typography>IGST: {selectedItem.igst}</Typography>
        </Paper>
      )}
    </div>
  );
};

export default TableComponent;