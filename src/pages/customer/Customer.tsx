import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/Table";
import { Box, Button, Skeleton, TablePagination, Typography } from "@mui/material";
import { useState } from "react";
import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

const Customer = () => {
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
    queryKey: ["customer", { page, rowsPerPage }],
    queryFn: () => request.get("/get/customers", {
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
          Customer
        </Typography>
        <Button onClick={() => setOpen("customer")}>Create</Button>
      </Box>
      <Table data={data?.innerData} isLoading={isLoading} queryKey={"customer"}/>
      <div className="flex justify-end">
      {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="20%"
            height={15} // Balandlikni mos ravishda belgilang
            sx={{ mt: 2 }} // Yuqoridan biroz masofa
          />
        ) : (
          <TablePagination
            component="div"
            count={data?.totalCount || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
      <CreateCS open={open} close={() => setOpen(null)} />
    </div>
  );
};

export default Customer;
