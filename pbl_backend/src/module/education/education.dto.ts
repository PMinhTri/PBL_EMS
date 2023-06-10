import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  grade: string;
}
