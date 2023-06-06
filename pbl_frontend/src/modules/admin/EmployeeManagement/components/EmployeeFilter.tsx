import React from "react";
import { Button, Select, Space } from "antd";
import { JobTitle } from "../../../../types/jobTitleTypes";
import { Department } from "../../../../types/departmentTypes";
import { JobTitleAction } from "../../../../actions/jobTitleAction";
import { DepartmentAction } from "../../../../actions/departmentAction";

const EmployeeFilter: React.FunctionComponent = () => {
  const [jobTitle, setJobTitle] = React.useState<JobTitle[]>([]);
  const [department, setDepartment] = React.useState<Department[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = React.useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: "All",
      value: "all",
    },
  ]);

  const [departmentOptions, setDepartmentOptions] = React.useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: "All",
      value: "all",
    },
  ]);

  React.useEffect(() => {
    const fetchDate = async () => {
      const jobTitle = await JobTitleAction.getAllJobTitles();
      const department = await DepartmentAction.getAllDepartments();

      setJobTitle(jobTitle);
      setDepartment(department);

      setJobTitleOptions([
        ...jobTitle.map((item) => ({
          label: item.name,
          value: item.name,
        })),
      ]);

      setDepartmentOptions([
        ...department.map((item) => ({
          label: item.name,
          value: item.name,
        })),
      ]);
    };

    fetchDate();
  });

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
      options: jobTitleOptions,
    },
    {
      label: "department",
      name: "Chi nhánh",
      options: departmentOptions,
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
