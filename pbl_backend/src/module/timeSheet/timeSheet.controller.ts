import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { OTTimeSheetDto, TimeSheetDto } from './timeSheet.dto';
import { TimeSheetFailure } from 'src/enumTypes/failure.enum';

@Controller('time-sheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}
}
