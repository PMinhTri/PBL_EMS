import React from "react";
import { Input, Select } from "antd";
import { Role } from "../../../../types/roleTypes";
import { RoleAction } from "../../../../actions/roleAction";
import { CreateNewUserInformation } from "../../../../types/userTypes";

export type Props = {
  onChange: (value: CreateNewUserInformation) => void;
};

const CreateNewEmployee: React.FunctionComponent<Props> = (props: Props) => {
  const { onChange } = props;
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [createNewUserInformation, setCreateNewUserInformation] =
    React.useState<CreateNewUserInformation>({
      email: "",
      fullName: "",
      gender: "",
      status: "",
      roleId: 1,
    });

  const titleFields = [
    {
      label: "fullName",
      value: "Họ và tên",
    },
    {
      label: "gender",
      value: "Giới tính",
    },
    {
      label: "email",
      value: "Email",
    },
    {
      label: "status",
      value: "Trạng thái",
    },
    {
      label: "roleId",
      value: "Vai trò",
    },
  ];

  const genderOptions = [
    {
      label: "Nam",
      value: "Nam",
    },
    {
      label: "Nữ",
      value: "Nữ",
    },
  ];

  const statusOptions = [
    {
      label: "Hoạt động",
      value: "Hoạt động",
    },
    {
      label: "Không hoạt động",
      value: "Không hoạt động",
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      const roles = await RoleAction.getAllRoles();
      setRoles(roles);
    };

    fetchData();
  }, []);

  const getOptions = (item: string) => {
    if (item === "Giới tính") {
      return genderOptions;
    }

    if (item === "Trạng thái") {
      return statusOptions;
    }

    if (item === "Vai trò") {
      return roles.map((role) => ({
        label: role.name,
        value: role.name,
      }));
    }
  };

  React.useEffect(() => {
    onChange(createNewUserInformation);
  }, [createNewUserInformation]);

  return (
    <div className="w-full h-full border-[2px] flex flex-col justify-center items-center p-4 bg-slate-200">
      {titleFields.map((item, index) => {
        if (
          item.value === "Giới tính" ||
          item.value === "Trạng thái" ||
          item.value === "Vai trò"
        ) {
          return (
            <div className="flex flex-row w-full p-2">
              <div
                key={index}
                className="w-[30%] flex flex-row justify-between items-center"
              >
                <div className="font-bold">{item.value}</div>
              </div>
              <Select
                className="w-full"
                options={getOptions(item.value)}
                allowClear
                onChange={(value) => {
                  if (item.value === "Vai trò") {
                    const roleId = roles.find(
                      (role) => role.name === value
                    )?.id;
                    setCreateNewUserInformation({
                      ...createNewUserInformation,
                      roleId: roleId || 1,
                    });
                  } else {
                    setCreateNewUserInformation({
                      ...createNewUserInformation,
                      [item.label]: value.trim(),
                    });
                  }
                }}
              />
            </div>
          );
        }

        return (
          <div className="flex flex-row w-full p-2">
            <div
              key={index}
              className="w-[30%] flex flex-row justify-between items-center"
            >
              <div className="font-bold">{item.value}</div>
            </div>
            <Input
              className="w-full"
              onChange={(e) => {
                setCreateNewUserInformation({
                  ...createNewUserInformation,
                  [item.label]: e.target.value.trim(),
                });
              }}
              allowClear
            />
          </div>
        );
      })}
    </div>
  );
};

export default CreateNewEmployee;
