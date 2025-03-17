import { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>
        <strong>ID:</strong> {profile.id}
      </p>
      <p>
        <strong>Username:</strong> {profile.username}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>First Name:</strong> {profile.first_name}
      </p>
      <p>
        <strong>Last Name:</strong> {profile.last_name}
      </p>
      <p>
        <strong>Admin:</strong> {profile.isAdmin ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default Profile;
