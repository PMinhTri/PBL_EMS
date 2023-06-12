import React from "react";
import { Select, Space } from "antd";

type Props = {
  onSelect: (value: string) => void;
};

const EmployeeSort: React.FunctionComponent<Props> = (props: Props) => {
  const { onSelect } = props;
  const options = [
    { label: "Họ và tên", value: "fullName" },
    { label: "Email", value: "Email" },
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <Space direction="vertical" className="w-[100%] mr-1">
        <Select
          style={{ width: 200 }}
          placeholder="select one country"
          allowClear
          optionLabelProp="label"
          options={options}
          onChange={(value) => onSelect(value)}
        />
      </Space>
    </div>
  );
};

export default EmployeeSort;
