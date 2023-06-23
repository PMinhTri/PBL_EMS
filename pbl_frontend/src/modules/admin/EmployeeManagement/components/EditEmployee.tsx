import React from "react";
import { UserDetailInformation } from "../../../../types/userTypes";
import {
  employeeStatusOptions,
  genderOptions,
} from "../../../../constants/constantVariables";
import { UserAction } from "../../../../actions/userAction";
import showNotification from "../../../../utils/notification";
import { EducationAction } from "../../../../actions/educationAction";
import { Education } from "../../../../types/eductionTypes";
import { DatePicker, Input, Select, Space } from "antd";
import dayjs from "dayjs";
import { JobInformationAction } from "../../../../actions/jobInformationAction";
import { JobInformation } from "../../../../types/jobInformationTypes";
import { JobTitle } from "../../../../types/jobTitleTypes";
import { Contract } from "../../../../types/contractTypes";
import { WorkingSkill } from "../../../../types/workingSkillTypes";
import { Department } from "../../../../types/departmentTypes";
import { JobTitleAction } from "../../../../actions/jobTitleAction";
import { ContractAction } from "../../../../actions/contractAction";
import { WorkingSkillAction } from "../../../../actions/workingSkillAction";
import { DepartmentAction } from "../../../../actions/departmentAction";
import _ from "lodash";

type Props = {
  userInfo: UserDetailInformation;
};

