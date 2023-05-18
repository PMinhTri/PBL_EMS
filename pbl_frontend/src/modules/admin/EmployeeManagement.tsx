import React from "react";
import { Button, Input, Popover, Select, Space } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";

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
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
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
                  defaultValue={"grid"}
                  style={{ width: 80 }}
                  optionLabelProp="view mode"
                  allowClear
                  options={[
                    { label: "Grid", value: "grid" },
                    { label: "List", value: "list" },
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
        <div className="border-l border-r flex justify-center items-center border-red-900 w-full">
          <span>45</span>
        </div>
        <div className="w-full">152</div>
        <div className="w-full">67</div>
        <div className="w-full">67</div>
      </div>
      <div className="w-full px-2 py-2 h-screen overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {arr.map((item, index) => (
            <div
              key={index}
              className="border-[2px] justify-center items-center h-48 rounded-lg"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
