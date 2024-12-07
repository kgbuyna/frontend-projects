import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps
} from "@mui/material";
import * as dropdownData from "./data";

import { IconMail } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import Image from "next/image";
import { useUserData } from "@/store/hooks/UserContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDialogs } from "@toolpad/core/useDialogs";
import { postRequest } from "@/utils/network/handlers";

interface ProfileChangeDialogProps extends DialogProps {
  payload: { imagePreview: string; formData: FormData };
}

const ProfileChangeDialog: React.FC<ProfileChangeDialogProps> = ({
  open,
  onClose,
  payload
}) => {
  console.log("payload");
  console.log(payload.formData);
  for (const [key, value] of payload.formData.entries()) {
    console.log(`${key}:`, value);
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => onClose()}
      sx={{
        width: "450px"
      }}
    >
      <DialogTitle sx={{ alignSelf: "center", justifySelf: "center" }}>
        <Typography variant="h5">Change Profile Picture</Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex", // Use flexbox layout
          justifyContent: "center" // Center horizontally
        }}
      >
        <Avatar
          src={payload.imagePreview} // Show the preview or fallback image
          alt={"ProfileImg"}
          sx={{ width: 140, height: 140 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Stack
          direction={"row"}
          sx={{ width: "100%" }}
          justifyContent={"space-between"}
        >
          <Button
            onClick={() => onClose()}
            variant="contained"
            color="info"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const baseUrl = "http://localhost:9696/";

              const res = await postRequest<{ path: string }>(
                "upload/",
                payload.formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                },
                baseUrl
              );

              const { path } = res.data;
            }}
            variant="contained"
            sx={{ minWidth: 100 }}
            color="success"
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const dialog = useDialogs();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      setSelectedFile(file);
      console.log(file);

      const reader = new FileReader();
      const formData = new FormData();
      formData.append("file", file);

      reader.onloadend = () => {
        const imagePreview = reader.result as string;

        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        dialog.open(ProfileChangeDialog, {
          imagePreview: imagePreview || "",
          formData: formData
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const { logout } = useUserData();

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main"
          })
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/profile/user-1.jpg"}
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            p: 4
          }
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Badge
            badgeContent={
              <IconButton
                component="label"
                // onClick={async () => dialog.open(ProfileChangeDialog)}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Hide the default file input
                />
                <AddCircleIcon color="primary" sx={{ width: 30, height: 30 }} />
              </IconButton>
            }
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom"
            }}
          >
            <Avatar
              src={"/images/profile/user-1.jpg"}
              alt={"ProfileImg"}
              variant="rounded"
              sx={{ width: 95, height: 95 }}
            />
          </Badge>
          <Box>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              fontWeight={600}
            >
              Mathew Anderson1
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Designer
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              info@modernize.com
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link href={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    <Avatar
                      src={profile.icon}
                      alt={profile.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: "240px"
                      }}
                    >
                      {profile.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: "240px"
                      }}
                      noWrap
                    >
                      {profile.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <Box
            bgcolor="primary.light"
            p={3}
            mb={3}
            overflow="hidden"
            position="relative"
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h5" mb={2}>
                  Unlimited <br />
                  Access
                </Typography>
                <Button variant="contained" color="primary">
                  Upgrade
                </Button>
              </Box>
              <Image
                src={"/images/backgrounds/unlimited-bg.png"}
                width={150}
                height={183}
                style={{ height: "auto", width: "auto" }}
                alt="unlimited"
                className="signup-bg"
              />
            </Box>
          </Box>
          <Button onClick={logout} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
