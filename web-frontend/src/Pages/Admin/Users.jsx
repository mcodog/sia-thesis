import React, { useState, useEffect } from "react";
import axiosInstance from "../../Utils/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("card"); // "card" or "table"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("api/users-with-profiles/");
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fallback UI for empty state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-red-600 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-gray-600 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">No Users Found</h2>
          <p>There are no users available at the moment.</p>
        </div>
      </div>
    );
  }

  // Helper function to get initials from username or name
  const getInitials = (user) => {
    if (user.username) return user.username.charAt(0).toUpperCase();
    if (user.first_name) return user.first_name.charAt(0).toUpperCase();
    return "U";
  };

  // Helper function to get full name
  const getFullName = (user) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return "Not provided";
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

        <div className="mt-3 sm:mt-0 bg-white rounded-lg shadow-sm p-1 inline-flex">
          <button
            onClick={() => setViewMode("card")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              viewMode === "card"
                ? "bg-blue-50 text-[#0cdfc6]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              viewMode === "table"
                ? "bg-blue-50 text-[#0cdfc6]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user?.id || Math.random().toString()}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500 text-xl">
                      {getInitials(user)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {user?.username || "Unknown User"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {user?.email || "No email provided"}
                    </p>
                  </div>
                  {user?.isAdmin && (
                    <span className="ml-auto bg-blue-100 text-[#0cdfc6] text-xs font-semibold px-2.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Full Name:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {getFullName(user)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Gender:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {user?.gender || "Not specified"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Age:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {user?.age || "Not specified"}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Location:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {user?.location || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                <div>
                  {user?.is_phone_verified ? (
                    <span className="inline-flex items-center text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs text-gray-800 bg-gray-200 px-2 py-0.5 rounded">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                      Unverified
                    </span>
                  )}
                </div>
                <button className="text-sm text-[#0cdfc6] hover:text-[#0cdfc6] font-medium transition-colors duration-200">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Full Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gender / Age
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user?.id || Math.random().toString()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <span className="text-gray-500 text-sm">
                          {getInitials(user)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user?.username || "Unknown User"}
                        </div>
                        {user?.isAdmin && (
                          <span className="bg-blue-100 text-[#0cdfc6] text-xs font-semibold px-2 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.email || "No email provided"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getFullName(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.gender ? `${user.gender}` : "Not specified"}
                    {user?.age ? ` / ${user.age}` : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.location || "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user?.is_phone_verified ? (
                      <span className="inline-flex items-center text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-gray-800 bg-gray-200 px-2 py-0.5 rounded">
                        <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#0cdfc6] hover:text-blue-900">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
