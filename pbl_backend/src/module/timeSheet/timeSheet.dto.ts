import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class TimeSheetDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'number' })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string' })
  session: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  hoursWorked: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string' })
  status: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string' })
  date: string;

  @IsBoolean()
  overtime?: boolean;
}

export class OTTimeSheetDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ type: 'number' })
  @IsNumber()
  checkInDate: number;

  @IsNumber()
  @ApiProperty({ type: 'number' })
  otHoursWorked: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: 'number' })
  month: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: 'number' })
  year: number;
}
