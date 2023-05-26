import React from "react";
import { UserDetailInformation } from "../../../../types/userTypes";

export type GridViewModeProps = {
  data: UserDetailInformation;
};

const GridViewMode: React.FunctionComponent<GridViewModeProps> = ({ data }) => {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex items-center mb-4">
        {/* <img
          src={data.avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full mr-4"
        /> */}
        <div className="w-16 h-16 rounded-full mr-4 bg-gray-300"></div>
        <div>
          <div className="text-lg font-medium">{data.fullName}</div>
          <div className="text-sm font-small">Front-end Developer</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div>
          <div className="text-sm text-gray-500 mb-1">Giới tính</div>
          <div>{data.gender}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Email</div>
          <div>{data.email}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Trạng thái</div>
          <div>{data.status}</div>
        </div>
      </div>
    </div>
  );
};

export default GridViewMode;
