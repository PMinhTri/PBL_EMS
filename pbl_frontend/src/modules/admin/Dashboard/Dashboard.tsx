import React from "react";

const Dashboard: React.FunctionComponent = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-auto p-4">
      <div className="w-full p-2 border rounded-md">
        <span className="font-bold text-lg">Tổng quan</span>
      </div>
      <div className="w-full flex flex-row grid-cols-4 gap-2 mt-4">
        <div className="w-1/4 h-36 border rounded-md"></div>
        <div className="w-1/4 h-36 border rounded-md"></div>
        <div className="w-1/4 h-36 border rounded-md"></div>
        <div className="w-1/4 h-36 border rounded-md"></div>
      </div>
    </div>
  );
};

export default Dashboard;
