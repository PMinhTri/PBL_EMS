import { ApiProperty } from '@nestjs/swagger';
import { Department, JobTitle, Project, WorkingSkill } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { WorkingSkillDto } from '../workingSkill/workingSkill.dto';

export class JobInformationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true, nullable: false })
  userId: number;

  @IsString()
  contractType: string;

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

  project: Project;
}
