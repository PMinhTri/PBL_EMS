import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkingSkillService {
  constructor(private prisma: PrismaService) {}
}
