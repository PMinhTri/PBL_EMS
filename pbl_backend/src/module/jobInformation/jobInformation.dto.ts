import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class JobInformationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true, nullable: false })
  userId: string;

  @IsString()
  contractTypeId: string;

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

  @IsString()
  jobTitleId: string;

  @IsString()
  jobHistory: string;

  workingSkillId: string[];

  @IsString()
  departmentId: string;
}
