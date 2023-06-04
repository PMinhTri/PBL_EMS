import { Contract } from "./contractTypes";
import { Department } from "./departmentTypes";
import { JobTitle } from "./jobTitleTypes";
import { WorkingSkill } from "./workingSkillTypes";

export type JobInformation = {
  id: string;
  userId: string;
  contractId: string;
  contractStartDate: Date;
  contractEndDate: Date;
  joinDate: Date;
  employeeStatus: string;
  jobHistory?: string;
  jobTitleId: string;
  departmentId: string;
  workingSkill?: string[];
  contractType?: Contract;
  department?: Department;
  jobTitle?: JobTitle;
  workingSkills?: WorkingSkill[];
};
