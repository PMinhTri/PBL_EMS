import { Button, Select, Space } from "antd";

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

export default EmployeeFilter;
