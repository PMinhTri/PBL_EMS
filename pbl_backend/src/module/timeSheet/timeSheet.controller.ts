import { Controller } from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';

@Controller('timeKeeping')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}
}
