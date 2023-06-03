import { Injectable } from '@nestjs/common';
import { WorkingSkill } from '@prisma/client';
import { WorkingSkillFailure } from 'src/enumTypes/failure.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';

@Injectable()
export class WorkingSkillService {
  constructor(private prisma: PrismaService) {}
}
