import React from "react";
import { NavLink, useLocation } from "react-router-dom";

type SideBarItems = {
  name: string;
  icon: JSX.Element;
  path: string;
};

export type Props = {
  sideBarItems: SideBarItems[];
};

const Sidebar: React.FunctionComponent<Props> = (props: Props) => {
  const { sideBarItems } = props;
  const location = useLocation();

  return (
    <div className="fixed w-64 h-screen pt-8 border-[2px]">
      <div className="flex flex-col justify-center items-center">
        {sideBarItems.map((item, key) => (
          <div
            key={key}
            className={`flex w-full h-12 my-1 justify-start items-center
             cursor-pointer ${
               location.pathname === item.path
                 ? "bg-blue-600 text-white rounded-md"
                 : "hover:bg-gray-100 text-gray-600"
             }`}
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
