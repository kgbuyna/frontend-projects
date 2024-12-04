import { DictProps } from "@/app/(DashboardLayout)/types/common";
import { Box, Typography } from "@mui/material";

const Dict = ({ label, value }: DictProps) => {
  return (
    <Box>
      <Typography variant="body1" fontWeight="600" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" sx={{ wordWrap: "break-word" }} mb={0.5}>
        {value}
      </Typography>
    </Box>
  );
};

export default Dict;
