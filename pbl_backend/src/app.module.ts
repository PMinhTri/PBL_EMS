import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { RoleModule } from './module/role/role.module';
import { RolesGuard } from './module/role/role.guard';
import { JobInformationModule } from './module/jobInformation/jobInformation.module';
import { JobTitleModule } from './module/jobTitle/jobTitle.module';
import { DepartmentModule } from './module/department/department.module';
import { PayrollModule } from './module/payroll/payroll.module';
import { LeaveModule } from './module/leave/leave.module';
import { WorkingSkillModule } from './module/workingSkill/workingSkill.module';
import { TimeSheetModule } from './module/timeSheet/timeSheet.module';
import { EducationModule } from './module/education/education.module';
import { ContractModule } from './module/contract/contract.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    JobInformationModule,
    JobTitleModule,
    PayrollModule,
    DepartmentModule,
    LeaveModule,
    TimeSheetModule,
    MailModule,
    WorkingSkillModule,
    EducationModule,
    ContractModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/forgot-password',
          method: RequestMethod.POST,
        },
        {
          path: 'users/create',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
