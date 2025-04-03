import React from "react";
import Sidebar from "../Partials/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="w-1/7 bg-gray-800 text-white h-full fixed">
        <Sidebar />
      </div>
      <div className="w-6/7 ml-[14.28%] p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
