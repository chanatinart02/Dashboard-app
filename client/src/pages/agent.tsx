import { useList } from "@refinedev/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AgentCard } from "../components";

function Agent() {
  // Fetching the list of agents from users route in BE
  const { data, isLoading, isError } = useList({ resource: "users" });

  // Extracting the list of agents from the data
  const allAgents = data?.data ?? [];

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <Box>
      {/* Heading */}
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Agents List
      </Typography>

      <Box
        mt="20px"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          backgroundColor: "#fcfcfc",
        }}
      >
        {/* Rendering each agent card */}
        {allAgents.map((agent) => (
          <AgentCard
            key={agent._id}
            id={agent._id}
            name={agent.name}
            email={agent.email}
            avatar={agent.avatar}
            noOfProperties={agent.allProperties.length}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Agent;
