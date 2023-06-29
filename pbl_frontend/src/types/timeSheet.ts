export type TimeSheetPayload = {
  id?: string;
  userId: string;
  session: string;
  hoursWorked: number;
  status: string;
  timeIn: string;
  date: string;
  overtime?: boolean;
};

export type TimeSheet = {
  id?: string;
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
