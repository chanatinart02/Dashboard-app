import { useList } from "@refinedev/core";
import { Box, Typography, Stack } from "@mui/material";

import {
  PieChart,
  PropertyReferrals,
  PropertyCard,
  TotalRevenue,
} from "../components";

function Home() {
  // Fetching a list of properties with pagination configuration
  const { data, isLoading, isError } = useList({
    resource: "properties",
    config: {
      pagination: {
        pageSize: 4,
      },
    },
  });

  // Extracting the latest properties from the fetched data
  const latestProperties = data?.data ?? [];

  // Handling loading and error states
  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Something went wrong!</Typography>;

  return (
    <Box>
      {/* Dashboard Title */}
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        Dashboard
      </Typography>

      {/* Pie Charts Section */}
      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Properties for Sale"
          value={684}
          series={[75, 25]}
          colors={["#475be8", "#e4e8ef"]}
        />
        <PieChart
          title="Properties for Rent"
          value={550}
          series={[60, 40]}
          colors={["#475ae8", "#e4b8ef"]}
        />
        <PieChart
          title="Total Customers"
          value={5684}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Properties for Cities"
          value={555}
          series={[75, 25]}
          colors={["#475be8", "#e4e8ef"]}
        />
      </Box>

      {/* Total Revenue and Property Referrals */}
      <Stack mt="25px" width="100%" direction={{ xs: "column", lg: "row" }}>
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>

      {/* Latest Properties Section */}
      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Properties
        </Typography>

        {/* Property Cards */}
        <Box mt={2.5} sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {latestProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              photo={property.photo}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
