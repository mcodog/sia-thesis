import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineSpaceDashboard, MdLogout, MdAnalytics } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GoGear } from "react-icons/go";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const Sidebar = () => {
  const [isAnalyticsOpen, setAnalyticsOpen] = useState(false);

  const menuItems = [
    { icon: <MdOutlineSpaceDashboard />, label: "Dashboard", path: "/admin" },
    { icon: <FiUsers />, label: "Users", path: "/admin/users" },
    {
      icon: <FiUsers />,
      label: "Wellness Dashboard",
      path: "/admin/wellness-dashboard",
    },
    {
      icon: <MdAnalytics />,
      label: "Analytics",
      isCollapsible: true,
      subItems: [
        { label: "General", path: "/admin/analytics/general" },
        { label: "User-Centered", path: "/admin/analytics/users" },
        {
          label: "Questions-Centered",
          path: "/admin/analytics/questions",
        },
      ],
    },
    // { icon: <GoGear />, label: "Settings", path: "/admin/settings" },
    { icon: <MdLogout />, label: "Go Back", path: "/" },
  ];

  return (
    <div className="p-2">
      <div className="w-full flex justify-center items-center h-20">
        <div>
          <p className="text-2xl font-bold">Pathfinder</p>
          <p className="text-gray-300 text-xs -my-1">ADMIN</p>
        </div>
      </div>
      <ul className="flex flex-col gap-2 mt-4">
        {menuItems.map(
          ({ icon, label, isCollapsible, subItems, path }, index) => (
            <React.Fragment key={index}>
              {isCollapsible ? (
                <li
                  className="text-gray-300 hover:bg-gray-700 p-2 rounded-md cursor-pointer flex justify-between items-center"
                  onClick={() => setAnalyticsOpen(!isAnalyticsOpen)}
                >
                  <div className="flex gap-2 items-center">
                    {icon}
                    {label}
                  </div>
                  {isAnalyticsOpen ? <IoChevronUp /> : <IoChevronDown />}
                </li>
              ) : (
                <NavLink
                  to={path}
                  end
                  className={({ isActive }) =>
                    `p-2 rounded-md cursor-pointer flex gap-2 items-center ${
                      isActive
                        ? "bg-gray-300 text-gray-800"
                        : "text-gray-300 hover:bg-gray-700"
                    }`
                  }
                >
                  {icon}
                  {label}
                </NavLink>
              )}
              {isCollapsible && isAnalyticsOpen && (
                <ul className="pl-6 flex flex-col gap-2">
                  {subItems.map(({ label, path }, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={path}
                      className={({ isActive }) =>
                        `p-2 rounded-md cursor-pointer ${
                          isActive
                            ? "bg-gray-300 text-gray-800"
                            : "text-gray-300 hover:bg-gray-700"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </ul>
              )}
            </React.Fragment>
          )
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
