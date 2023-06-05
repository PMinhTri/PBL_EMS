import { DatePicker, Select } from "antd";
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
import { useRecoilState } from "recoil";
import dayjs from "dayjs";
import { jobInformationState } from "../../../recoil/atoms/jobInformation";
import { JobInformationAction } from "../../../actions/jobInformationAction";

const JobInformationContainer: React.FunctionComponent = () => {
  const [jobInformation, setJobInformation] =
    useRecoilState(jobInformationState);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [jobTitles, setJobTitles] = React.useState<JobTitle[]>([]);
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const [workingSkills, setWorkingSkills] = React.useState<WorkingSkill[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);

  React.useEffect(() => {
    const fetchedData = async () => {
      setJobTitles(await JobTitleAction.getAllJobTitles());
      setContracts(await ContractAction.getAllContracts());
      setWorkingSkills(await WorkingSkillAction.getAllWorkingSkills());
      setDepartments(await DepartmentAction.getAllDepartments());
    };
    fetchedData();
  }, []);

  const handleSaveJobInformation = async () => {
    await JobInformationAction.update(jobInformation.id, jobInformation);
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
              <div>{dayjs(jobInformation.joinDate).format("YYYY-DD-MM")}</div>
            ) : (
              <DatePicker
                className="w-full"
                defaultValue={dayjs(jobInformation.joinDate)}
                onChange={(date) => {
                  setJobInformation({
                    ...jobInformation,
                    joinDate: date ? date.toDate() : dayjs(new Date()).toDate(),
                  });
                }}
              />
            )}
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Trạng thái:</div>
            {isDisabled ? (
              <div>{jobInformation.employeeStatus}</div>
            ) : (
              <Select
                className="w-full"
                defaultValue={jobInformation.employeeStatus}
                options={employeeStatusOptions}
                onChange={(value) => {
                  setJobInformation({
                    ...jobInformation,
                    employeeStatus: value,
                  });
                }}
              />
            )}
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Chức vụ:</div>
            {isDisabled ? (
              <div>{jobInformation.jobTitle?.name}</div>
            ) : (
              <Select
                className="w-full"
                defaultValue={jobInformation.jobTitle?.name}
                options={jobTitles.map((jobTitle) => {
                  return {
                    label: jobTitle.name,
                    value: jobTitle.id,
                  };
                })}
                onChange={(value) => {
                  setJobInformation({
                    ...jobInformation,
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
              <div>{jobInformation.department?.name}</div>
            ) : (
              <Select
                className="w-full"
                defaultValue={jobInformation.department?.name}
                options={departments.map((department) => {
                  return {
                    label: department.name,
                    value: department.id,
                  };
                })}
                onChange={(value) => {
                  setJobInformation({
                    ...jobInformation,
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
                {jobInformation.workingSkill?.map((workingSkill) => {
                  return `${workingSkill.name}; `;
                })}
              </div>
            ) : (
              <Select
                mode="multiple"
                defaultValue={jobInformation.workingSkill?.map(
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
                  setJobInformation({
                    ...jobInformation,
                    workingSkill: workingSkills.filter((workingSkill) =>
                      value.includes(workingSkill.id)
                    ),
                  });
                }}
                allowClear
              />
            )}
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Dự án:</div>
            <Select className="w-full" />
          </div>
        </div>
      </div>
      <div className="border-[2px] mt-4 mx-2 rounded-md shadow-lg">
        <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
          Thông tin hợp đồng
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Loại hợp đồng:</div>
            {isDisabled ? (
              <div>{jobInformation.contractType?.type}</div>
            ) : (
              <Select
                className="w-full"
                defaultValue={jobInformation.contractType?.type}
                options={contracts.map((contract) => {
                  return {
                    label: contract.type,
                    value: contract.id,
                  };
                })}
                onChange={(value) => {
                  setJobInformation({
                    ...jobInformation,
                    contractId: value,
                    contractType: contracts.find(
                      (contract) => contract.id === value
                    ),
                  });
                }}
                allowClear
              />
            )}
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày ký:</div>
            {isDisabled ? (
              <div>
                {dayjs(jobInformation.contractStartDate).format("YYYY-MM-DD")}
              </div>
            ) : (
              <DatePicker
                className="w-full"
                defaultValue={dayjs(jobInformation.contractStartDate)}
                onChange={(date) => {
                  setJobInformation({
                    ...jobInformation,
                    contractStartDate: date
                      ? date.toDate()
                      : dayjs(new Date()).toDate(),
                  });
                }}
              />
            )}
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày kết thúc:</div>
            {isDisabled ? (
              <div>
                {dayjs(jobInformation.contractEndDate).format("YYYY-MM-DD")}
              </div>
            ) : (
              <DatePicker
                className="w-full"
                defaultValue={dayjs(jobInformation.contractEndDate)}
                onChange={(date) => {
                  setJobInformation({
                    ...jobInformation,
                    contractEndDate: date
                      ? date.toDate()
                      : dayjs(new Date()).toDate(),
                  });
                }}
              />
            )}
          </div>
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
                setIsDisabled(!isDisabled);
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
  );
};

export default JobInformationContainer;
