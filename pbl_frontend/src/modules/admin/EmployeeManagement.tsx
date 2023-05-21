import React from "react";
import { Button, Input, Popover, Select, Space } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { UserAction } from "../../actions/userAction";
import { UserDetailInformation } from "../../types/userTypes";

const EmployeeSort: React.FunctionComponent = () => {
  const options = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];
  return (
    <div className="flex flex-col justify-center items-center">
      <Space direction="vertical" className="w-[100%] mr-1">
        <Select
          mode="multiple"
          style={{ width: 400 }}
          placeholder="select one country"
          allowClear
          optionLabelProp="label"
          options={options}
        />
      </Space>
      <Space className="flex flex-row mr-1">
        <Button
          type="primary"
          size="middle"
          className="bg-blue-600 mt-2"
          icon={<ArrowUpOutlined />}
        >
          Asc
        </Button>
        <Button
          type="primary"
          size="middle"
          className="bg-blue-600 mt-2"
          icon={<ArrowDownOutlined />}
        >
          Dsc
        </Button>
      </Space>
    </div>
  );
};

const EmployeeFilter: React.FunctionComponent = () => {
  const temp = [1, 2, 3];
  const options = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row">
        {temp.map((item, index) => (
          <Space key={index} direction="vertical" className="w-[100%] mr-1">
            <Select
              style={{ width: 140 }}
              placeholder="Select a person"
              optionLabelProp="label"
              allowClear
              options={options}
            />
          </Space>
        ))}
      </div>
      <Space className="mt-2 self-end">
        <Button type="primary" size="middle" className="bg-blue-600">
          Apply
        </Button>
      </Space>
    </div>
  );
};

const EmployeeManagement: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [employeeList, setEmployeeList] = React.useState<
    UserDetailInformation[]
  >([]);
  const [viewMode, setViewMode] = React.useState("list");

  const handleChangeViewMode = (mode: string) => {
    setViewMode(mode);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const employees = await UserAction.getAllEmployees();
      setEmployeeList(employees);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex w-full h-16 justify-center items-center border-b-[2px]">
        <div className="w-[99%] flex flex-row justify-between">
          <div className="flex flex-row">
            <Space direction="vertical" className="w-[100%] mr-1 flex flex-row">
              <Popover
                placement="bottomRight"
                content={<EmployeeFilter />}
                title={"Filter"}
                trigger={"click"}
              >
                <Button size="middle" icon={<FilterOutlined />}>
                  Filter
                </Button>
              </Popover>
              <Popover
                placement="right"
                content={<EmployeeSort />}
                title={"Sort"}
                trigger={"click"}
              >
                <Button size="middle" icon={<SortAscendingOutlined />}>
                  Sort
                </Button>
              </Popover>
              <Space className="w-[100%]">
                <Select
                  size="middle"
                  defaultValue={"list"}
                  style={{ width: 80 }}
                  optionLabelProp="view mode"
                  allowClear
                  onSelect={handleChangeViewMode}
                  options={[
                    { label: "List", value: "list" },
                    { label: "Grid", value: "grid" },
                  ]}
                />
              </Space>
            </Space>
          </div>
          <div>
            <Space.Compact style={{ width: "100%" }}>
              <Input defaultValue="" />
              <Button
                className="bg-blue-600 text-white"
                type="primary"
                icon={<SearchOutlined />}
                size="middle"
                loading
              >
                Search
              </Button>
            </Space.Compact>
          </div>
        </div>
      </div>
      <div className="w-full h-12 px-1 py-1 border-b flex flex-row justify-around">
        <div className="flex justify-between items-center w-full">
          <span className="ml-4">
            Total Employee: <span>{employeeList.length}</span>
          </span>
          <div>
            <button className="w-16 h-8 bg-blue-600 text-white border-[1px] rounded-md hover:bg-white hover:text-blue-600 hover:border-blue-600">
              Add
            </button>
            <button className="w-16 h-8 bg-red-600 text-white border-[1px] rounded-md hover:bg-white hover:text-red-600 hover:border-red-600">
              Delete
            </button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div>...Loading</div>
      ) : (
        <div className="w-full px-2 py-2 h-screen overflow-auto">
          {viewMode === "grid" && (
            <div className="grid grid-cols-4 gap-4">
              {employeeList.map((item, index) => (
                <div
                  key={index}
                  className="border-[2px] justify-center items-center h-48 rounded-lg"
                >
                  {item.fullName}
                </div>
              ))}
            </div>
          )}
          {viewMode === "list" && (
            <table className="w-full" border={2}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Job Title</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {employeeList.map((item, index) => (
                  <tr key={index} className="border-[2px] h-12">
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">{item.fullName}</td>
                    <td className="text-center"></td>
                    <td className="text-center">{item.email}</td>
                    <td className="text-center">{item.phoneNumber}</td>
                    <td className="text-center">{item.address}</td>
                    <td className="text-center"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
