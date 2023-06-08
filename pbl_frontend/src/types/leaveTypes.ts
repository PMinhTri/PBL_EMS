export type LeaveType = {
  id: string;
  name: string;
  balance: number;
};

export type LeaveRequestPayload = {
  userId: string;
  leaveTypeId: string;
  leaveDays: number;
  startDate: Date;
  endDate: Date;
  session: string;
  reason: string;
  status?: string;
};

export type LeaveRequest = {
  id: string;
  userId: string;
  leaveTypeId: string;
  leaveDays: number;
  startDate: Date;
  endDate: Date;
  session: string;
  reason: string;
  status?: string;
};

export enum LeaveStatus {
  Pending = "Chờ duyệt",
  Approved = "Đã duyệt",
  Rejected = "Đã từ chối",
  Cancelled = "Đã hủy",
}

export type LeaveBalance = {
  userId: string;
  balance: Balance[];
};

export type Balance = {
  leaveTypeId: string;
  leaveTypeName: string;
  remainingLeaveDays: number;
};
