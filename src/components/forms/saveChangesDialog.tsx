"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from "@mui/material";
type Props = {
  showSaveChangesDialog: boolean;
  setShowSaveChangesDialog: (value: boolean) => void;
  onLeave: () => void;
};

const SaveChangesDialog = ({
  showSaveChangesDialog,
  setShowSaveChangesDialog,
  onLeave
}: Props) => {
  return (
    <Dialog open={showSaveChangesDialog} sx={{ p: 3 }}>
      <DialogTitle>Бүртгэлээ үргэлжлүүлэх үү?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Таны оруулсан мэдээлэл цонх хаасны дараа устах тул үргэлжлүүлж
          мэдээллээ бөглөх үү?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            setShowSaveChangesDialog(false);
            onLeave();
          }}
        >
          <Typography>Болих</Typography>
        </Button>

        <Button
          onClick={() => {
            setShowSaveChangesDialog(false);
          }}
        >
          <Typography>Үргэлжлүүлэх</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default SaveChangesDialog;
