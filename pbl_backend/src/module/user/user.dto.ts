import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEmail,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  gender: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  status: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ type: Number, required: true, nullable: false })
  roleId: number;
}

export class userInformationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: false, nullable: true })
  fullName: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  firstName?: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  lastName?: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  gender: string;

  @IsDateString()
  @ApiProperty({ type: Date, required: false, nullable: true })
  dateOfBirth: Date;

  @IsNumberString()
  @ApiProperty({ type: String, required: false, nullable: true })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  citizenId: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  address: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  city: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  nationality: string;

  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  avatar: string;
}
