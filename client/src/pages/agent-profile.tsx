import { useOne } from "@refinedev/core";
import { useParams } from "react-router-dom";

import { Profile } from "../components";

function AgentProfile() {
  // Extract the `id` parameter from the URL
  const { id } = useParams();

  // Use the `useOne` hook to fetch details for a specific user (agent)
  const { data, isLoading, isError } = useOne({
    resource: "users",
    id: id as string, // The ID of the agent is obtained from the URL parameter
  });

  // Extract the agent's profile data from the fetched data
  const agentProfile = data?.data ?? {};

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error...</div>;

  return (
    // Indicate that this is an agent's profile
    <Profile
      type="Agent"
      name={agentProfile.name}
      email={agentProfile.email}
      avatar={agentProfile.avatar}
      properties={agentProfile.allProperties}
    />
  );
}

export default AgentProfile;
