import React, { ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { IconFilter } from "@tabler/icons-react";

type Props = {
  leftSection?: ReactNode;
  subheader?: string;
  footer?: string | JSX.Element;
  children: JSX.Element;
  onClickFilter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickCreate?: () => void | undefined;
};

const TableCard = ({
  children,
  footer,
  leftSection,
  onClickCreate,
  onClickFilter
}: Props) => {
  const customizer = useSelector((state: AppState) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{
        padding: 0,
        border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none"
      }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? "outlined" : undefined}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={1.5}
      >
        {leftSection}
        <Stack direction={"row"} spacing={3}>
          <Button
            startIcon={<IconFilter />}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              if (onClickFilter) {
                onClickFilter(event);
              }
            }}
          >
            <Typography>Шүүх</Typography>
          </Button>
          {onClickCreate && (
            <Button color="secondary" onClick={onClickCreate}>
              <Typography>Бүртгэх</Typography>
            </Button>
          )}
        </Stack>
      </Stack>
      <Divider />

      <CardContent>{children}</CardContent>
      {footer ? (
        <>
          <Divider />
          <Box p={3}>{footer}</Box>
        </>
      ) : (
        ""
      )}
    </Card>
  );
};

export default TableCard;
