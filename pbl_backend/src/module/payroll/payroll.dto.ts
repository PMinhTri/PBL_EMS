import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PayrollDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  month: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number' })
  basicSalary: number;

  @IsNumber()
  @ApiProperty({ type: 'number' })
  additional: number;

  @IsString()
  @ApiProperty({ type: 'string' })
  status: string;
}
