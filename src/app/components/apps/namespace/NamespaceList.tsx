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
  TablePagination,
  IconButton
} from "@mui/material";
import NamespaceAdd from "./NamespaceAdd";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import React from "react";
import { postRequest } from "@/utils/network/handlers";

const NamespaceList = () => {
  const [perm, setPerm] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [recordsFiltered, setRecordsFiltered] = useState(0);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - perm.length) : 0;
  const token = "lW9M4Bm10uHT2EfRTDOxLjnAp6ssFx";
  const url = "https://backofficeapidev.databank.mn/auth/namespace/list/";
  const body = {
    cnd: {},
    list: {
      rpp: 50,
      page: 1,
      order: {
        name: 1,
        created_date: -1
      }
    }
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      // const { data: res } = await axios.post(url, body, config);
      const data = await postRequest("/auth/namespace/list/", body);
      console.log("data", data);
      setRecordsFiltered(data["ret"]["records_filtered"]);
      setPerm(res["ret"]["data"]);
    };
    getPermissions();
  }, []);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("event.target.value", event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function handleDelete(pk: string) {
    const url =
      "https://backofficeapidev.databank.mn/auth/namespace/delete/" + pk + "/";
    try {
      const response = await axios.delete(url, config);
      console.log("response", response);
    } catch (error) {
      console.log("алдаа гарлаа.", error);
    }
  }

  async function handleEdit(pk: string) {
    const url =
      "https://backofficeapidev.databank.mn/auth/namespace/update/" + pk + "/";
    const body = {
      hdr: {
        name: "Дата бэйнк",
        user_type: "dtb_development"
      }
    };
    try {
      const response = await axios.post(url, body, config);
      console.log("response", response);
    } catch (error) {
      console.log("алдаа гарлаа.", error);
    }
  }

  return (
    <>
      <NamespaceAdd />
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
                <Typography variant="h6">Салбарын нэр</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Толгой салбар</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Хэрэглэгчийн төрөл</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Хяналт</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? perm.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : perm
            ).map((row: any) => (
              <TableRow
                key={row.pk}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.parent?.value}</TableCell>
                <TableCell>{row.user_type?.value}</TableCell>
                <TableCell>
                  <IconButton>
                    <IconTrash
                      width={16}
                      onClick={() => handleDelete(row.pk)}
                    />
                  </IconButton>
                  <IconButton>
                    <IconEdit width={16} onClick={() => handleEdit(row.pk)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                count={recordsFiltered}
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

export default NamespaceList;
