import { Controller } from '@nestjs/common';
import { JobInformationService } from './jobInformation.service';

@Controller('jobInformation')
export class JobInformationController {
  constructor(private jobInformationService: JobInformationService) {}
}
