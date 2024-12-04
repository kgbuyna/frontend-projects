"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination
} from "@mui/material";
import { MdMoreVert } from "react-icons/md";
import PermissionGroupAdd from "./PermissionGroupAdd";

const PermissionGroupList = () => {
  const [perm, setPerm] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = "n1Mwz50vAk5hSQpMt73s4KaFdTwyIv";
  const url =
    "https://backofficeapidev.databank.mn/auth/permission_group/list/";
  const body = JSON.stringify({
    cnd: {},
    list: {
      rpp: 50,
      page: 1,
      order: {
        name: 1,
        created_date: -1
      }
    }
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getPermissions = async () => {
      const { data: res } = await axios.post(url, body, config);
      console.log("res", res);
      setPerm(res["ret"]["data"]);
    };
    getPermissions();
  }, []);

  return (
    <>
      <PermissionGroupAdd />
      <TableContainer>
        <Table
          aria-label="custom pagination table"
          sx={{
            whiteSpace: "nowrap"
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Албан тушаалын нэр</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Салбар</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Эрх</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Хяналт</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {perm.map((row: any) => (
              <TableRow
                key={row.pk}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.namespace}</TableCell>
                <TableCell>{row.permissions?.value}</TableCell>
                <TableCell>
                  <MdMoreVert />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={4}
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                count={perm.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              ></TablePagination>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default PermissionGroupList;
