import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Stack,
  InputLabel
} from "@mui/material";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { accessTokenKey, rememberMe } from "@/utils/consts";
import { useUser } from "@/store/hooks/UserContext";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { postRequest } from "@/utils/network/handlers";

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
  checked: Yup.boolean()
});

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      username: localStorage.getItem(rememberMe),
      password: "",
      checked: !!localStorage.getItem(rememberMe)
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await postRequest<{
          token: string;
        }>("auth/login", {
          username: values.username,
          password: values.password
        });
        if (res.data?.token) {
          localStorage.setItem(accessTokenKey, res.data.token);
        } else {
          throw new Error("Token is undefined");
        }
      } catch (error) {
        toast.error(error.message || "", {
          position: "top-right"
        });
      } finally {
        setLoading(false);
      }
      // res.data?.token
    }
  });

  const { values, handleChange, handleSubmit, errors } = formik;

  const { login } = useUser();

  return (
    <form onSubmit={handleSubmit}>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}
      {subtext}
      <Stack rowGap={1}>
        <Box>
          <InputLabel htmlFor="username">Username</InputLabel>
          <CustomTextField
            onChange={handleChange}
            value={values.username}
            id="username"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel htmlFor="password">Password</InputLabel>
          <CustomTextField
            onChange={handleChange}
            value={values.password}
            type="password"
            name="password"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={values.checked}
                  onChange={handleChange}
                />
              }
              label="Remember Me!"
            />
          </FormGroup>
        </Stack>
      </Stack>
      <Box>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          type="submit"
        >
          Login
        </LoadingButton>
      </Box>
      {subtitle}
    </form>
  );
};

export default AuthLogin;
