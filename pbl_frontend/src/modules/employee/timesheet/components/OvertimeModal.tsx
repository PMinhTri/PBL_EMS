import React from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { SessionDate } from "../../../../constants/enum";

type Props = {
  onSelectDate: (date: string) => void;
  onSelectSession: (session: SessionDate) => void;
};

const OvertimeModal: React.FunctionComponent<Props> = (props: Props) => {
  const { onSelectDate, onSelectSession } = props;
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const [showError, setShowError] = React.useState<boolean>(false);

  return (
    <div className="overtime-modal">
      <label className="block text-gray-700 text-lg font-bold mb-2">
        Chọn lịch tăng ca
      </label>
      {showError && (
        <div className="block text-red-600 italic text-xs font-bold mb-2">
          Tăng ca chỉ áp dụng cho các ngày cuối tuần và thời gian sau giờ hành
          chính!
        </div>
      )}
      <div className="w-full flex justify-center items-center gap-8">
        <DatePicker
          defaultValue={selectedDate}
          onChange={(date) => {
            if (date) {
              if (date.day() === 6 || date.day() === 0) {
                setSelectedDate(date);
                onSelectDate(date.format("YYYY-MM-DD"));
                setShowError(false);
              } else {
                setShowError(true);
              }
            }
          }}
        />
        <select
          defaultValue={SessionDate.Morning}
          onChange={(value) => {
            onSelectSession(value.target.value as SessionDate);
          }}
          className="border border-gray-300 py-1 px-2 rounded-lg text-base"
        >
          <option value={SessionDate.Morning}>{SessionDate.Morning}</option>
          <option value={SessionDate.Afternoon}>{SessionDate.Afternoon}</option>
          <option value={SessionDate.FullDay}>{SessionDate.FullDay}</option>
        </select>
      </div>
    </div>
  );
};

export default OvertimeModal;
