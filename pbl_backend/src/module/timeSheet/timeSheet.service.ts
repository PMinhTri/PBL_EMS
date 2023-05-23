import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TimeSheetService {
  constructor(private prisma: PrismaService) {}
}
