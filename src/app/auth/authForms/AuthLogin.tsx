import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { useUserData } from "@/store/hooks/UserContext";
import { rememberMe } from "@/utils/consts";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Stack,
  Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
  checked: Yup.boolean()
});

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
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
        await login({
          username: values.username,
          password: values.password
        });
        router.push("/apps/chats");
      } catch (error) {
        toast.error(error.message || "", {
          position: "top-right"
        });
      } finally {
        setLoading(false);
      }
    }
  });

  const { values, handleChange, handleSubmit } = formik;

  const { login } = useUserData();

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
