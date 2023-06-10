import { JobInformation } from "../../types/jobInformationTypes";
import { atom } from "recoil";

export const jobInformationState = atom<JobInformation>({
  key: "jobInformationState",
  default: {
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
  },
});
