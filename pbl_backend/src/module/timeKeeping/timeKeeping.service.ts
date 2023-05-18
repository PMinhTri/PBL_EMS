import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TimeKeepingService {
  constructor(private prisma: PrismaClient) {}
}
