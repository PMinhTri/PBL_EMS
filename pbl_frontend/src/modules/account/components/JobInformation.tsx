import { DatePicker, Input, Select } from "antd";
import React from "react";
import { employeeStatusOptions } from "../../../constants/constantVariables";
import { JobTitle } from "../../../types/jobTitleTypes";
import { JobTitleAction } from "../../../actions/jobTitleAction";
import { Contract } from "../../../types/contractTypes";
import { ContractAction } from "../../../actions/contractAction";
import { WorkingSkill } from "../../../types/workingSkillTypes";
import { Department } from "../../../types/departmentTypes";
import { WorkingSkillAction } from "../../../actions/workingSkillAction";
import { DepartmentAction } from "../../../actions/departmentAction";
import dayjs from "dayjs";
import { JobInformationAction } from "../../../actions/jobInformationAction";
import showNotification from "../../../utils/notification";
import _ from "lodash";
import { JobInformation } from "../../../types/jobInformationTypes";

type Props = {
  jobInformation: JobInformation;
};

const JobInformationContainer: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { jobInformation } = props;

  const [updateJobInformation, setUpdateJobInformation] =
    React.useState<JobInformation>(jobInformation);
  const [isDisabled, setIsDisabled] = React.useState(true);
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
      updateJobInformation.id,
      updateJobInformation
    );
    showNotification("success", "Cập nhật thông tin công việc thành công");
    setIsDisabled(!isDisabled);
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

    await JobInformationAction.updateContract(jobInformation.id, {
      contractTypeId: contract.contractId,
      contractStartDate: contract.contractStartDate,
      contractEndDate: contract.contractEndDate,
    });
    showNotification("success", "Cập nhật thông tin hợp đồng thành công");
    setIsContractDisabled(!isContractDisabled);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex flex-col">
      <div className="border-[2px] mx-2 rounded-md shadow-lg">
        <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
          Thông tin công việc
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày vào:</div>
            {isDisabled ? (
              <div>
                {dayjs(updateJobInformation.joinDate).format("YYYY-DD-MM")}
              </div>
            ) : (
              <DatePicker
                className="w-full"
                defaultValue={dayjs(updateJobInformation.joinDate)}
                onChange={(date) => {
                  setUpdateJobInformation({
                    ...updateJobInformation,
                    joinDate: date ? date.toDate() : dayjs(new Date()).toDate(),
                  });
                }}
              />
            )}
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Trạng thái:</div>
            {isDisabled ? (
              <div>{updateJobInformation.employeeStatus}</div>
            ) : (
              <Select
                className="w-full"
                defaultValue={updateJobInformation.employeeStatus}
                options={employeeStatusOptions}
                onChange={(value) => {
                  setUpdateJobInformation({
                    ...updateJobInformation,
                    employeeStatus: value,
                  });
                }}
              />
            )}
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Chức vụ:</div>
            {isDisabled ? (
              <div>{updateJobInformation.jobTitle?.name}</div>
            ) : (
              <Select
                className="w-full"
                defaultValue={updateJobInformation.jobTitle?.name}
                options={jobTitles.map((jobTitle) => {
                  return {
                    label: jobTitle.name,
                    value: jobTitle.id,
                  };
                })}
                onChange={(value) => {
                  setUpdateJobInformation({
                    ...updateJobInformation,
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
            {isDisabled ? (
              <div>{updateJobInformation.department?.name}</div>
            ) : (
              <Select
                className="w-full"
                defaultValue={updateJobInformation.department?.name}
                options={departments.map((department) => {
                  return {
                    label: department.name,
                    value: department.id,
                  };
                })}
                onChange={(value) => {
                  setUpdateJobInformation({
                    ...updateJobInformation,
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
            {isDisabled ? (
              <div>
                {updateJobInformation.workingSkill?.map((workingSkill) => {
                  return `${workingSkill.name}; `;
                })}
              </div>
            ) : (
              <Select
                mode="multiple"
                defaultValue={updateJobInformation.workingSkill?.map(
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
                      ...updateJobInformation,
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
            {isDisabled ? (
              <div>{updateJobInformation.other}</div>
            ) : (
              <Input
                allowClear
                onChange={(e) =>
                  setUpdateJobInformation({
                    ...updateJobInformation,
                    other: e.target.value,
                  })
                }
              />
            )}
          </div>
        </div>
        <div className="w-full flex flex-row justify-end">
          {!isDisabled ? (
            <>
              <button
                onClick={() => {
                  setIsDisabled(!isDisabled);
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
                setIsDisabled(!isDisabled);
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
                  setIsContractDisabled(!isContractDisabled);
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
                setIsContractDisabled(!isContractDisabled);
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
  );
};

export default JobInformationContainer;
