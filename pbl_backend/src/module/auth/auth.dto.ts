import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, nullable: false })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, nullable: false })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  password: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  confirmPassword: string;
}

export class forgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, nullable: false })
  email: string;
}
