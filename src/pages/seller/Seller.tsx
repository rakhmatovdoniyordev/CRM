import { request } from "@/api";
import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/Table";
import { Box, Button, TablePagination, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Seller = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
      _event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      setPage(newPage);
    };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [open, setOpen] = useState<null | string>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['seller', {page, rowsPerPage}],
    queryFn: () => request.get("/get/sellers", {
      params: {
        skip: page,
        limit: rowsPerPage,
      }
    }).then((res) => res.data),
  });
  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Seller
        </Typography>
        <Button onClick={() => setOpen("seller")}>Create</Button>
      </Box>
      <Table data={data?.innerData} isLoading={isLoading}/>
      <div>
        <TablePagination
          component="div"
          count={data?.totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <CreateCS open={open} close={() => setOpen(null)} />
    </div>
  );
};

export default Seller;
