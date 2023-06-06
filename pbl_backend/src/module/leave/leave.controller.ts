import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { LeaveDto } from './leave.dto';
import { NotFoundResult } from 'src/httpResponse';
import { LeaveFailure } from 'src/enumTypes/failure.enum';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('/leave-types')
  public async getLeaveTypes(@Res() res: IResponse): Promise<IResponse> {
    const leaveTypes = await this.leaveService.getAllLeaveTypes();

    return res.send(SuccessResult(leaveTypes));
  }

  @Post('/leave-types/create')
  public async createLeaveType(
    @Body() payload: { name: string; balance: number },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result: leaveTypes } = await this.leaveService.createLeaveType(
      payload.name,
      payload.balance,
    );

    return res.send(SuccessResult(leaveTypes));
  }

  @Get()
  public async getAllLeaveRequest(@Res() res: IResponse): Promise<IResponse> {
    const leaveRequests = await this.leaveService.getAllLeaveRequest();

    return res.send(SuccessResult(leaveRequests));
  }

  @Post('/create')
  public async createLeaveRequest(
    @Body() payload: LeaveDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.createLeaveRequest(payload);

    if (status === 'Failed') {
      switch (failure.reason) {
        case LeaveFailure.LEAVE_BALANCE_EXCEEDED:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Leave balance exceeded',
            }),
          );

        case LeaveFailure.INVALID_LEAVE_REQUEST:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Invalid leave request',
            }),
          );

        case LeaveFailure.LEAVE_REQUEST_OVERLAP:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Leave request overlap',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Patch('/update/:id')
  public async updateLeaveRequest(
    @Param('id') id: string,
    @Body() payload: LeaveDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.updateLeaveRequest(id, payload);

    if (status === 'Failed') {
      switch (failure.reason) {
        case LeaveFailure.LEAVE_BALANCE_EXCEEDED:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Leave balance exceeded',
            }),
          );

        case LeaveFailure.INVALID_LEAVE_REQUEST:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Invalid leave request',
            }),
          );

        case LeaveFailure.LEAVE_REQUEST_OVERLAP:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Leave request overlap',
            }),
          );

        case LeaveFailure.LEAVE_NOT_FOUND:
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Leave request not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Get('/remaining-balance')
  public async getRemainingBalance(
    @Query('userId') userId: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: remainingLeaveDays,
      status,
      failure,
    } = await this.leaveService.getRemainingBalance(userId);

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_TYPE_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Leave type not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(remainingLeaveDays));
  }

  @Patch('/cancel/:id')
  public async cancelLeaveRequest(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.cancelLeaveRequest(id);

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Leave request not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Delete('/remove/:id')
  public async removeLeaveRequest(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.removeLeaveRequest(id);

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Leave request not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Get('/user/')
  public async getLeaveRequestByUserId(
    @Query('userId') userId: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.getLeaveRequestByUserId(userId);

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Leave request not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Get(':id')
  public async getLeaveRequestById(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.getLeaveRequestById(id);

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Leave request not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Patch('leave-types/update/:id')
  public async updateLeaveType(
    @Param('id') id: string,
    @Body() payload: { name: string; balance: number },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveType,
      status,
      failure,
    } = await this.leaveService.editLeaveType(
      id,
      payload.name,
      payload.balance,
    );

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_TYPE_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Leave type not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveType));
  }
}
