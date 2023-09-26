import { useMemo } from "react";
import { Add } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PropertyCard, CustomButton } from "../components";

function AllProperties() {
  const navigate = useNavigate();

  // Destructuring properties from useTable hook
  const {
    tableQueryResult: { data, isLoading, isError }, // Data, loading, and error status
    current, // Current page number
    setCurrent, // Function to set the current page
    setPageSize, // Function to set the page size (number of items per page)
    pageCount, // Total number of pages
    sorters, // Sorting configuration
    setSorters, // Function to set sorting configuration
    setFilters, // Function to set filters
    filters, // Filter configuration
  } = useTable();

  // Extracting properties from the data or setting an empty array if data is undefined
  const allProperties = data?.data ?? [];

  // Extracting the current sorting order for the 'price' field
  const currentPrice = sorters.find((item) => item.field === "price")?.order;

  // Function to toggle the sorting order of the 'price' field
  const toggleSort = (field: string) => {
    setSorters([{ field, order: currentPrice === "asc" ? "desc" : "asc" }]);
  };

  // Memoizing the current filter values  that contains filter values for the "title" and "propertyType" fields.
  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) =>
      "field" in item ? item : []
    );
    return {
      title: logicalFilters.find((item) => item.field === "title")?.value || "",
      propertyType:
        logicalFilters.find((item) => item.field === "propertyType")?.value ||
        "",
    };
  }, [filters]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error...</Typography>;

  return (
    <Box>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {!allProperties.length
              ? "There are no properties"
              : "All Properties"}
          </Typography>

          {/* Filter and Sort Controls */}
          <Box
            mb={2}
            mt={3}
            display="flex"
            width="84%"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              mb={{ xs: "20px", sm: 0 }}
            >
              {/* sorting by Price */}
              <CustomButton
                title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
                handleClick={() => toggleSort("price")}
                backgroundColor="#475be8"
                color="#fcfcfc"
              />
              {/* Filter by Title */}
              <TextField
                variant="outlined"
                color="info"
                placeholder="Search by title"
                value={currentFilterValues.title}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "title",
                      operator: "contains",
                      value: e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                  ]);
                }}
              />
              {/* Filter by Property Type */}
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue=""
                value={currentFilterValues.propertyType}
                onChange={(e) => {
                  setFilters(
                    [
                      {
                        field: "propertyType",
                        operator: "eq",
                        value: e.target.value,
                      },
                    ],
                    "replace"
                  );
                }}
              >
                <MenuItem value="">All</MenuItem>
                {[
                  "Apartment",
                  "Villa",
                  "Farmhouse",
                  "Condos",
                  "Townhouse",
                  "Duplex",
                  "Studio",
                  "Chalet",
                ].map((type) => (
                  <MenuItem key={type} value={type.toLowerCase()}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Button to Add New Property */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <CustomButton
          title="Add Property"
          handleClick={() => {
            navigate("/properties/create");
          }}
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Stack>

      {/* Display All Created Properties */}
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {allProperties.map((property) => (
          <PropertyCard
            key={property._id}
            id={property._id}
            title={property.title}
            price={property.price}
            location={property.location}
            photo={property.photo}
          />
        ))}
      </Box>

      {/* Pagination Controls */}
      {allProperties.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          {/* Previous Btn */}
          <CustomButton
            title="Previous"
            handleClick={() => setCurrent((prev) => prev - 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={!(current > 1)}
          />
          {/* Show current page number */}
          <Box
            display={{ xs: "hidden", sm: "flex" }}
            alignItems="center"
            gap="5px"
          >
            Page{" "}
            <strong>
              {current} of {pageCount}
            </strong>
          </Box>
          {/* Previous Btn */}
          <CustomButton
            title="Next"
            handleClick={() => setCurrent((prev) => prev + 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={current === pageCount}
          />

          {/* Dropdown to select page size */}
          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={10}
            onChange={(e) => {
              setPageSize(e.target.value ? Number(e.target.value) : 10);
            }}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
}

export default AllProperties;
