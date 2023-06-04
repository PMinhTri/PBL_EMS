import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoState } from "../../recoil/atoms/user";
import { UserAction } from "../../actions/userAction";
import userSelector from "../../recoil/selectors/user";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import ContentWrapper from "../../components/ContentWrapper";
import { Button } from "antd";
import PersonalInformation from "./components/PersonalInformation";
import JobInformation from "./components/JobInformation";
import { ArrowUpOutlined } from "@ant-design/icons";

enum ProfileType {
  PERSONAL = "Thông tin cá nhân",
  WORK = "Thông tin công việc",
}

const Account = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profileType, setProfileType] = React.useState(ProfileType.PERSONAL);
  const [activeKey, setActiveKey] = React.useState({
    isActive: true,
    key: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await UserAction.getUserInfo(userAuthInfo.id);
      if (response?.id) {
        setUserInfo(response);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userAuthInfo.id, setUserInfo]);

  const optionsButton = [
    {
      name: ProfileType.PERSONAL,
      icon: "",
    },
    {
      name: ProfileType.WORK,
      icon: "",
    },
    {
      name: "Hồ sơ",
      icon: "",
    },
  ];

  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        {isLoading ? (
          <div>...loading</div>
        ) : (
          <div className="m-2 grid grid-cols-4 gap-4 mt-4 w-full">
            <div className="col-span-1 rounded-md shadow-md w-full flex flex-col">
              <div className="w-full flex flex-row justify-between items-center border-[2px] p-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0 mr-4"></div>
                  <div>
                    <div className="text-lg font-medium">
                      {userInfo.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userInfo.role.name}
                    </div>
                  </div>
                </div>
                <Button className="ml-4" icon={<ArrowUpOutlined />}>
                  Upload
                </Button>
              </div>
            </div>
            <div className="col-span-2 w-full">
              {profileType === ProfileType.PERSONAL && <PersonalInformation />}
              {profileType === ProfileType.WORK && <JobInformation />}
            </div>
            <div className="col-span-1 w-full">
              <div className="flex flex-col gap-2 rounded-md items-start w-full border-[2px] shadow-md">
                {optionsButton.map((option, index) => (
                  <button
                    onClick={() => {
                      setProfileType(option.name as ProfileType);
                      setActiveKey({
                        isActive: true,
                        key: index,
                      });
                    }}
                    key={index}
                    className={`p-2 justify-center items-center cursor-pointer font-bold rounded-sm w-full
                    ${
                      activeKey.isActive && activeKey.key === index
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                    }
                    `}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default Account;
