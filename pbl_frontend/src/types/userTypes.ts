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
  nationality: string;
  avatar: string;
  status: string;
  role: {
    name: string;
  };
};
