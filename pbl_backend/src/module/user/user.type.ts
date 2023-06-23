import { userInformationDto } from './user.dto';

export type UpdateInformationInput = {
  email: string;
  userInformation: Partial<userInformationDto>;
};

export type UserInformation = {
  id: string;
  email: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  citizenId: string;
  address: string;
  city: string;
  nationality: string;
  avatar: string;
  status: string;
  role: {
    name: string;
  };
};

export type FilterQuery = {
  gender?: string;
  jobTitleId?: string;
  departmentId?: string;
  contractId?: string;
  employeeStatus?: string;
  educationId?: string;
};
