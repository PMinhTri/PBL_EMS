import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OTTimeSheetDto, TimeSheetDto } from './timeSheet.dto';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { TimeSheet } from '@prisma/client';
import { TimeSheetFailure } from 'src/enumTypes/failure.enum';

@Injectable()
export class TimeSheetService {
  constructor(private prisma: PrismaService) {}
}
