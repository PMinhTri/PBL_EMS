import { userInformationDto } from './user.dto';

export type UpdateInformationInput = {
  email: string;
  userInformation: userInformationDto;
};

export type UserInformation = {
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
