import { Controller } from '@nestjs/common';
import { TimeKeepingService } from './timeKeeping.service';

@Controller('timeKeeping')
export class TimeKeepingController {
  constructor(private readonly timeKeepingService: TimeKeepingService) {}
}
