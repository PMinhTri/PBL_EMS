export type UserAuthInfo = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

export type UserDetailInformation = {
  id: number;
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
};

export type UserInformationForAdmin = {
  id: number;
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
  roleId: number;
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
