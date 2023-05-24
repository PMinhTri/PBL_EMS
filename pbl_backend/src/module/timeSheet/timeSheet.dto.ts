import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TimeSheetDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ type: 'number' })
  @IsNumber()
  checkInDate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  hoursWorked: number;

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
