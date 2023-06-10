import React from "react";
import { UserDetailInformation } from "../../../../types/userTypes";

type Props = {
  userInfo: UserDetailInformation;
};

const EditEmployee: React.FunctionComponent<Props> = (props: Props) => {
  const { userInfo } = props;

  return (
    <div className="p-4 max-h-56 flex flex-col overflow-y-auto gap-4">
      <div className="w-full flex flex-row justify-between items-center h-32 border-b-[2px] p-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex-shrink-0 mr-4"></div>
          <div className="w-full flex justify-start flex-col">
            <div className="text-2xl font-semibold text-gray-800 mb-1">
              {userInfo.fullName}
            </div>
            <div className="text-[16px] font-medium text-gray-600">
              {userInfo.email}
            </div>
            <div className="text-sm text-gray-500">{userInfo.role.name}</div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full px-2 py-2 border rounded-t-md bg-blue-600">
          <span className="font-bold text-lg text-white">
            Thông tin cá nhân
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
