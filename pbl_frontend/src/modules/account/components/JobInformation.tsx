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

const JobInformation: React.FunctionComponent = () => {
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

  return (
    <div className="flex flex-col">
      <div className="border-[2px] mx-2 rounded-md shadow-lg">
        <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
          Thông tin công việc
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày vào:</div>
            <DatePicker className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Trạng thái:</div>
            <Select className="w-full" options={employeeStatusOptions} />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Chức vụ:</div>
            <Select
              className="w-full"
              options={jobTitles.map((jobTitle) => {
                return {
                  label: jobTitle.name,
                  value: jobTitle.id,
                };
              })}
            />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Chi nhánh:</div>
            <Select
              className="w-full"
              options={departments.map((department) => {
                return {
                  label: department.name,
                  value: department.id,
                };
              })}
              allowClear
            />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Kỹ năng:</div>
            <Select
              mode="multiple"
              className="w-full max-h-12"
              options={workingSkills.map((workingSkill) => {
                return {
                  label: workingSkill.name,
                  value: workingSkill.id,
                };
              })}
              allowClear
            />
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
            <Select
              className="w-full"
              options={contracts.map((contract) => {
                return {
                  label: contract.type,
                  value: contract.id,
                };
              })}
              allowClear
            />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày ký:</div>
            <DatePicker className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày kết thúc:</div>
            <DatePicker className="w-full" />
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
              onClick={() => {
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
            onClick={() => setIsDisabled(!isDisabled)}
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

export default JobInformation;
