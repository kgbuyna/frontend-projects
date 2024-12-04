"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Alert } from "@mui/material";

export default function NamespaceAdd() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [option, setOption] = useState("");
  const [choices, setChoices] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const token = "lW9M4Bm10uHT2EfRTDOxLjnAp6ssFx";
  const url = "https://backofficeapidev.databank.mn/auth/namespace/create/";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backofficeapidev.databank.mn/auth/resource/USER_TYPE_CHOICES/",
          config
        );
        setChoices(response["data"]["ret"]);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
    setUserType(event.target.value as string);
  };

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert((prev) => !prev);
    }, 3000);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !userType) {
      setError("Бүх талбарын утгыг бөглөнө үү.");
      return;
    }

    const body = JSON.stringify({
      hdr: {
        name: name,
        user_type: userType
      }
    });

    try {
      const response = await axios.post(url, body, config);
      console.log("response", response);
      if (response.data["status_code"] === "ok") {
        triggerAlert();
        handleClose();
      } else {
        triggerAlert();
      }
      console.log("response", response);
    } catch (error) {
      console.log("бүртгэхэд алдаа гарлаа.", error);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert variant="filled" severity="success">
          {"Message Alert"}
        </Alert>
      )}
      <Box p={3} pb={1}>
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          Namespace нэмэх
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" variant="h5">
            {"Namespace нэмэх"}
          </DialogTitle>
          <DialogContent>
            <Box mt={3}>
              <form onSubmit={handleSubmit}>
                <Grid spacing={3} container>
                  <Grid item xs={12} lg={12}>
                    <FormLabel>Салбарын нэр</FormLabel>
                    <TextField
                      id="name"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <FormControl fullWidth>
                      <FormLabel>Хэрэглэгчийн төрөл</FormLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        placeholder="Төрөл сонгоно уу..."
                        value={option}
                        onChange={handleChange}
                      >
                        {choices.map((option: any) => (
                          <MenuItem key={option.key} value={option.key}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    {error && <div className="error-message">{error}</div>}
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Button sx={{ mr: 1 }} type="submit">
                      Хадгалах
                    </Button>
                    <Button onClick={handleClose}>Буцах</Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
