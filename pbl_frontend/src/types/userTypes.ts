import { JobInformation } from "./jobInformationTypes";

export type UserAuthInfo = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

export type UserDetailInformation = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  city: string;
  nationality: string;
  avatar: string;
  citizenId: string;
  status: string;
  role: {
    name: string;
  };
  jobInformation?: JobInformation;
};

export type UserInformationForAdmin = {
  id: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
};

export type CreateNewUserInformation = {
  email: string;
  fullName: string;
  gender: string;
  status: string;
  roleId: string;
};

export type UpdateUserInformation = {
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  citizenId: string;
  address: string;
  city: string;
  nationality: string;
  avatar: string;
};

export type UserResponse = {
  id: string;
  email: string;
  fullName: string;
  gender: string;
  status: string;
  roleId: string;
};
