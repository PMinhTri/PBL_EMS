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
import { LeaveRequestDto } from './leave.dto';
import { NotFoundResult } from 'src/httpResponse';
import { LeaveFailure } from 'src/enumTypes/failure.enum';
import { ServiceResponseStatus } from 'src/serviceResponse';

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
  public async getAllLeaveRequest(
    @Query('year') year: number,
    @Query('month') month: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const leaveRequests = await this.leaveService.getAllLeaveRequest(
      year,
      month,
    );

    return res.send(SuccessResult(leaveRequests));
  }

  @Post('/create')
  public async createLeaveRequest(
    @Body() payload: LeaveRequestDto,
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
              message: 'Số ngày phép của bạn đã hêt!',
            }),
          );

        case LeaveFailure.INVALID_LEAVE_REQUEST:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Yêu cầu nghỉ phép không hợp lệ',
            }),
          );

        case LeaveFailure.LEAVE_REQUEST_OVERLAP:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Đã có yêu cầu nghỉ phép trong thời gian này',
            }),
          );

        case LeaveFailure.LEAVE_REQUEST_ON_WEEKEND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Không thể nghỉ phép vào ngày cuối tuần',
            }),
          );
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Patch('/update/:id')
  public async updateLeaveRequest(
    @Param('id') id: string,
    @Body() payload: LeaveRequestDto,
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

  @Get('/remaining-balance/all')
  public async getAllRemainingBalance(
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result: remainingLeaveDays } =
      await this.leaveService.getAllRemainingBalance(year);

    return res.send(SuccessResult(remainingLeaveDays));
  }

  @Get('/remaining-balance/')
  public async getRemainingBalance(
    @Query('userId') userId: string,
    @Query('leaveTypeId') leaveTypeId: string,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: remainingLeaveDays,
      status,
      failure,
    } = await this.leaveService.getRemainingBalance(userId, leaveTypeId, year);

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

  @Patch('/approve/:id')
  public async approveLeaveRequest(
    @Param('id') id: string,
    @Body() payload: { status: string },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.approveLeaveRequest(id, payload.status);

    if (status === ServiceResponseStatus.Failed) {
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

  @Patch('/cancel/:id')
  public async cancelLeaveRequest(
    @Param('id') id: string,
    @Body() payload: { status: string },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.cancelLeaveRequest(id, payload.status);

    if (status === ServiceResponseStatus.Failed) {
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

  @Patch('/reject/:id')
  public async rejectLeaveRequest(
    @Param('id') id: string,
    @Body() payload: { status: string },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.rejectLeaveRequest(id, payload.status);

    if (status === ServiceResponseStatus.Failed) {
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

  @Delete('/remove-all')
  public async removeAllLeaveRequest(
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result: leaveRequest } =
      await this.leaveService.deleteAllLeaveRequests();

    return res.send(SuccessResult(leaveRequest));
  }
}
