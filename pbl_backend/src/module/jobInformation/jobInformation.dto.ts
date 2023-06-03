import { ApiProperty } from '@nestjs/swagger';
import { Contract, Department, JobTitle, WorkingSkill } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class JobInformationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true, nullable: false })
  userId: string;

  @IsString()
  contractType: Contract;

  @IsDateString()
  contractStartDate: Date;

  @IsDateString()
  contractEndDate: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ type: Date, required: true, nullable: false })
  joinDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  employeeStatus: string;

  jobTitle: JobTitle;

  @IsString()
  jobHistory: string;

  workingSkills: WorkingSkill[];

  department: Department;
}
