import React from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Button, Select, Space } from "antd";

const EmployeeSort: React.FunctionComponent = () => {
  const options = [
    { label: "Id", value: "Id" },
    { label: "Họ và tên", value: "fullName" },
    { label: "Email", value: "Email" },
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

export default EmployeeSort;
