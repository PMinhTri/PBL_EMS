import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WorkingSkillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
