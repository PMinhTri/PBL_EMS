export type LeaveBalance = {
  userId: string;
  balance: Balance[];
};

export type Balance = {
  leaveTypeId: string;
  leaveTypeName: string;
  remainingLeaveDays: number;
};
