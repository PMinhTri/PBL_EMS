import { userInformationDto } from './user.dto';

export type UpdateInformationInput = {
  email: string;
  userInformation: userInformationDto;
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
