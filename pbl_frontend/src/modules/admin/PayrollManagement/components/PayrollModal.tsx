import React from "react";
import { UserDetailInformation } from "../../../../types/userTypes";
import { PayrollAction } from "../../../../actions/payrollAction";
import { Payroll, PayrollPayload } from "../../../../types/payrollTypes";
import { PayrollStatus } from "../../../../constants/enum";

type Props = {
  user: UserDetailInformation;
  time: Date;
};

const PayrollModal: React.FunctionComponent<Props> = (props: Props) => {
  const { user, time } = props;
  const [payroll, setPayroll] = React.useState<Payroll[]>([]);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [onBasicSalaryTextChange, setOnBasicSalaryTextChange] =
    React.useState<string>("");

  const [onAdditionalTextChange, setAdditionalTextChange] =
    React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      setPayroll(
        (await PayrollAction.getAllPayloadOfUser(
          user.id,
          time.getMonth() + 1,
          time.getFullYear()
        )) ?? []
      );
    };

    fetchData();
  }, [time, user.id]);

  const handleApplyUpdate = async () => {
    setIsEdit(false);
    const body: Partial<Omit<PayrollPayload, "userId">> = {
      month: time.getMonth() + 1,
      year: time.getFullYear(),
      basicSalary: Number(onBasicSalaryTextChange),
      additional: Number(onAdditionalTextChange),
      status: PayrollStatus.Unpaid,
    };

    await PayrollAction.updatedPayroll(payroll[0].id, body);
  };

  return (
    <div className="p-2 flex flex-col justify-center items-center gap-2">
      <div className="flex justify-center items-center">
        <span className="font-bold text-lg">Thiết lập thông tin lương</span>
      </div>
      <div className="w-full p-2 flex flex-col gap-2 border justify-center items-center">
        <div className="w-full grid grid-cols-2">
          <div className="">
            <span className="font-bold">Họ và tên: </span>
          </div>
          <div>
            <span>{user.fullName}</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <div className="">
            <span className="font-bold">Chức vụ: </span>
          </div>
          <div>
            <span>{user.jobInformation?.jobTitle?.name}</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <div className="w-full flex justify-start items-center">
            <span className="font-bold">Lương cơ bản: </span>
          </div>
          <div>
            <input
              type="number"
              defaultValue={payroll[0]?.basicSalary}
              disabled={!isEdit}
              className="w-full rounded-md border-[2px] border-[#e0e0e0] bg-white p-1 
              text-base outline-none focus:border-blue-600 focus:shadow-md"
              onChange={(e) => setOnBasicSalaryTextChange(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <div className="w-full flex justify-start items-center">
            <span className="font-bold">Phụ cấp: </span>
          </div>
          <div>
            <input
              type="number"
              defaultValue={payroll[0]?.additional}
              disabled={!isEdit}
              className="w-full rounded-md border-[2px] border-[#e0e0e0] bg-white p-1 
              text-base outline-none focus:border-blue-600 focus:shadow-md"
              onChange={(e) => setAdditionalTextChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      {!isEdit ? (
        <div className="w-full flex flex-row justify-end items-center gap-2">
          <button
            className="
      px-4 py-2 w-26 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-bold text-sm
    "
            onClick={() => setIsEdit(true)}
          >
            Chỉnh sửa
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-row justify-end items-center gap-2">
          <button
            className="px-4 py-2 w-24 bg-red-500 hover:bg-red-600 rounded-md text-white font-bold text-sm"
            onClick={() => setIsEdit(false)}
          >
            Hủy
          </button>
          <button
            className="
          px-4 py-2 w-26 bg-green-500 hover:bg-green-600 rounded-md text-white font-bold text-sm
        "
            onClick={handleApplyUpdate}
          >
            Cập nhật
          </button>
        </div>
      )}
    </div>
  );
};

export default PayrollModal;
