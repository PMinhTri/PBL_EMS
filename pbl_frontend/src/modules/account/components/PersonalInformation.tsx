import { DatePicker, Input, Select, Space } from "antd";
import React from "react";
import dayjs from "dayjs";
import { UserAction } from "../../../actions/userAction";
import { genderOptions } from "../../../constants/constantVariables";
import showNotification from "../../../utils/notification";
import { UserDetailInformation } from "../../../types/userTypes";
import { Education } from "../../../types/eductionTypes";
import { EducationAction } from "../../../actions/educationAction";

type Props = {
  userInfo: UserDetailInformation;
};

const PersonalInformation: React.FunctionComponent<Props> = (props: Props) => {
  const { userInfo } = props;
  const [updateUserInfo, setUpdateUserInfo] =
    React.useState<UserDetailInformation>(userInfo);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [education, setEducation] = React.useState<Education[]>([]);

  const inputFields = [
    {
      label: "Họ tên",
      name: "fullName",
      value: updateUserInfo.fullName,
    },
    {
      label: "Giới tính",
      name: "gender",
      value: updateUserInfo.gender,
    },
    {
      label: "Ngày sinh",
      name: "dateOfBirth",
      value: updateUserInfo.dateOfBirth,
    },
    {
      label: "Số điện thoại",
      name: "phoneNumber",
      value: updateUserInfo.phoneNumber,
    },
    {
      label: "Địa chỉ",
      name: "address",
      value: updateUserInfo.address,
    },
    {
      label: "Thành phố",
      name: "city",
      value: updateUserInfo.city,
    },
    {
      label: "Quốc tịch",
      name: "nationality",
      value: updateUserInfo.nationality,
    },
    {
      label: "CCCD/CMND",
      name: "citizenId",
      value: updateUserInfo.citizenId,
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      setEducation(await EducationAction.getAllEducation());
    };

    fetchData();
  }, []);

  const handleSaveInfo = async () => {
    if (updateUserInfo.fullName === "" || updateUserInfo.citizenId === "") {
      showNotification("error", "Họ tên và CCCD/CMND không được để trống");
      return;
    }

    if (userInfo === updateUserInfo) {
      setIsDisabled(!isDisabled);
      return;
    }

    await UserAction.updateUserInfo(updateUserInfo.email, updateUserInfo);
    showNotification("success", "Cập nhật thông tin thành công");
    setIsDisabled(!isDisabled);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
            <div>{updateUserInfo.fullName}</div>
          ) : (
            <Input
              disabled={isDisabled}
              onChange={(e) =>
                setUpdateUserInfo({
                  ...updateUserInfo,
                  fullName: e.target.value,
                })
              }
              defaultValue={updateUserInfo.fullName}
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
                      setUpdateUserInfo({
                        ...updateUserInfo,
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
                  <div>
                    {item.value !== null
                      ? dayjs(item.value).format("DD/MM/YYYY")
                      : ""}
                  </div>
                ) : (
                  <Space className="w-full">
                    <DatePicker
                      disabled={isDisabled}
                      defaultValue={
                        item.value !== null
                          ? dayjs(item.value)
                          : dayjs(new Date())
                      }
                      onChange={(date) =>
                        setUpdateUserInfo({
                          ...updateUserInfo,
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
                    options={[{ label: "Việt Nam", value: "Việt Nam" }]}
                    onChange={(value) => {
                      setUpdateUserInfo({
                        ...updateUserInfo,
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
                    setUpdateUserInfo({
                      ...updateUserInfo,
                      [item.name]: e.target.value,
                    });
                  }}
                  allowClear
                />
              )}
            </div>
          );
        })}
        <div className="flex flex-row  items-center m-2">
          <div className="m-2 w-36 font-bold">Học vấn:</div>
          {isDisabled ? (
            <div>{updateUserInfo.education?.grade}</div>
          ) : (
            <Select
              defaultValue={updateUserInfo.education?.grade}
              disabled={isDisabled}
              className="w-full"
              style={{
                border: "1px",
              }}
              options={education.map((item) => {
                return { label: item.grade, value: item.id };
              })}
              onChange={(value) => {
                setUpdateUserInfo({
                  ...updateUserInfo,
                  educationId: value,
                  education: education.find((item) => item.id === value),
                });
              }}
            />
          )}
        </div>
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
