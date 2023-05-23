import { Controller } from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';

@Controller('time-sheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}
}
