import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Theme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";

interface Props {
  open: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  children: React.JSX.Element;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: 0,
    maxHeight: "100%",
    width: "50vw",
    height: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const RightSideDialog = ({ open, onClose, title, children }: Props) => {
  const isFullScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return (
    <StyledDialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      fullScreen={isFullScreen}
    >
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </StyledDialog>
  );
};

export default RightSideDialog;
