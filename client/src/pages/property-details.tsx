import { ImportExport } from "@mui/icons-material";
import { Typography, Stack, Box } from "@mui/material";
import { useGetIdentity, useDelete, useShow } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChatBubble,
  Delete,
  Edit,
  Phone,
  Place,
  Star,
} from "@mui/icons-material";

import { CustomButton } from "../components";

// Function to check if an image exists
function checkImage(url: any) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const PropertyDetails = () => {
  const navigate = useNavigate();

  // Get user's email from the identity hook
  const { data: user } = useGetIdentity<{
    email: string;
  }>();
  const userEmail = user?.email; // access user

  // Get the property ID from the URL params
  const { id } = useParams();

  // Hooks for delete operation and fetching property details
  const { mutate } = useDelete();
  const { queryResult } = useShow();

  // Extract data, loading, and error states from the query result
  const { data, isLoading, isError } = queryResult;
  const propertyDetails = data?.data ?? {};

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (isError) {
    return <div>Something went wrong!</div>;
  }

  // Check if the current user is the creator of the property
  //  accessing the email property of the first element in the creator array.
  const isCurrentUser = userEmail === propertyDetails.creator[0].email;

  // Function to handle property deletion
  const handleDeleteProperty = () => {
    alert("Are you sure you want to Delete this property?");

    mutate(
      {
        resource: "properties", // API endpoint
        id: id as string, // id of the property you want to delete
      },
      {
        // executed if the deletion operation is successful
        onSuccess: () => {
          navigate("/properties");
        },
      }
    );
  };

  return (
    <Box
      borderRadius="15px"
      padding="20px"
      bgcolor="#f3f3f3"
      width="fit-content"
    >
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        Details
      </Typography>

      <Box
        mt="20px"
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <Box flex={1} maxWidth={764}>
          {/* Property Image */}
          <img
            src={propertyDetails.photo}
            alt="property_details-img"
            height={546}
            style={{ objectFit: "cover", borderRadius: "10px", width: "100%" }}
            className="property_details-img"
          />

          <Box mt="15px">
            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              alignItems="center"
            >
              {/* Property Type */}
              <Typography
                fontSize={18}
                fontWeight={500}
                color="#11142D"
                textTransform="capitalize"
              >
                {propertyDetails.propertyType}
              </Typography>
              {/* Rating Stars */}
              <Box>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={`star-${item}`} sx={{ color: "#F2C94C" }} />
                ))}
              </Box>
            </Stack>

            {/* Property Title and Location */}
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <Box>
                <Typography
                  fontSize={22}
                  fontWeight={600}
                  mt="10px"
                  color="#11142D"
                >
                  {propertyDetails.title}
                </Typography>
                <Stack mt={0.5} direction="row" alignItems="center" gap={0.5}>
                  <Place sx={{ color: "#808191" }} />
                  <Typography fontSize={14} color="#808191">
                    {propertyDetails.location}
                  </Typography>
                </Stack>
              </Box>

              {/* Property Price */}
              <Box>
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  mt="10px"
                  color="#11142D"
                >
                  Price
                </Typography>
                <Stack direction="row" alignItems="flex-end" gap={1}>
                  <Typography fontSize={25} fontWeight={700} color="#475BE8">
                    ${propertyDetails.price}
                  </Typography>
                  <Typography fontSize={14} color="#808191" mb={0.5}>
                    for one day
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Property Description */}
            <Stack mt="25px" direction="column" gap="10px">
              <Typography fontSize={18} color="#11142D">
                Description
              </Typography>
              <Typography fontSize={14} color="#808191">
                {propertyDetails.description}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Sidebar with Agent Info, Contact, and Buttons */}
        <Box
          width="100%"
          flex={1}
          maxWidth={326}
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          {/* Agent Info */}
          <Stack
            width="100%"
            p={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
            border="1px solid #E4E4E4"
            borderRadius={2}
          >
            <Stack
              mt={2}
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <img
                src={
                  checkImage(propertyDetails.creator[0].avatar)
                    ? propertyDetails.creator[0].avatar
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                }
                alt="avatar"
                width={90}
                height={90}
                style={{
                  borderRadius: "100%",
                  objectFit: "cover",
                }}
              />

              <Box mt="15px">
                <Typography fontSize={18} fontWeight={600} color="#11142D">
                  {propertyDetails.creator.name}
                </Typography>
                <Typography
                  mt="5px"
                  fontSize={14}
                  fontWeight={400}
                  color="#808191"
                >
                  Agent
                </Typography>
              </Box>

              <Stack mt="15px" direction="row" alignItems="center" gap={1}>
                <Place sx={{ color: "#808191" }} />
                <Typography fontSize={14} fontWeight={400} color="#808191">
                  North Carolina, USA
                </Typography>
              </Stack>

              <Typography mt={1} fontSize={16} fontWeight={600} color="#11142D">
                {propertyDetails.creator[0].allProperties.length} Properties
              </Typography>
            </Stack>

            {/* Buttons: Message/Edit and Call/Delete */}
            <Stack
              width="100%"
              mt="25px"
              direction="row"
              flexWrap="wrap"
              gap={2}
            >
              <CustomButton
                title={!isCurrentUser ? "Message" : "Edit"}
                backgroundColor="#475BE8"
                color="#FCFCFC"
                fullWidth
                icon={!isCurrentUser ? <ChatBubble /> : <Edit />}
                handleClick={() => {
                  if (isCurrentUser) {
                    navigate(`/properties/edit/${propertyDetails._id}`);
                  }
                }}
              />
              <CustomButton
                title={!isCurrentUser ? "Call" : "Delete"}
                backgroundColor={!isCurrentUser ? "#2ED480" : "#d42e2e"}
                color="#FCFCFC"
                fullWidth
                icon={!isCurrentUser ? <Phone /> : <Delete />}
                handleClick={() => {
                  if (isCurrentUser) {
                    handleDeleteProperty();
                  }
                }}
              />
            </Stack>
          </Stack>

          {/* Google Maps Placeholder */}
          <Stack>
            <img
              src="https://serpmedia.org/scigen/images/googlemaps-nyc-standard.png?crc=3787557525"
              width="100%"
              height={306}
              style={{ borderRadius: 10, objectFit: "cover" }}
            />
          </Stack>

          {/* Book Now Button */}
          <Box>
            <CustomButton
              title="Book Now"
              backgroundColor="#475BE8"
              color="#FCFCFC"
              fullWidth
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyDetails;
