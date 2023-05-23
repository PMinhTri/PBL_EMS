import { Module } from '@nestjs/common';

import { WorkingSkillController } from './workingSkill.controller';
import { WorkingSkillService } from './workingSkill.service';

@Module({
  controllers: [WorkingSkillController],
  providers: [WorkingSkillService],
})
export class WorkingSkillModule {}
