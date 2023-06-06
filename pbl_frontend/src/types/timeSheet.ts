export type TimeSheetPayload = {
  userId: string;
  session: string;
  hoursWorked: number;
  status: string;
  timeIn: string;
  date: string;
  overtime?: boolean;
};

export type TimeSheet = {
  userId: string;
  session: string;
  hoursWorked: number;
  status: string;
  timeIn: string;
  date: number;
  month: number;
  year: number;
  overtime?: boolean;
};
