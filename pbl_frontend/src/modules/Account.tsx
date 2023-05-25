import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoState } from "../recoil/atoms/user";
import { UserAction } from "../actions/userAction";
import userSelector from "../recoil/selectors/user";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import ContentWrapper from "../components/ContentWrapper";
import { Button, DatePicker, Input, Select, Space } from "antd";
import dayjs from "dayjs";

const Account = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDisabled, setIsDisabled] = React.useState(true);

  const inputFields = [
    {
      label: "Họ tên",
      name: "fullName",
      value: userInfo.fullName,
    },
    {
      label: "Tên Họ",
      name: "firstName",
      value: userInfo.firstName,
    },
    {
      label: "Tên sau",
      name: "lastName",
      value: userInfo.lastName,
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

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await UserAction.getUserInfo(userAuthInfo.id);

      console.log(response);

      if (response?.id) {
        setUserInfo(response);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userAuthInfo.id]);

  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        {isLoading ? (
          <div>...loading</div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mt-4 w-full">
            <div className="col-span-1 border-[2px] rounded-md shadow-md w-full flex flex-col">
              <div className="w-full flex flex-row ">
                <div className="flex flex-row w-[30%] justify-between items-center border-[2px]">
                  Avatar
                </div>
                <div className="ml-2">
                  <div className="m-2">{userInfo.fullName}</div>
                  <div className="m-2">{userInfo.role.name}</div>
                  <Button className="m-2">Upload</Button>
                </div>
              </div>
            </div>
            <div className="col-span-2 w-full">
              <div className="border-[2px] mx-2 rounded-md shadow-lg">
                <div className="flex flex-row pl-4 py-2 items-center text-lg font-bold">
                  Thông tin cá nhân
                </div>
                <div className="grid grid-cols-2">
                  <div className="flex flex-row  items-center m-2">
                    <div className="m-2 w-36 font-bold">Họ tên:</div>
                    <Input disabled={isDisabled} value={userInfo.fullName} />
                  </div>
                  <div></div>
                  {inputFields
                    .slice(1, inputFields.length)
                    .map((item, index) => {
                      if (item.name === "gender") {
                        return (
                          <div
                            key={index}
                            className="flex flex-row  items-center m-2"
                          >
                            <div className="m-2 w-36 font-bold">
                              {item.label}:
                            </div>
                            <Select
                              defaultValue={item.value}
                              className="w-full"
                              disabled={isDisabled}
                              options={[
                                { label: "Nam", value: "Nam" },
                                { label: "Nữ", value: "Nữ" },
                              ]}
                            />
                          </div>
                        );
                      }

                      if (item.name === "dateOfBirth") {
                        return (
                          <div
                            key={index}
                            className="flex flex-row  items-center m-2"
                          >
                            <div className="m-2 w-36 font-bold">
                              {item.label}:
                            </div>
                            <Space className="w-full">
                              <DatePicker
                                disabled={isDisabled}
                                value={dayjs(item.value, "D")}
                              />
                            </Space>
                          </div>
                        );
                      }

                      if (item.name === "nationality") {
                        return (
                          <div
                            key={index}
                            className="flex flex-row  items-center m-2"
                          >
                            <div className="m-2 w-36 font-bold">
                              {item.label}:
                            </div>
                            <Select
                              value={item.value}
                              disabled={isDisabled}
                              className="w-full"
                              style={{
                                border: "1px",
                              }}
                              options={[{ label: "Việt Nam", value: "VN" }]}
                            />
                          </div>
                        );
                      }

                      return (
                        <div
                          key={index}
                          className="flex flex-row  items-center m-2"
                        >
                          <div className="m-2 w-36 font-bold">
                            {item.label}:
                          </div>
                          <Input
                            disabled={isDisabled}
                            value={
                              typeof item.value === "string" ? item.value : ""
                            }
                            allowClear
                          />
                        </div>
                      );
                    })}
                </div>
                <div className="w-full flex flex-row justify-end">
                  {!isDisabled ? (
                    <button
                      onClick={() => setIsDisabled(!isDisabled)}
                      className="m-4 w-24 h-8 rounded-sm border-[1px] bg-green-600 text-white 
                    justify-end hover:text-green-600 hover:bg-white hover:border-green-600"
                    >
                      Lưu
                    </button>
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
            </div>
          </div>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default Account;
