import { LeaveSession } from 'src/enumTypes/leaveSession.enum';

export const Session: Record<LeaveSession, number> = {
  [LeaveSession.FullDay]: 1,
  [LeaveSession.Morning]: 0.5,
  [LeaveSession.Afternoon]: 0.5,
};