const EditEmployee: React.FunctionComponent<Props> = (props: Props) => {
  const { userInfo } = props;

  const [updateUserInfo, setUpdateUserInfo] =
    React.useState<UserDetailInformation>({} as UserDetailInformation);
  const [isPersonalDisabled, setIsPersonalDisabled] = React.useState(true);
  const [education, setEducation] = React.useState<Education[]>([]);

  const [updateJobInformation, setUpdateJobInformation] =
    React.useState<JobInformation>({} as JobInformation);
  const [isJobInformationDisabled, setIsJobInformationDisabled] =
    React.useState(true);
  const [isContractDisabled, setIsContractDisabled] = React.useState(true);
  const [jobTitles, setJobTitles] = React.useState<JobTitle[]>([]);
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const [workingSkills, setWorkingSkills] = React.useState<WorkingSkill[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);

  const [contract, setContract] = React.useState<{
    contractId?: string;
    contractStartDate?: Date;
    contractEndDate?: Date;
  }>({
    contractId: contracts[0]?.id,
    contractStartDate: new Date(),
    contractEndDate: new Date(),
  });

  React.useEffect(() => {
    setUpdateJobInformation(userInfo.jobInformation as JobInformation);
    setIsPersonalDisabled(true);
    setIsJobInformationDisabled(true);
    setIsContractDisabled(true);
  }, [userInfo]);

  const inputFields = [
    {
      label: "Họ tên",
      name: "fullName",
      value: userInfo.fullName,
    },
    {
      label: "Giới tính",
      name: "gender",
      value: userInfo.gender,
    },
    {
      label: "Ngày sinh",
      name: "dateOfBirth",
      value: userInfo.dateOfBirth,
    },
    {
      label: "Số điện thoại",
      name: "phoneNumber",
      value: userInfo.phoneNumber,
    },
    {
      label: "Địa chỉ",
      name: "address",
      value: userInfo.address,
    },
    {
      label: "Thành phố",
      name: "city",
      value: userInfo.city,
    },
    {
      label: "Quốc tịch",
      name: "nationality",
      value: userInfo.nationality,
    },
    {
      label: "CCCD/CMND",
      name: "citizenId",
      value: userInfo.citizenId,
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      setEducation(await EducationAction.getAllEducation());
    };

    fetchData();
  }, []);

  const handleSaveInfo = async () => {
    if (userInfo.fullName === "" || userInfo.citizenId === "") {
      showNotification("error", "Họ tên và CCCD/CMND không được để trống");
      return;
    }

    if (userInfo === updateUserInfo) {
      showNotification("info", "Không có gì thay đổi");

      setIsPersonalDisabled(true);
      return;
    }

    await UserAction.updateUserInfo(userInfo.id, updateUserInfo);
    showNotification("success", "Cập nhật thông tin thành công");
    setIsPersonalDisabled(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  React.useEffect(() => {
    const fetchedData = async () => {
      setJobTitles(await JobTitleAction.getAllJobTitles());
      setContracts(await ContractAction.getAllContracts());
      setWorkingSkills(await WorkingSkillAction.getAllWorkingSkills());
      setDepartments(await DepartmentAction.getAllDepartments());
    };
    fetchedData();
  }, [updateJobInformation]);

  const handleSaveJobInformation = async () => {
    if (
      !updateJobInformation.employeeStatus ||
      !updateJobInformation.jobTitleId ||
      !updateJobInformation.departmentId ||
      !updateJobInformation.joinDate
    ) {
      showNotification("error", "Vui lòng nhập đầy đủ thông tin công việc");
      return;
    }

    await JobInformationAction.update(
      userInfo.jobInformation?.id as string,
      updateJobInformation
    );
    showNotification("success", "Cập nhật thông tin công việc thành công");
    setIsJobInformationDisabled(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSaveContract = async () => {
    if (
      !contract.contractId ||
      !contract.contractStartDate ||
      !contract.contractEndDate
    ) {
      showNotification("error", "Vui lòng nhập đầy đủ thông tin hợp đồng");
      return;
    }

    await JobInformationAction.updateContract(
      userInfo.jobInformation?.id as string,
      {
        contractTypeId: contract.contractId,
        contractStartDate: contract.contractStartDate,
        contractEndDate: contract.contractEndDate,
      }
    );
    showNotification("success", "Cập nhật thông tin hợp đồng thành công");
    setIsContractDisabled(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div
      className="p-4 max-h-[480px] flex flex-col overflow-y-auto gap-4 scrollbar
    border rounded-md"
    >
      <div className="w-full flex flex-row justify-between items-center h-32 border-b-[2px] p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-4">
              <img
                src={userInfo.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full flex justify-start flex-col">
            <div className="text-2xl font-semibold text-gray-800 mb-1">
              {userInfo.fullName}
            </div>
            <div className="text-[16px] font-medium text-gray-600">
              {userInfo.email}
            </div>
            <div className="text-sm text-gray-500">{userInfo.role.name}</div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <div className="border-[2px] mx-2 rounded-md shadow-lg">
            <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
              Thông tin cá nhân
            </div>
            <div className="grid grid-cols-2">
              <div className="flex flex-row  items-center m-2">
                <div className="m-2 w-36 font-bold">Họ tên:</div>
                {isPersonalDisabled ? (
                  <div>{userInfo.fullName}</div>
                ) : (
                  <Input
                    disabled={isPersonalDisabled}
                    onChange={(e) =>
                      setUpdateUserInfo({
                        ...userInfo,
                        fullName: e.target.value,
                      })
                    }
                    defaultValue={userInfo.fullName}
                  />
                )}
              </div>
              <div></div>
              {inputFields.slice(1, inputFields.length).map((item, index) => {
                if (item.name === "gender") {
                  return (
                    <div
                      key={index}
                      className="flex flex-row  items-center m-2"
                    >
                      <div className="m-2 w-36 font-bold">{item.label}:</div>
                      {isPersonalDisabled ? (
                        <div>{item.value as string}</div>
                      ) : (
                        <Select
                          defaultValue={item.value}
                          className="w-full"
                          disabled={isPersonalDisabled}
                          onChange={(value) =>
                            setUpdateUserInfo({
                              ...userInfo,
                              [item.name]: value,
                            })
                          }
                          options={genderOptions}
                        />
                      )}
                    </div>
                  );
                }

                if (item.name === "dateOfBirth") {
                  return (
                    <div
                      key={index}
                      className="flex flex-row  items-center m-2"
                    >
                      <div className="m-2 w-36 font-bold">{item.label}:</div>
                      {isPersonalDisabled ? (
                        <div>
                          {item.value !== null
                            ? dayjs(item.value).format("DD/MM/YYYY")
                            : ""}
                        </div>
                      ) : (
                        <Space className="w-full">
                          <DatePicker
                            disabled={isPersonalDisabled}
                            defaultValue={
                              item.value !== null
                                ? dayjs(item.value)
                                : dayjs(new Date())
                            }
                            onChange={(date) =>
                              setUpdateUserInfo({
                                ...userInfo,
                                dateOfBirth: date
                                  ? date.toDate()
                                  : dayjs(new Date()).toDate(),
                              })
                            }
                          />
                        </Space>
                      )}
                    </div>
                  );
                }

                if (item.name === "nationality") {
                  return (
                    <div
                      key={index}
                      className="flex flex-row  items-center m-2"
                    >
                      <div className="m-2 w-36 font-bold">{item.label}:</div>
                      {isPersonalDisabled ? (
                        <div>{item.value as string}</div>
                      ) : (
                        <Select
                          defaultValue={item.value}
                          disabled={isPersonalDisabled}
                          className="w-full"
                          style={{
                            border: "1px",
                          }}
                          options={[{ label: "Việt Nam", value: "Việt Nam" }]}
                          onChange={(value) => {
                            setUpdateUserInfo({
                              ...userInfo,
                              [item.name]: value,
                            });
                          }}
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <div key={index} className="flex flex-row items-center m-2">
                    <div className="m-2 w-36 font-bold">{item.label}:</div>
                    {isPersonalDisabled ? (
                      <div>{item.value as string}</div>
                    ) : (
                      <Input
                        disabled={isPersonalDisabled}
                        defaultValue={
                          typeof item.value === "string" ? item.value : ""
                        }
                        onChange={(e) => {
                          setUpdateUserInfo({
                            ...userInfo,
                            [item.name]: e.target.value,
                          });
                        }}
                        allowClear
                      />
                    )}
                  </div>
                );
              })}
              <div className="flex flex-row  items-center m-2">
                <div className="m-2 w-36 font-bold">Học vấn:</div>
                {isPersonalDisabled ? (
                  <div>{userInfo.education?.grade}</div>
                ) : (
                  <Select
                    defaultValue={userInfo.education?.grade}
                    disabled={isPersonalDisabled}
                    className="w-full"
                    style={{
                      border: "1px",
                    }}
                    options={education.map((item) => {
                      return { label: item.grade, value: item.id };
                    })}
                    onChange={(value) => {
                      setUpdateUserInfo({
                        ...userInfo,
                        educationId: value,
                        education: education.find((item) => item.id === value),
                      });
                    }}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex flex-row justify-end">
              {!isPersonalDisabled ? (
                <>
                  <button
                    onClick={() => {
                      setIsPersonalDisabled(true);
                    }}
                    className="m-4 w-24 h-8 rounded-sm border-[1px] bg-red-600 text-white 
                    justify-end hover:text-red-600 hover:bg-white hover:border-red-600"
                  >
                    Huỷ
                  </button>
                  <button
                    onClick={async () => {
                      await handleSaveInfo();
                    }}
                    className="m-4 w-24 h-8 rounded-sm border-[1px] bg-green-600 text-white 
                    justify-end hover:text-green-600 hover:bg-white hover:border-green-600"
                  >
                    Lưu
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsPersonalDisabled(false)}
                  className="m-4 w-24 h-8 rounded-sm border-[1px] bg-blue-600 text-white 
                  justify-end hover:text-blue-600 hover:bg-white hover:border-blue-600"
                >
                  Cập nhật
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col">
            <div className="border-[2px] mx-2 rounded-md shadow-lg">
              <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
                Thông tin công việc
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Ngày vào:</div>
                  {isJobInformationDisabled ? (
                    <div>
                      {dayjs(userInfo.jobInformation?.joinDate).format(
                        "YYYY-DD-MM"
                      )}
                    </div>
                  ) : (
                    <DatePicker
                      className="w-full"
                      defaultValue={dayjs(userInfo.jobInformation?.joinDate)}
                      onChange={(date) => {
                        setUpdateJobInformation({
                          ...(userInfo.jobInformation as JobInformation),
                          joinDate: date
                            ? date.toDate()
                            : dayjs(new Date()).toDate(),
                        });
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Trạng thái:</div>
                  {isJobInformationDisabled ? (
                    <div>{userInfo.jobInformation?.employeeStatus}</div>
                  ) : (
                    <Select
                      className="w-full"
                      defaultValue={userInfo.jobInformation?.employeeStatus}
                      options={employeeStatusOptions}
                      onChange={(value) => {
                        setUpdateJobInformation({
                          ...(userInfo.jobInformation as JobInformation),
                          employeeStatus: value,
                        });
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Chức vụ:</div>
                  {isJobInformationDisabled ? (
                    <div>{userInfo.jobInformation?.jobTitle?.name}</div>
                  ) : (
                    <Select
                      className="w-full"
                      defaultValue={userInfo.jobInformation?.jobTitle?.name}
                      options={jobTitles.map((jobTitle) => {
                        return {
                          label: jobTitle.name,
                          value: jobTitle.id,
                        };
                      })}
                      onChange={(value) => {
                        setUpdateJobInformation({
                          ...(userInfo.jobInformation as JobInformation),
                          jobTitleId: value,
                          jobTitle: jobTitles.find((jobTitle) => {
                            return jobTitle.id === value;
                          }),
                        });
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Chi nhánh:</div>
                  {isJobInformationDisabled ? (
                    <div>{userInfo.jobInformation?.department?.name}</div>
                  ) : (
                    <Select
                      className="w-full"
                      defaultValue={userInfo.jobInformation?.department?.name}
                      options={departments.map((department) => {
                        return {
                          label: department.name,
                          value: department.id,
                        };
                      })}
                      onChange={(value) => {
                        setUpdateJobInformation({
                          ...(userInfo.jobInformation as JobInformation),
                          departmentId: value,
                          department: departments.find(
                            (department) => department.id === value
                          ),
                        });
                      }}
                      allowClear
                    />
                  )}
                </div>
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Kỹ năng:</div>
                  {isJobInformationDisabled ? (
                    <div>
                      {userInfo.jobInformation?.workingSkill?.map(
                        (workingSkill) => {
                          return `${workingSkill.name}; `;
                        }
                      )}
                    </div>
                  ) : (
                    <Select
                      mode="multiple"
                      defaultValue={userInfo.jobInformation?.workingSkill?.map(
                        (workingSkill) => {
                          return workingSkill.name;
                        }
                      )}
                      className="w-full max-h-12"
                      maxTagCount={1}
                      aria-selected={false}
                      onSearch={(value) => {
                        workingSkills.filter((workingSkill) =>
                          workingSkill.name
                            .toLowerCase()
                            .includes(value.toLowerCase())
                        );
                      }}
                      options={workingSkills.map((workingSkill) => {
                        return {
                          label: workingSkill.name,
                          value: workingSkill.id,
                        };
                      })}
                      onChange={(value) => {
                        if (value.length) {
                          setUpdateJobInformation({
                            ...(userInfo.jobInformation as JobInformation),
                            workingSkill: _.uniqBy(
                              updateJobInformation.workingSkill?.concat(
                                workingSkills.filter((workingSkill) =>
                                  value.includes(workingSkill.id)
                                )
                              ),
                              "id"
                            ),
                          });
                        } else {
                          setUpdateJobInformation({
                            ...updateJobInformation,
                            workingSkill: [],
                          });
                        }
                      }}
                      allowClear
                    />
                  )}
                </div>
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Ghi chú:</div>
                  {isJobInformationDisabled ? (
                    <div>{userInfo.jobInformation?.other}</div>
                  ) : (
                    <Input
                      allowClear
                      onChange={(e) =>
                        setUpdateJobInformation({
                          ...(userInfo.jobInformation as JobInformation),
                          other: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="w-full flex flex-row justify-end">
                {!isJobInformationDisabled ? (
                  <>
                    <button
                      onClick={() => {
                        setIsJobInformationDisabled(true);
                      }}
                      className="m-4 w-24 h-8 rounded-sm border-[1px] bg-red-600 text-white 
                justify-end hover:text-red-600 hover:bg-white hover:border-red-600"
                    >
                      Huỷ
                    </button>
                    <button
                      onClick={async () => {
                        await handleSaveJobInformation();
                      }}
                      className="m-4 w-24 h-8 rounded-sm border-[1px] bg-green-600 text-white 
                justify-end hover:text-green-600 hover:bg-white hover:border-green-600"
                    >
                      Lưu
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsJobInformationDisabled(false);
                    }}
                    className="m-4 w-24 h-8 rounded-sm border-[1px] bg-blue-600 text-white 
                  justify-end hover:text-blue-600 hover:bg-white hover:border-blue-600"
                  >
                    Cập nhật
                  </button>
                )}
              </div>
            </div>
            <div className="border-[2px] mt-4 mx-2 rounded-md shadow-lg">
              <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
                Thông tin hợp đồng
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Loại hợp đồng:</div>
                  {isContractDisabled ? (
                    <div>{updateJobInformation.contractType?.type}</div>
                  ) : (
                    <Select
                      className="w-full"
                      defaultValue={updateJobInformation.contractType?.type}
                      options={contracts.map((contract) => {
                        return {
                          label: contract.type,
                          value: contract.id,
                        };
                      })}
                      onChange={(value) => {
                        setUpdateJobInformation({
                          ...updateJobInformation,
                          contractId: value,
                          contractType: contracts.find(
                            (contract) => contract.id === value
                          ),
                        });
                        setContract({
                          ...contract,
                          contractId: value,
                        });
                      }}
                      allowClear
                    />
                  )}
                </div>
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Ngày ký:</div>
                  {isContractDisabled ? (
                    <div>
                      {updateJobInformation.contractStartDate
                        ? dayjs(updateJobInformation.contractStartDate).format(
                            "YYYY-MM-DD"
                          )
                        : ""}
                    </div>
                  ) : (
                    <DatePicker
                      className="w-full"
                      defaultValue={
                        updateJobInformation.contractStartDate
                          ? dayjs(updateJobInformation.contractStartDate)
                          : dayjs(new Date())
                      }
                      onChange={(date) => {
                        setUpdateJobInformation({
                          ...updateJobInformation,
                          contractStartDate: date
                            ? date.toDate()
                            : dayjs(new Date()).toDate(),
                        });
                        setContract({
                          ...contract,
                          contractStartDate: date?.toDate(),
                        });
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-row items-center m-2">
                  <div className="m-2 w-36 font-bold">Ngày kết thúc:</div>
                  {isContractDisabled ? (
                    <div>
                      {updateJobInformation.contractEndDate
                        ? dayjs(updateJobInformation.contractEndDate).format(
                            "YYYY-MM-DD"
                          )
                        : ""}
                    </div>
                  ) : (
                    <DatePicker
                      className="w-full"
                      defaultValue={
                        updateJobInformation.contractEndDate
                          ? dayjs(updateJobInformation.contractEndDate)
                          : dayjs(new Date())
                      }
                      onChange={(date) => {
                        setUpdateJobInformation({
                          ...updateJobInformation,
                          contractEndDate: date
                            ? date.toDate()
                            : dayjs(new Date()).toDate(),
                        });
                        setContract({
                          ...contract,
                          contractEndDate: date?.toDate(),
                        });
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="w-full flex flex-row justify-end">
                {!isContractDisabled ? (
                  <>
                    <button
                      onClick={() => {
                        setIsContractDisabled(true);
                      }}
                      className="m-4 w-24 h-8 rounded-sm border-[1px] bg-red-600 text-white 
                justify-end hover:text-red-600 hover:bg-white hover:border-red-600"
                    >
                      Huỷ
                    </button>
                    <button
                      onClick={async () => {
                        await handleSaveContract();
                      }}
                      className="m-4 w-24 h-8 rounded-sm border-[1px] bg-green-600 text-white 
                justify-end hover:text-green-600 hover:bg-white hover:border-green-600"
                    >
                      Lưu
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsContractDisabled(false);
                    }}
                    className="m-4 w-24 h-8 rounded-sm border-[1px] bg-blue-600 text-white 
                  justify-end hover:text-blue-600 hover:bg-white hover:border-blue-600"
                  >
                    Cập nhật
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
