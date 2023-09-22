import { Box, Typography, Stack } from "@mui/material";
import ReactApexChart from "react-apexcharts";

import { propertyReferralsInfo } from "../../constants/index"; //mock data

// Define a TypeScript interface for ProgressBar component props
interface ProgressBarProps {
  title: string;
  percentage: number;
  color: string;
}

// ProgressBar Component
const ProgressBar = ({ title, percentage, color }: ProgressBarProps) => (
  <Box width="100%">
    {/* Stack for displaying title and percentage */}
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      {/* Displaying title */}
      <Typography fontSize={16} fontWeight={500} color="#11142d">
        {title}
      </Typography>
      {/* Displaying percentage */}
      <Typography fontSize={16} fontWeight={500} color="#11142d">
        {percentage}%
      </Typography>
    </Stack>
    {/* Progress bar */}
    <Box
      mt={2}
      position="relative"
      height="8px"
      width="100%"
      borderRadius={1}
      bgcolor="#e4e8ef"
    >
      <Box
        width={`${percentage}%`}
        bgcolor={color}
        position="absolute"
        height="100%"
      />
    </Box>
  </Box>
);

// PropertyReferrals Component
const PropertyReferrals = () => {
  return (
    <Box
      p={4}
      bgcolor="#f3f3f3"
      id="chart"
      minWidth={490}
      display="flex"
      flexDirection="column"
      borderRadius="15px"
    >
      <Typography fontSize={18} fontWeight={600} color="#11142d">
        Property Referrals
      </Typography>

      {/* Stack of Progress Bars */}
      <Stack my="20px" direction="column" gap={4}>
        {propertyReferralsInfo.map((bar) => (
          <ProgressBar key={bar.title} {...bar} />
        ))}
      </Stack>
    </Box>
  );
};

export default PropertyReferrals;
