import React from "react";
import { AiOutlineCaretRight } from "react-icons/ai";
import { Contract } from "../../../types/contractTypes";
import { Role } from "../../../types/roleTypes";
import { JobTitle } from "../../../types/jobTitleTypes";
import { Department } from "../../../types/departmentTypes";
import { Education } from "../../../types/eductionTypes";
import { LeaveType } from "../../../types/leaveTypes";
import { RoleAction } from "../../../actions/roleAction";
import { JobTitleAction } from "../../../actions/jobTitleAction";
import { DepartmentAction } from "../../../actions/departmentAction";
import { EducationAction } from "../../../actions/educationAction";
import { ContractAction } from "../../../actions/contractAction";
import { LeaveAction } from "../../../actions/leaveAction";
import showNotification from "../../../utils/notification";
import { ActionType } from "../../../constants/enum";

const Setting: React.FunctionComponent = () => {
  const [isRoleCollapse, setIsRoleCollapse] = React.useState(true);
  const [isJobTitleCollapse, setIsJobTitleCollapse] = React.useState(true);
  const [isOfficeCollapse, setIsOfficeCollapse] = React.useState(true);
  const [isEducationCollapse, setIsEducationCollapse] = React.useState(true);
  const [isContractCollapse, setIsContractCollapse] = React.useState(true);
  const [isLeavesCollapse, setIsLeavesCollapse] = React.useState(true);

  const [roles, setRoles] = React.useState<Role[]>([]);
  const [jobTitles, setJobTitles] = React.useState<JobTitle[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [educations, setEducations] = React.useState<Education[]>([]);
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const [leaveTypes, setLeaveTypes] = React.useState<LeaveType[]>([]);

  const [newRole, setNewRole] = React.useState<string>("");
  const [newJobTitle, setNewJobTitle] = React.useState<string>("");
  const [newDepartment, setNewDepartment] = React.useState<string>("");
  const [newEducation, setNewEducation] = React.useState<string>("");
  const [newContract, setNewContract] = React.useState<string>("");
  const [newLeaveType, setNewLeaveType] = React.useState<{
    name: string;
    balance: number;
  }>({
    name: "",
    balance: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      setRoles(await RoleAction.getAllRoles());
      setJobTitles(await JobTitleAction.getAllJobTitles());
      setDepartments(await DepartmentAction.getAllDepartments());
      setEducations(await EducationAction.getAllEducation());
      setContracts(await ContractAction.getAllContracts());
      setLeaveTypes(await LeaveAction.getAllLeaveType());
    };

    fetchData();
  }, []);

  const handleRole = async (type: ActionType) => {
    switch (type) {
      case ActionType.Create: {
        if (newRole === "") return;

        const response = await RoleAction.create(newRole);
        if (response) {
          showNotification("success", "Thêm vai trò thành công");
          setRoles([...roles, response]);
        }

        break;
      }
    }
  };

  const handleJobTitle = async (type: ActionType) => {
    switch (type) {
      case ActionType.Create: {
        if (newJobTitle === "") return;

        const response = await JobTitleAction.create(newJobTitle);
        if (response) {
          showNotification("success", "Thêm chức vụ thành công");
          setJobTitles([...jobTitles, response]);
        }

        break;
      }
    }
  };

  const handleDepartment = async (type: ActionType) => {
    switch (type) {
      case ActionType.Create: {
        if (newDepartment === "") return;

        const response = await DepartmentAction.create(newDepartment);
        if (response) {
          showNotification("success", "Thêm chi nhánh thành công");
          setDepartments([...departments, response]);
        }

        break;
      }
    }
  };

  const handleEducation = async (type: ActionType) => {
    switch (type) {
      case ActionType.Create: {
        if (newEducation === "") return;

        const response = await EducationAction.create(newEducation);

        if (response) {
          showNotification("success", "Thêm học vấn thành công");
          setEducations([...educations, response]);
        }

        break;
      }
    }
  };

  const handleContract = async (type: ActionType) => {
    switch (type) {
      case ActionType.Create: {
        if (newContract === "") return;

        const response = await ContractAction.create(newContract);

        if (response) {
          showNotification("success", "Thêm hợp đồng thành công");
          setContracts([...contracts, response]);
        }

        break;
      }
    }
  };

  const handleLeaveType = async (type: ActionType) => {
    switch (type) {
      case ActionType.Create: {
        if (newLeaveType.name === "" || newLeaveType.balance == 0) {
          showNotification("error", "Vui lòng nhập đầy đủ thông tin");
          return;
        }

        const response = await LeaveAction.createLeaveType(
          newLeaveType.name,
          newLeaveType.balance
        );

        if (response) {
          showNotification("success", "Thêm loại phép thành công");
          setLeaveTypes([...leaveTypes, response]);
        }

        break;
      }
    }
  };

  return (
    <div className="w-full p-4 border shadow-md overflow-y-auto">
      <div className="text-2xl font-bold mb-4">Thiết lập</div>
      <div className="flex flex-col gap-2">
        <div
          className={`w-full border flex flex-col rounded-md ${
            isRoleCollapse ? "h-12" : "h-auto"
          } transition-height duration-300`}
        >
          <div className="flex flex-row gap-4 justify-start items-center">
            <div
              onClick={() => setIsRoleCollapse(!isRoleCollapse)}
              className="p-4 hover:cursor-pointer transition-transform duration-300"
              style={{
                transform: isRoleCollapse ? "rotate(0deg)" : "rotate(90deg)",
              }}
            >
              <AiOutlineCaretRight />
            </div>
            <div className="w-1/3 text-lg font-bold text-gray-600">Vai trò</div>
          </div>
          <div
            className={`w-full transition-all duration-300 overflow-hidden ${
              !isRoleCollapse ? "h-auto p-6" : "h-0"
            }`}
          >
            <div className="flex flex-col w-full p-2 gap-2">
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Thêm</div>
                <input
                  className="w-3/5 p-2 border rounded-md"
                  onChange={(e) => setNewRole(e.target.value)}
                />
                <div className="w-1/5 px-8 flex flex-row">
                  <div
                    className="text-white px-2 bg-blue-500 rounded-sm border hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleRole(ActionType.Create)}
                  >
                    Thêm
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Chỉnh sửa</div>
                <select className="w-3/5 p-2 border rounded-md">
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <div className="w-1/5 px-8 gap-2 flex flex-row">
                  <div className="bg-green-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-green-600">
                    Sửa
                  </div>
                  <div className="bg-red-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-red-600">
                    Xóa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`w-full border flex flex-col rounded-md ${
            isJobTitleCollapse ? "h-12" : "h-auto"
          } transition-height duration-300`}
        >
          <div className="flex flex-row gap-4 justify-start items-center">
            <div
              onClick={() => setIsJobTitleCollapse(!isJobTitleCollapse)}
              className="p-4 hover:cursor-pointer transition-transform duration-300"
              style={{
                transform: isJobTitleCollapse
                  ? "rotate(0deg)"
                  : "rotate(90deg)",
              }}
            >
              <AiOutlineCaretRight />
            </div>
            <div className="w-1/3 text-lg font-bold text-gray-600">Chức vụ</div>
          </div>
          <div
            className={`w-full transition-all duration-300 overflow-hidden ${
              !isJobTitleCollapse ? "h-auto p-6" : "h-0"
            }`}
          >
            <div className="flex flex-col w-full p-2 gap-2">
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Thêm</div>
                <input
                  className="w-3/5 p-2 border rounded-md"
                  onChange={(e) => setNewJobTitle(e.target.value)}
                />
                <div className="w-1/5 px-8 flex flex-row">
                  <div
                    className="text-white px-2 bg-blue-500 rounded-sm border hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleJobTitle(ActionType.Create)}
                  >
                    Thêm
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Chỉnh sửa</div>
                <select className="w-3/5 p-2 border rounded-md">
                  {jobTitles.map((jobTitle) => (
                    <option key={jobTitle.id} value={jobTitle.id}>
                      {jobTitle.name}
                    </option>
                  ))}
                </select>
                <div className="w-1/5 px-8 gap-2 flex flex-row">
                  <div className="bg-green-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-green-600">
                    Sửa
                  </div>
                  <div className="bg-red-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-red-600">
                    Xóa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`w-full border flex flex-col rounded-md ${
            isOfficeCollapse ? "h-12" : "h-auto"
          } transition-height duration-300`}
        >
          <div className="flex flex-row gap-4 justify-start items-center">
            <div
              onClick={() => setIsOfficeCollapse(!isOfficeCollapse)}
              className="p-4 hover:cursor-pointer transition-transform duration-300"
              style={{
                transform: isOfficeCollapse ? "rotate(0deg)" : "rotate(90deg)",
              }}
            >
              <AiOutlineCaretRight />
            </div>
            <div className="w-1/3 text-lg font-bold text-gray-600">
              Chi nhánh
            </div>
          </div>
          <div
            className={`w-full transition-all duration-300 overflow-hidden ${
              !isOfficeCollapse ? "h-auto p-6" : "h-0"
            }`}
          >
            <div className="flex flex-col w-full p-2 gap-2">
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Thêm</div>
                <input
                  className="w-3/5 p-2 border rounded-md"
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
                <div className="w-1/5 px-8 flex flex-row">
                  <div
                    className="text-white px-2 bg-blue-500 rounded-sm border hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleDepartment(ActionType.Create)}
                  >
                    Thêm
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Chỉnh sửa</div>
                <select className="w-3/5 p-2 border rounded-md">
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                <div className="w-1/5 px-8 gap-2 flex flex-row">
                  <div className="bg-green-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-green-600">
                    Sửa
                  </div>
                  <div className="bg-red-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-red-600">
                    Xóa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`w-full border flex flex-col rounded-md ${
            isEducationCollapse ? "h-12" : "h-auto"
          } transition-height duration-300`}
        >
          <div className="flex flex-row gap-4 justify-start items-center">
            <div
              onClick={() => setIsEducationCollapse(!isEducationCollapse)}
              className="p-4 hover:cursor-pointer transition-transform duration-300"
              style={{
                transform: isEducationCollapse
                  ? "rotate(0deg)"
                  : "rotate(90deg)",
              }}
            >
              <AiOutlineCaretRight />
            </div>
            <div className="w-1/3 text-lg font-bold text-gray-600">Học vấn</div>
          </div>
          <div
            className={`w-full transition-all duration-300 overflow-hidden ${
              !isEducationCollapse ? "h-auto p-6" : "h-0"
            }`}
          >
            <div className="flex flex-col w-full p-2 gap-2">
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Thêm</div>
                <input
                  className="w-3/5 p-2 border rounded-md"
                  onChange={(e) => setNewEducation(e.target.value)}
                />
                <div className="w-1/5 px-8 flex flex-row">
                  <div
                    className="text-white px-2 bg-blue-500 rounded-sm border hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleEducation(ActionType.Create)}
                  >
                    Thêm
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Chỉnh sửa</div>
                <select className="w-3/5 p-2 border rounded-md">
                  {educations.map((education) => (
                    <option key={education.id} value={education.id}>
                      {education.grade}
                    </option>
                  ))}
                </select>
                <div className="w-1/5 px-8 gap-2 flex flex-row">
                  <div className="bg-green-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-green-600">
                    Sửa
                  </div>
                  <div className="bg-red-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-red-600">
                    Xóa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`w-full border flex flex-col rounded-md ${
            isContractCollapse ? "h-12" : "h-auto"
          } transition-height duration-300`}
        >
          <div className="flex flex-row gap-4 justify-start items-center">
            <div
              onClick={() => setIsContractCollapse(!isContractCollapse)}
              className="p-4 hover:cursor-pointer transition-transform duration-300"
              style={{
                transform: isContractCollapse
                  ? "rotate(0deg)"
                  : "rotate(90deg)",
              }}
            >
              <AiOutlineCaretRight />
            </div>
            <div className="w-1/3 text-lg font-bold text-gray-600">
              Hợp đồng
            </div>
          </div>
          <div
            className={`w-full transition-all duration-300 overflow-hidden ${
              !isContractCollapse ? "h-auto p-6" : "h-0"
            }`}
          >
            <div className="flex flex-col w-full p-2 gap-2">
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Thêm</div>
                <input
                  className="w-3/5 p-2 border rounded-md"
                  onChange={(e) => setNewContract(e.target.value)}
                />
                <div className="w-1/5 px-8 flex flex-row">
                  <div
                    className="text-white px-2 bg-blue-500 rounded-sm border hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleContract(ActionType.Create)}
                  >
                    Thêm
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Chỉnh sửa</div>
                <select className="w-3/5 p-2 border rounded-md">
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.type}
                    </option>
                  ))}
                </select>
                <div className="w-1/5 px-8 gap-2 flex flex-row">
                  <div className="bg-green-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-green-600">
                    Sửa
                  </div>
                  <div className="bg-red-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-red-600">
                    Xóa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`w-full border flex flex-col rounded-md ${
            isLeavesCollapse ? "h-12" : "h-auto"
          } transition-height duration-300`}
        >
          <div className="flex flex-row gap-4 justify-start items-center">
            <div
              onClick={() => setIsLeavesCollapse(!isLeavesCollapse)}
              className="p-4 hover:cursor-pointer transition-transform duration-300"
              style={{
                transform: isLeavesCollapse ? "rotate(0deg)" : "rotate(90deg)",
              }}
            >
              <AiOutlineCaretRight />
            </div>
            <div className="w-1/3 text-lg font-bold text-gray-600">
              Loại phép nghỉ
            </div>
          </div>
          <div
            className={`w-full transition-all duration-300 overflow-hidden ${
              !isLeavesCollapse ? "h-auto p-6" : "h-0"
            }`}
          >
            <div className="flex flex-col w-full p-2 gap-2">
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Thêm</div>
                <div className="w-3/5 flex flex-row grid-2 gap-2">
                  <input
                    className="w-full p-2 border rounded-md"
                    placeholder="Loại nghỉ phép..."
                    onChange={(e) =>
                      setNewLeaveType({ ...newLeaveType, name: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    placeholder="Số lượng ngày nghỉ..."
                    onChange={(e) =>
                      setNewLeaveType({
                        ...newLeaveType,
                        balance: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="w-1/5 px-8 flex flex-row">
                  <div
                    className="text-white px-2 bg-blue-500 rounded-sm border hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleLeaveType(ActionType.Create)}
                  >
                    Thêm
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="w-1/5">Chỉnh sửa</div>
                <select className="w-3/5 p-2 border rounded-md">
                  {leaveTypes.map((leaveType) => (
                    <option key={leaveType.id} value={leaveType.id}>
                      {leaveType.name}
                    </option>
                  ))}
                </select>
                <div className="w-1/5 px-8 gap-2 flex flex-row">
                  <div className="bg-green-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-green-600">
                    Sửa
                  </div>
                  <div className="bg-red-500 px-4 hover:cursor-pointer text-white rounded-sm border hover:bg-red-600">
                    Xóa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="py-6 px-6 text-center"></footer>
    </div>
  );
};

export default Setting;
