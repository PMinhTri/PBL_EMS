export enum AuthenticationFailure {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  PASSWORDS_DO_NOT_MATCH = 'PASSWORDS_DO_NOT_MATCH',
}

export enum UserFailure {
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export enum RoleFailure {
  ROLE_ALREADY_EXISTS = 'ROLE_ALREADY_EXISTS',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
}

export enum JobTitleFailure {
  JOB_TITLE_ALREADY_EXISTS = 'JOB_TITLE_ALREADY_EXISTS',
  JOB_TITLE_NOT_FOUND = 'JOB_TITLE_NOT_FOUND',
}

export enum DepartmentFailure {
  DEPARTMENT_ALREADY_EXISTS = 'DEPARTMENT_ALREADY_EXISTS',
  DEPARTMENT_NOT_FOUND = 'DEPARTMENT_NOT_FOUND',
}

export enum JobInformationFailure {
  JOB_INFORMATION_ALREADY_EXISTS = 'JOB_INFORMATION_ALREADY_EXISTS',
  JOB_INFORMATION_NOT_FOUND = 'JOB_INFORMATION_NOT_FOUND',
}

export enum LeaveFailure {
  LEAVE_ALREADY_EXISTS = 'LEAVE_ALREADY_EXISTS',
  LEAVE_NOT_FOUND = 'LEAVE_NOT_FOUND',
  LEAVE_TYPE_NOT_FOUND = 'LEAVE_TYPE_NOT_FOUND',
  LEAVE_TYPE_ALREADY_EXIST = 'LEAVE_TYPE_ALREADY_EXIST',
  LEAVE_BALANCE_EXCEEDED = 'LEAVE_BALANCE_EXCEEDED',
  INVALID_LEAVE_REQUEST = 'INVALID_LEAVE_REQUEST',
  LEAVE_REQUEST_OVERLAP = 'LEAVE_REQUEST_OVERLAP',
}

export enum WorkingSkillFailure {
  WORKING_SKILL_ALREADY_EXISTS = 'WORKING_SKILL_ALREADY_EXISTS',
  WORKING_SKILL_NOT_FOUND = 'WORKING_SKILL_NOT_FOUND',
}

export enum TimeSheetFailure {
  TIME_SHEET_ALREADY_EXISTS = 'TIME_SHEET_ALREADY_EXISTS',
  TIME_SHEET_NOT_FOUND = 'TIME_SHEET_NOT_FOUND',
}
