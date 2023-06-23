import { LeaveStatus } from 'src/enumTypes/leave.enum';
import { LeaveSession } from 'src/enumTypes/leaveSession.enum';

export const Session: Record<LeaveSession, number> = {
  [LeaveSession.FullDay]: 1,
  [LeaveSession.Morning]: 0.5,
  [LeaveSession.Afternoon]: 0.5,
};

export const LeaveStatusKey: Record<string, LeaveStatus> = {
  ['Pending']: LeaveStatus.Pending,
  ['Approved']: LeaveStatus.Approved,
  ['Rejected']: LeaveStatus.Rejected,
  ['Cancelled']: LeaveStatus.Cancelled,
};
