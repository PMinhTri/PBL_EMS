import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TimeSheetService {
  constructor(private prisma: PrismaClient) {}
}
