import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  useTheme
} from "@mui/material";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";

const options = [
  {
    id: 0,
    name: "Агуулсан",
    query: "_Icontains"
  },
  {
    id: 1,
    name: "Тэнцүү",
    query: "_Iexact"
  },
  {
    id: 2,
    name: "Эхэлсэн",
    query: "_Istartswith"
  },
  {
    id: 3,
    name: "Төгссөн",
    query: "_Iendswith"
  }
];

const StringFieldFilter = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = React.useState<string>(options[0].query);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Box justifyContent={"center"} display={"flex"} alignItems="center">
      <>
        <Button
          onClick={handleClick}
          variant="text"
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: "transparent",
            fontWeight: 400,
            fontSize: 13,
            m: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)", // Adjust the hover background color
              color: theme.palette.text.primary
            }
          }}
          endIcon={
            <IconChevronDown size={14} color={theme.palette.text.primary} />
          }
        >
          Мерчантын дугаар
        </Button>

        <Popover
          open={open}
          sx={{
            position: "absolute"
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <Box
            sx={{
              p: 1,
              mx: 2,
              mt: 1,
              borderColor: "#cacaca"
            }}
            display={"flex"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
            <FormControl fullWidth sx={{ my: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Age</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={selected}
                label="Шүүлтүүр"
                onChange={handleChange}
              >
                {options.map((item, index) => (
                  <MenuItem key={index} value={item.query}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomTextField
              sx={{ my: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                )
              }}
              placeholder="Мерчантын дугаар..."
            />
            <Box
              mt={1}
              flexDirection="row"
              display="flex"
              width={"100%"}
              alignItems="center"
              justifyContent="space-between"
            >
              <Link underline="hover">{"Шүүлт цэвэрлэх"}</Link>
              <Link
                component="button"
                onClick={() => alert("button click")}
                color="#80e354"
                underline="hover"
              >
                {"Хайх"}
              </Link>
            </Box>
          </Box>
        </Popover>
      </>
    </Box>
  );
};

export default StringFieldFilter;
