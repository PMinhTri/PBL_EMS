import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoState } from "../recoil/atoms/user";
import { UserAction } from "../actions/userAction";
import userSelector from "../recoil/selectors/user";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import ContentWrapper from "../components/ContentWrapper";
import { Button, DatePicker, Input, Select, Space } from "antd";

const inputFields = [
  {
    label: "Họ tên",
    name: "fullName",
  },
  {
    label: "Tên Họ",
    name: "firstName",
  },
  {
    label: "Tên sau",
    name: "lastName",
  },
  {
    label: "Giới tính",
    name: "gender",
  },
  {
    label: "Ngày sinh",
    name: "dateOfBirth",
  },
  {
    label: "Số điện thoại",
    name: "phoneNumber",
  },
  {
    label: "Địa chỉ",
    name: "address",
  },
  {
    label: "Quốc tịch",
    name: "nationality",
  },
  {
    label: "Trạng thái",
    name: "status",
  },
];

const Account = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await UserAction.getUserInfo(userAuthInfo.id);

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
          <div className="grid grid-cols-3 gap-4 mt-1 w-full">
            <div className="col-span-1 border-[2px] rounded-md shadow-md w-full flex flex-col">
              <div className="w-full border-[2px] flex flex-row ">
                <div className="flex flex-row w-[50%] justify-between items-center">
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
                <div className="flex flex-row pl-4 py-2 items-center">
                  General Information
                </div>
                <div className="grid grid-cols-2">
                  <div className="flex flex-row  items-center m-2">
                    <div className="m-2 w-36">Họ tên:</div>
                    <Input />
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
                            <div className="m-2 w-36">{item.label}:</div>
                            <Select
                              className="w-full"
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
                            <div className="m-2 w-36">{item.label}:</div>
                            <Space className="w-full">
                              <DatePicker />
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
                            <div className="m-2 w-36">{item.label}:</div>
                            <Select
                              className="w-full"
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
                          <div className="m-2 w-36">{item.label}:</div>
                          <Input allowClear />
                        </div>
                      );
                    })}
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
