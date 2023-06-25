import { Select } from "antd";
import React from "react";
import { SessionDate } from "../../../../constants/enum";
import { dateHelper } from "../../../../utils/datetime";
import moment from "moment";

type Props = {
  timeCheckIn: string;
  session: SessionDate;
  onSelectSession: (session: SessionDate) => void;
};

const TimeSheetModal: React.FunctionComponent<Props> = (props: Props) => {
  const { timeCheckIn, onSelectSession, session } = props;
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full p-2 flex flex-col">
      {dateHelper.dateToString.isBefore(
        timeCheckIn,
        dateHelper.dateToString.toString(new Date())
      ) ? (
        <span className="text-md font-bold text-red-500 italic">
          Thời gian hiện tại đã quá thời gian chấm công
        </span>
      ) : (
        <div>
          {dateHelper.dateToString.isWeekend(timeCheckIn) ? (
            <span className="text-md font-bold text-red-500 italic">
              Đây không phải giờ hành chính nên sẽ tính là tăng ca
            </span>
          ) : (
            <div className="w-full flex flex-col">
              <span className="w-full text-lg font-bold">Chấm công</span>
            </div>
          )}
        </div>
      )}
      <div className="w-full border-[2px]">
        {!dateHelper.dateToString.isBefore(
          timeCheckIn,
          dateHelper.dateToString.toString(new Date())
        ) && (
          <div className="w-full grid grid-cols-2 p-2 flex-row justify-between items-center">
            <span className="text-sm font-bold">Thời gian:</span>
            <div className="flex w-full justify-start">
              <span className="text-sm self-start">
                {currentTime.toLocaleTimeString("vi", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        )}
        <div className="w-full grid grid-cols-2 p-2 flex-row justify-between items-center">
          <span className="text-sm font-bold">Ngày:</span>
          <div className="flex w-full justify-start">
            <span className="text-sm flex self-start">
              {moment(timeCheckIn).toDate().toLocaleDateString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 p-2 flex-row justify-between items-center">
          <span className="text-sm font-bold">Ca:</span>
          <Select
            className="w-full"
            value={session}
            disabled={dateHelper.dateToString.isBefore(
              timeCheckIn,
              dateHelper.dateToString.toString(new Date())
            )}
            options={[
              { value: SessionDate.Morning, label: "Sáng 8:00 -> 12:00" },
              { value: SessionDate.Afternoon, label: "Chiều 13:30 -> 17:30" },
              { value: SessionDate.Night, label: "Tối 18:00 -> 22:00" },
            ]}
            onChange={(value) => {
              onSelectSession(value as SessionDate);
            }}
          />
        </div>
        {!dateHelper.dateToString.isWeekend(timeCheckIn) &&
          session === SessionDate.Night && (
            <div className="w-full flex justify-end">
              <span className="italic font-bold text-red-500">
                Ca tối sẽ tính là thời gian tăng ca
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default TimeSheetModal;
