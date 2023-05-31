import { Button, Select, Space } from "antd";

const EmployeeFilter: React.FunctionComponent = () => {
  const listFilter = [
    {
      label: "gender",
      value: "giới tính",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Nam",
          value: "Nam",
        },
        {
          label: "Nữ",
          value: "Nữ",
        },
      ],
    },
    {
      label: "jobTitle",
      name: "Chức vụ",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Kỹ sư",
          value: "Kỹ sư",
        },
        {
          label: "Văn phòng",
          value: "Văn phòng",
        },
      ],
    },
    {
      label: "department",
      name: "Chi nhánh",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Sioux Ha Noi",
          value: "Sioux Ha Noi",
        },
        {
          label: "Sioux Da Nang",
          value: "Sioux Da Nang",
        },
      ],
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row">
        {listFilter.map((item, index) => (
          <Space key={index} direction="vertical" className="w-[100%] mr-1">
            <Select
              defaultValue={item.options[0].value}
              style={{ width: 140 }}
              placeholder={item.name}
              optionLabelProp="label"
              allowClear
              options={item.options}
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
