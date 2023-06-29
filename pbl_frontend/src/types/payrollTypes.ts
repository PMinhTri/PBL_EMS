export type Payroll = {
  id: string;
  userId: string;
  month: number;
  year: number;
  basicSalary: number;
  additional: number;
  totalSalary: number;
  status: string;
};

export type PayrollPayload = {
  userId: string;
  month: number;
  year: number;
  basicSalary: number;
  additional: number;
  status: string;
};
