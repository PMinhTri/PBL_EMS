import React from "react";
import { Button, Select, Space } from "antd";
import { JobTitleAction } from "../../../../actions/jobTitleAction";
import { DepartmentAction } from "../../../../actions/departmentAction";

type Props = {
  onApply: (payload: {
    gender: string;
    jobTitle: string;
    department: string;
  }) => void;
};

const EmployeeFilter: React.FunctionComponent<Props> = (props: Props) => {
  const { onApply } = props;
  const [gender, setGender] = React.useState<string>("All");
  const [jobTitle, setJobTitle] = React.useState<string>("All");
  const [department, setDepartment] = React.useState<string>("All");
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
      const jobTitles = await JobTitleAction.getAllJobTitles();
      const departments = await DepartmentAction.getAllDepartments();

      setJobTitleOptions([
        ...jobTitles.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);

      setDepartmentOptions([
        ...departments.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    };

    fetchDate();
  }, []);

  const listFilter = [
    {
      label: "gender",
      value: "giới tính",
      options: [
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

  const handleClickApply = () => {
    onApply({
      gender: gender,
      jobTitle: jobTitle,
      department: department,
    });
  };

  const defaultValue = (value: string) => {
    if (value === "gender") {
      return "Giới tính";
    }

    if (value === "jobTitle") {
      return "Chức vụ";
    }

    if (value === "department") {
      return "Chi nhánh";
    }

    return "All";
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row">
        {listFilter.map((item, index) => (
          <Space key={index} direction="vertical" className="w-[100%] mr-1">
            <Select
              defaultValue={defaultValue(item.label)}
              style={{ width: 140 }}
              placeholder={item.name}
              optionLabelProp="label"
              allowClear
              options={item.options}
              onChange={(value) => {
                if (item.label === "gender") {
                  if (value) {
                    setGender(value);
                  } else {
                    setGender("All");
                  }
                }
                if (item.label === "jobTitle") {
                  if (value) {
                    setJobTitle(value);
                  } else {
                    setJobTitle("All");
                  }
                }
                if (item.label === "department") {
                  if (value) {
                    setDepartment(value);
                  } else {
                    setDepartment("All");
                  }
                }
              }}
            />
          </Space>
        ))}
      </div>
      <Space className="mt-2 self-end">
        <Button
          onClick={handleClickApply}
          type="primary"
          size="middle"
          className="bg-blue-600"
        >
          Apply
        </Button>
      </Space>
    </div>
  );
};

export default EmployeeFilter;
