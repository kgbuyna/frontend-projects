import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Stack
} from "@mui/material";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { ChangeEvent, useEffect, useState } from "react";
import { oauthClientId, oauthClientSecret, rememberMe } from "@/utils/consts";
import { useUser } from "@/store/hooks/UserContext";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import React from "react";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const { login } = useUser();

  const signIn = async () => {
    try {
      setLoading(true);
      const data = {
        username: userName,
        password: password,
        client_id: oauthClientId,
        client_secret: oauthClientSecret,
        grant_type: "password"
      };
      login(data)
        .then(() => {
          setLoading(false);
          if (checked) {
            localStorage.setItem(rememberMe, userName);
          }
          toast.success("Амжилттай.", {
            position: "top-right",
            duration: 3000
          });
        })
        .catch(() => {
          setLoading(false);
          toast.error("Нэвтрэх нэр эсвэл нууц үг буруу байна.", {
            position: "top-right",
            duration: 3000
          });
        });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const me = localStorage.getItem(rememberMe);
    if (me) {
      setChecked(true);
      setUserName(me);
    }
  }, []);

  const handleChangeName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserName(event.target.value);
  };

  const handleChangePassword = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(event.target.value);
  };

  const changeCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}
      {subtext}
      <Stack>
        <Box>
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField
            onChange={handleChangeName}
            value={userName}
            id="username"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            onChange={handleChangePassword}
            id="password"
            value={password}
            type="password"
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
                <CustomCheckbox checked={checked} onChange={changeCheckBox} />
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
          onClick={signIn}
          size="large"
        >
          Sign In
        </LoadingButton>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
