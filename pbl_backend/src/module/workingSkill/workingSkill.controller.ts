import { Controller } from '@nestjs/common';
import { WorkingSkillService } from './workingSkill.service';

@Controller('working-skill')
export class WorkingSkillController {
  constructor(private readonly workingSkillService: WorkingSkillService) {}
}
