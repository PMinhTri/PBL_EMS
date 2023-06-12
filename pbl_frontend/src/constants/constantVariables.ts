import { LeaveRequest } from "../types/leaveTypes";
import { EmployeeStatus, Gender, SessionDate } from "./enum";

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
  other: "",
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

export const locale = {
  lang: {
    locale: "vi_VN",
    placeholder: "Chọn ngày",
    rangePlaceholder: ["Start date", "End date"],
    today: "Today",
    now: "Now",
    backToToday: "Back to today",
    ok: "OK",
    clear: "Clear",
    month: "Tháng",
    year: "Năm",
    timeSelect: "Select time",
    dateSelect: "Select date",
    monthSelect: "Choose a month",
    yearSelect: "Choose a year",
    decadeSelect: "Choose a decade",
    yearFormat: "YYYY",
    dateFormat: "M/D/YYYY",
    dayFormat: "D",
    dateTimeFormat: "M/D/YYYY HH:mm:ss",
    monthFormat: "MMMM",
    monthBeforeYear: true,
    previousMonth: "Previous month (PageUp)",
    nextMonth: "Next month (PageDown)",
    previousYear: "Last year (Control + left)",
    nextYear: "Next year (Control + right)",
    previousDecade: "Last decade",
    nextDecade: "Next decade",
    previousCentury: "Last century",
    nextCentury: "Next century",
    shortWeekDays: ["CN", "Th.2", "Th.3", "Th.4", "Th.5", "Th.6", "Th.7"],
    shortMonths: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
  },
  timePickerLocale: {
    placeholder: "Select time",
  },
  dateFormat: "YYYY-MM-DD",
  dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
  weekFormat: "YYYY-wo",
  monthFormat: "YYYY-MM",
};

export const Session: Record<SessionDate, number> = {
  [SessionDate.FullDay]: 1,
  [SessionDate.Morning]: 0.5,
  [SessionDate.Afternoon]: 0.5,
};

export const defaultRequest: LeaveRequest = {
  id: "",
  userId: "",
  leaveTypeId: "",
  leaveDays: 0,
  startDate: new Date(),
  endDate: new Date(),
  session: "",
  reason: "",
};
