import { DatePicker, Input, Select, Space } from "antd";
import React from "react";
import { useRecoilState } from "recoil";
import { userInfoState } from "../../../recoil/atoms/user";
import dayjs from "dayjs";
import { UserAction } from "../../../actions/userAction";
import { genderOptions } from "../../../constants/constantVariables";

const PersonalInformation: React.FunctionComponent = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [isDisabled, setIsDisabled] = React.useState(true);

  const inputFields = [
    {
      label: "Họ tên",
      name: "fullName",
      value: userInfo.fullName,
    },
    {
      label: "Giới tính",
      name: "gender",
      value: userInfo.gender,
    },
    {
      label: "Ngày sinh",
      name: "dateOfBirth",
      value: userInfo.dateOfBirth,
    },
    {
      label: "Số điện thoại",
      name: "phoneNumber",
      value: userInfo.phoneNumber,
    },
    {
      label: "Địa chỉ",
      name: "address",
      value: userInfo.address,
    },
    {
      label: "Thành phố",
      name: "city",
      value: userInfo.city,
    },
    {
      label: "Quốc tịch",
      name: "nationality",
      value: userInfo.nationality,
    },
    {
      label: "CCCD/CMND",
      name: "citizenId",
      value: userInfo.citizenId,
    },
    {
      label: "Học vấn",
      name: "education",
      value: "",
    },
  ];

  const handleSaveInfo = async () => {
    await UserAction.updateUserInfo(userInfo.email, userInfo);
  };

  return (
    <div className="border-[2px] mx-2 rounded-md shadow-lg">
      <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
        Thông tin cá nhân
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-row  items-center m-2">
          <div className="m-2 w-36 font-bold">Họ tên:</div>
          {isDisabled ? (
            <div>{userInfo.fullName}</div>
          ) : (
            <Input
              disabled={isDisabled}
              onChange={(e) =>
                setUserInfo({
                  ...userInfo,
                  fullName: e.target.value,
                })
              }
              defaultValue={userInfo.fullName}
            />
          )}
        </div>
        <div></div>
        {inputFields.slice(1, inputFields.length).map((item, index) => {
          if (item.name === "gender") {
            return (
              <div key={index} className="flex flex-row  items-center m-2">
                <div className="m-2 w-36 font-bold">{item.label}:</div>
                {isDisabled ? (
                  <div>{item.value as string}</div>
                ) : (
                  <Select
                    defaultValue={item.value}
                    className="w-full"
                    disabled={isDisabled}
                    onChange={(value) =>
                      setUserInfo({
                        ...userInfo,
                        [item.name]: value,
                      })
                    }
                    options={genderOptions}
                  />
                )}
              </div>
            );
          }

          if (item.name === "dateOfBirth") {
            return (
              <div key={index} className="flex flex-row  items-center m-2">
                <div className="m-2 w-36 font-bold">{item.label}:</div>
                {isDisabled ? (
                  <div>{dayjs(item.value).format("DD/MM/YYYY")}</div>
                ) : (
                  <Space className="w-full">
                    <DatePicker
                      disabled={isDisabled}
                      defaultValue={dayjs(item.value)}
                      onChange={(date) =>
                        setUserInfo({
                          ...userInfo,
                          dateOfBirth: date
                            ? date.toDate()
                            : dayjs(new Date()).toDate(),
                        })
                      }
                    />
                  </Space>
                )}
              </div>
            );
          }

          if (item.name === "nationality") {
            return (
              <div key={index} className="flex flex-row  items-center m-2">
                <div className="m-2 w-36 font-bold">{item.label}:</div>
                {isDisabled ? (
                  <div>{item.value as string}</div>
                ) : (
                  <Select
                    defaultValue={item.value}
                    disabled={isDisabled}
                    className="w-full"
                    style={{
                      border: "1px",
                    }}
                    options={[{ label: "Việt Nam", value: "VN" }]}
                    onChange={(value) => {
                      setUserInfo({
                        ...userInfo,
                        [item.name]: value,
                      });
                    }}
                  />
                )}
              </div>
            );
          }

          return (
            <div key={index} className="flex flex-row items-center m-2">
              <div className="m-2 w-36 font-bold">{item.label}:</div>
              {isDisabled ? (
                <div>{item.value as string}</div>
              ) : (
                <Input
                  disabled={isDisabled}
                  defaultValue={
                    typeof item.value === "string" ? item.value : ""
                  }
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      [item.name]: e.target.value,
                    });
                  }}
                  allowClear
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="w-full flex flex-row justify-end">
        {!isDisabled ? (
          <>
            <button
              onClick={() => {
                setIsDisabled(!isDisabled);
              }}
              className="m-4 w-24 h-8 rounded-sm border-[1px] bg-red-600 text-white 
                    justify-end hover:text-red-600 hover:bg-white hover:border-red-600"
            >
              Huỷ
            </button>
            <button
              onClick={async () => {
                await handleSaveInfo();
                setIsDisabled(!isDisabled);
              }}
              className="m-4 w-24 h-8 rounded-sm border-[1px] bg-green-600 text-white 
                    justify-end hover:text-green-600 hover:bg-white hover:border-green-600"
            >
              Lưu
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsDisabled(!isDisabled)}
            className="m-4 w-24 h-8 rounded-sm border-[1px] bg-blue-600 text-white 
                  justify-end hover:text-blue-600 hover:bg-white hover:border-blue-600"
          >
            Cập nhật
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
