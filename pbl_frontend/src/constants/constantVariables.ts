import { EmployeeStatus, Gender } from "./enum";

export const UserInformation: Record<string, string> = {
  id: "Mã nhân viên",
  fullName: "Họ và tên",
  jobTitle: "Chức vụ",
  email: "Email",
  phoneNumber: "Số điện thoại",
  address: "Địa chỉ",
  status: "Trạng thái",
  action: "Thao tác",
};

export const employeeStatusOptions = [
  {
    label: EmployeeStatus.Active,
    value: EmployeeStatus.Active,
  },
  {
    label: EmployeeStatus.Resigned,
    value: EmployeeStatus.Resigned,
  },
  {
    label: EmployeeStatus.Probation,
    value: EmployeeStatus.Probation,
  },
  {
    label: EmployeeStatus.Internship,
    value: EmployeeStatus.Internship,
  },
];

export const genderOptions = [
  {
    label: Gender.Male,
    value: Gender.Male,
  },
  {
    label: Gender.Female,
    value: Gender.Female,
  },
];

export const defaultJobInformation = {
  id: "",
  userId: "",
  contractId: "",
  contractStartDate: new Date(),
  contractEndDate: new Date(),
  joinDate: new Date(),
  employeeStatus: "",
  jobHistory: "",
  jobTitleId: "",
  departmentId: "",
  workingSkill: [],
  contractType: {
    id: "",
    type: "",
  },
  department: {
    id: "",
    name: "",
  },
  jobTitle: {
    id: "",
    name: "",
  },
  workingSkills: [
    {
      id: "",
      name: "",
      description: "",
    },
  ],
};
