import React from "react";
import loginImg from "../assets/login.jpg";
import { Popover, Space } from "antd";
import { AuthAction } from "../actions/authAction";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAuthState } from "../recoil/atoms/user";
import { authState } from "../recoil/atoms/auth";
import { useNavigate } from "react-router-dom";

enum NavbarOptions {
  Profile = "Profile",
  Security = "Security",
  Logout = "Log out",
}

const SelectContent: React.FunctionComponent = () => {
  const setAuth = useSetRecoilState(authState);
  const user = useRecoilValue(userAuthState);
  const navigate = useNavigate();
  const options = [
    { value: "Profile" },
    { value: "Security" },
    { value: "Log out" },
  ];

  const handleSelected = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (e.currentTarget.textContent === NavbarOptions.Logout) {
      setAuth((prev) => {
        return {
          ...prev,
          ...AuthAction.logout(),
        };
      });
      window.location.href = "/";
    }

    if (e.currentTarget.textContent === NavbarOptions.Profile) {
      navigate("/admin/profile");
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between pr-4 pb-2">
        <div className="border-[1px] border-blue-400 rounded-full justify-center align-center w-8 h-8">
          <img
            className="object-cover object-center h-full w-full rounded-full"
            src={loginImg}
            alt="avatar"
          />
        </div>
        <div className="text-xs pr-4 justify-center">
          <div className="font-bold">{user.fullName}</div>
          <div>{user.email}</div>
        </div>
      </div>
      <ul>
        {options.map((option, key) => (
          <li
            onClick={handleSelected}
            key={key}
            className="flex px-4 py-2 items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            {option.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Navbar: React.FunctionComponent = () => {
  return (
    <div className="shadow-md w-full h-12 fixed bg-blue-800 top-0 left-0">
      <div className="flex flex-row md:flex-row items-center justify-between md:px-10 px-7m mx-2">
        <div
          className="font-bold text-2xl cursor-pointer flex font-[Poppins] 
        text-white mb-4 md:mb-0"
        >
          HR Management System
        </div>

        <div
          className="font-bold text-xl cursor-pointer flex items-center justify-center font-[Poppins] 
        text-gray-800 mt-2"
        >
          <Space wrap>
            <Popover
              placement="bottomRight"
              content={<SelectContent />}
              title={"Account"}
              trigger={"click"}
            >
              <button className="border-[1px] border-blue-400 rounded-full justify-center align-center w-8 h-8 ml-4">
                <img
                  className="object-cover object-center h-full w-full rounded-full"
                  src={loginImg}
                  alt="avatar"
                />
              </button>
            </Popover>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
