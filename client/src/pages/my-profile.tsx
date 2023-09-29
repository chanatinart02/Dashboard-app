import { useGetIdentity, useOne } from "@refinedev/core";
import { Profile } from "../components";

const MyProfile = () => {
  // fetch current user info
  const { data: user } = useGetIdentity<{
    userId: string;
  }>();
  const userData = user?.userId; // Extract the user ID from the fetched data

  // Fetch details for the current user based on their ID
  const { data, isLoading, isError } = useOne({
    resource: "users", // users endpoint in BE
    id: userData, // The ID of the current user
  });

  // Extract the user's profile data from the fetched data
  const myProfile = data?.data ?? {};

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <Profile
      type="My"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  );
};

export default MyProfile;
