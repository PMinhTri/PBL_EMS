export enum EmployeeStatus {
  Active = "Đang làm việc",
  Resigned = "Đã nghỉ việc",
  Probation = "Thử việc",
  Internship = "Thực tập",
}

export enum Gender {
  Male = "Nam",
  Female = "Nữ",
}

export enum SessionDate {
  Morning = "Sáng",
  Afternoon = "Chiều",
  FullDay = "Cả ngày",
  Night = "Tối",
}

export enum ActionType {
  Create = "Create",
  Update = "Update",
  Edit = "Edit",
  Delete = "Delete",
}

export enum LeaveStatus {
  Pending = "Chờ duyệt",
  Approved = "Đã duyệt",
  Rejected = "Đã từ chối",
  Cancelled = "Đã hủy",
}

export enum TimeSheetStatus {
  Submitted = "Đã chấm công",
  Unsubmitted = "Chưa chấm công",
  LeaveWithoutRequest = "Nghỉ không phép",
  LeaveWithRequest = "Nghỉ có phép",
  Overtime = "Tăng ca",
}

export enum PayrollStatus {
  Unpaid = "Chưa thanh toán",
  Paid = "Đã thanh toán",
}
