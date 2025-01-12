import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import React from "react";
import { ICustomer } from "@/types";

const BasicTable: React.FC<{ data: ICustomer[]; isLoading: boolean }> = ({ data, isLoading }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First name</TableCell>
            <TableCell align="right">Last name</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Address</TableCell>
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
                </TableRow>
              ))
            : data?.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.fname}
                  </TableCell>
                  <TableCell align="right">{row.lname}</TableCell>
                  <TableCell align="right">{row.phone_primary}</TableCell>
                  <TableCell align="right">{row.budget}</TableCell>
                  <TableCell align="right">{row.address}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
