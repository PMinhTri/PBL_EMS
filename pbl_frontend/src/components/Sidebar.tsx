import React from "react";
import { NavLink } from "react-router-dom";
import {
  BiGridAlt,
  BiTask,
  BiGroup,
  BiDollarCircle,
  BiBarChartAlt2,
  BiCalendar,
  BiCalendarAlt,
  BiMessageDetail,
} from "react-icons/bi";

const Sidebar: React.FunctionComponent = () => {
  const sideBarItems = [
    { name: "Dashboard", icon: <BiGridAlt />, path: "/admin/dashboard" },
    { name: "Employees", icon: <BiGroup />, path: "/admin/employees" },
    { name: "Time Sheet", icon: <BiTask />, path: "#" },
    { name: "Leave", icon: <BiCalendarAlt />, path: "#" },
    { name: "Payroll", icon: <BiDollarCircle />, path: "#" },
    { name: "Projects", icon: <BiBarChartAlt2 />, path: "#" },
    { name: "Calendar", icon: <BiCalendar />, path: "#" },
    { name: "Message", icon: <BiMessageDetail />, path: "#" },
  ];

  return (
    <div className="fixed w-64 h-screen pt-8 border-[2px]">
      <div className="flex flex-col justify-center items-center ">
        {sideBarItems.map((item, key) => (
          <div
            key={key}
            className="flex w-full h-12 my-1 text-gray-600 justify-start items-center
             hover:bg-gray-100 cursor-pointer"
          >
            <NavLink
              to={item.path}
              className="w-full ml-8 flex flex-row justify-between items-center"
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="w-3/4 flex justify-start items-center">
                {item.name}
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
