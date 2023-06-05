import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userInfoState } from "../../recoil/atoms/user";
import { UserAction } from "../../actions/userAction";
import userSelector from "../../recoil/selectors/user";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import ContentWrapper from "../../components/ContentWrapper";
import PersonalInformation from "./components/PersonalInformation";
import { ArrowUpOutlined } from "@ant-design/icons";
import JobInformationContainer from "./components/JobInformation";
import { jobInformationState } from "../../recoil/atoms/jobInformation";
import { JobInformationAction } from "../../actions/jobInformationAction";
import { defaultJobInformation } from "../../constants/constantVariables";
import ChangePassword from "./components/ChangePassword";

enum ProfileType {
  PERSONAL = "Thông tin cá nhân",
  WORK = "Thông tin công việc",
  CHANGE_PASSWORD = "Đổi mật khẩu",
}

const Account = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const setJobInformation = useSetRecoilState(jobInformationState);
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
        setJobInformation(
          (await JobInformationAction.getByUserId(userAuthInfo.id)) ||
            defaultJobInformation
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userAuthInfo.id, setUserInfo, setJobInformation]);

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
      name: ProfileType.CHANGE_PASSWORD,
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
            <div className="col-span-1 rounded-md shadow-md w-full h-[600px] border-2 flex flex-col">
              <div className="w-full flex flex-row justify-between items-center h-32 border-b-[2px] p-4">
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
                <button
                  className="ml-2 border flex flex-row justify-between items-center border-blue-600 rounded-md px-2 py-1 
                  bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <ArrowUpOutlined />
                  Upload
                </button>
              </div>
            </div>
            <div className="col-span-2 w-full">
              {profileType === ProfileType.PERSONAL && <PersonalInformation />}
              {profileType === ProfileType.WORK && <JobInformationContainer />}
              {profileType === ProfileType.CHANGE_PASSWORD && (
                <ChangePassword />
              )}
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
