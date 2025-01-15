import React, { useState } from "react";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { ICustomer } from "@/types";
import PushPinIcon from "@mui/icons-material/PushPin";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, Modal, TextField, Snackbar } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/api";
import CreditScoreIcon from '@mui/icons-material/CreditScore';

const style = {
  position: "absolute" as "absolute",
  borderRadius: 2,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface TableProps {
  data: ICustomer[];
  isLoading: boolean;
  queryKey: string;
}

const Table: React.FC<TableProps> = ({ data, isLoading, queryKey }) => {
  const [amount, setAmount] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<null | string>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [selectedItem, setSelectedItem] = useState<ICustomer | null>(null);
  const open = Boolean(anchorEl);

  const queryClient = useQueryClient();

  const pinMutation = useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: boolean }) =>
      request.patch(`update/${queryKey}/${id}`, { pin: !pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setSnackbarMessage("Pin status updated successfully");
      setSnackbarOpen(true);
    },
    onError: (error) => {
      console.error("Error updating pin status:", error);
      setSnackbarMessage("Error updating pin status");
      setSnackbarOpen(true);
    },
  });

  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, comment }: { id: string; amount: number; comment: string }) =>
      request.post(`create/${queryKey === "customer" ? "payment" : "expense"}`, {
        [`${queryKey}Id`]: id,
        amount,
        comment,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleCloseModal();
      setSnackbarMessage(`${queryKey === "customer" ? "Payment" : "Expense"} created successfully`);
      setSnackbarOpen(true);
      console.log("Server response:", data);
    },
    onError: (error) => {
      console.error(`Error creating ${queryKey === "customer" ? "payment" : "expense"}:`, error);
      setSnackbarMessage(`Error creating ${queryKey === "customer" ? "payment" : "expense"}`);
      setSnackbarOpen(true);
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleOpenModal = (item: ICustomer) => {
    setSelectedItem(item);
    setAmount(item.budget || null);
    setComment("");
    setModalOpen(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAmount(null);
    setComment("");
    setSelectedItem(null);
  };

  const handlePin = (id: string, pin: boolean) => {
    pinMutation.mutate({ id, pin });
    handleClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && amount !== null) {
      paymentMutation.mutate({ id: selectedItem._id, amount, comment });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <MuiTable sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First name</TableCell>
              <TableCell align="right">Last name</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Budget</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="50%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="50%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="40%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="30%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="90%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                  </TableRow>
                ))
              : data?.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <span>
                        {row.pin && (
                          <PushPinIcon
                            fontSize="small"
                            className="rotate-45 mr-2"
                          />
                        )}
                      </span>
                      {row.fname}
                    </TableCell>
                    <TableCell align="right">{row.lname}</TableCell>
                    <TableCell align="right">{row.phone_primary}</TableCell>
                    <TableCell align="right">
                      {row.budget}
                      {isToday(row.isPaidToday) && (
                        <CreditScoreIcon
                          fontSize="medium"
                          color="success"
                          sx={{ marginLeft: 1, position: "absolute" }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">{row.address}</TableCell>
                    <TableCell align="right">
                      <Button
                        sx={{ color: "#333" }}
                        onClick={(event) => handleClick(event, row._id)}
                      >
                        <MoreHorizIcon />
                      </Button>
                      {selectedId === row._id && (
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem onClick={() => handlePin(row._id, row.pin)}>
                            {row.pin ? "Unpin" : "Pin"}
                          </MenuItem>
                          <MenuItem onClick={() => handleOpenModal(row)}>Payment</MenuItem>
                        </Menu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <Modal
        keepMounted
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              id="name-input"
              label="Name"
              variant="outlined"
              value={selectedItem ? `${selectedItem.fname} ${selectedItem.lname}` : ""}
              disabled
            />
            <TextField
              id="phone-input"
              label="Phone"
              variant="outlined"
              value={selectedItem ? selectedItem.phone_primary : ""}
              disabled
            />
            <TextField
              id="amount-input"
              label="Amount"
              variant="outlined"
              type="number"
              value={amount || ""}
              onChange={handleAmountChange}
              required
            />
            <TextField
              id="comment-input"
              label="Comment"
              variant="outlined"
              value={comment}
              onChange={handleCommentChange}
              multiline
              rows={3}
            />
            <div className="flex gap-2 mx-auto">
              <Button variant="contained" color="success" type="submit">
                Submit
              </Button>
              <Button variant="contained" color="error" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default Table;
