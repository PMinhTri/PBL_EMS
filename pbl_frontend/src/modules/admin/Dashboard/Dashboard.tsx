import React from "react";
import { UserDetailInformation } from "../../../types/userTypes";
import { UserAction } from "../../../actions/userAction";
import { FiUsers } from "react-icons/fi";
import { BsCalendar2Event, BsCalendarX } from "react-icons/bs";

const Dashboard: React.FunctionComponent = () => {
  const [listEmployee, setListEmployee] = React.useState<
    UserDetailInformation[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setListEmployee(await UserAction.getAllEmployees());
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-auto p-4 bg-gray-200">
      <div className="w-full h-screen bg-white overflow-auto scrollbar rounded-md">
        <div className="relative pt-8 pb-8 bg-blueGray-500">
          <div className="px-4 md:px-6 mx-auto w-full">
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words bg-white border rounded-lg mb-6 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                      <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                          <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                            Tổng nhân viên
                          </h5>
                          <span className="font-bold text-xl">
                            {listEmployee.length}
                          </span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial mb-8">
                          <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-blue-500">
                            <span className="text-xl">
                              <FiUsers />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words bg-white border rounded-lg mb-6 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                      <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                          <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                            Nghỉ phép
                          </h5>
                          <span className="font-bold text-xl"></span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial mb-8">
                          <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-orange-500">
                            <span className="text-xl">
                              <BsCalendar2Event />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words bg-white border rounded-lg mb-6 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                      <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                          <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                            Vắng hôm nay
                          </h5>
                          <span className="font-bold text-xl">924</span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial mb-8">
                          <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500">
                            <span className="text-xl">
                              <BsCalendarX />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words bg-white border rounded-lg mb-6 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                      <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                          <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                            Tổng lương tháng này
                          </h5>
                          <span className="font-bold text-xl">49,65%</span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial mb-8">
                          <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-lightBlue-500">
                            <i className="fas fa-percent"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2 p-4">
          <div className="w-full h-[480px] border rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
