import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
import Loading from "../../components/Loading";

enum ProfileType {
  PERSONAL = "Thông tin cá nhân",
  WORK = "Thông tin công việc",
  CHANGE_PASSWORD = "Đổi mật khẩu",
}

const Account = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [jobInformation, setJobInformation] =
    useRecoilState(jobInformationState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profileType, setProfileType] = React.useState(ProfileType.PERSONAL);
  const [activeKey, setActiveKey] = React.useState({
    isActive: true,
    key: 0,
  });
  const [avatar, setAvatar] = React.useState("");

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

  const handleFileChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const elem = document.createElement("canvas");
            const width = 200;
            const scaleFactor = width / img.width;
            elem.width = width;
            elem.height = img.height * scaleFactor;
            const ctx = elem.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, img.height * scaleFactor);
            const data = ctx?.canvas.toDataURL("image/jpeg", 0.8);

            setAvatar(data as string);
            UserAction.updateAvatar(userAuthInfo.id, data as string);
          };
        };
        reader.readAsDataURL(file);
      }
    },
    [userAuthInfo.id]
  );

  const handleDeleteAvatar = React.useCallback(async () => {
    setAvatar("");
    await UserAction.updateAvatar(userAuthInfo.id, "");

    window.location.reload();
  }, [userAuthInfo.id]);

  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="m-2 grid grid-cols-4 gap-4 mt-4 w-full">
            <div className="col-span-3 flex flex-col justify-center items-center gap-2">
              <div className="w-[98%] flex flex-row justify-between rounded-md items-center border-[2px] p-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 mr-4">
                    <img
                      src={userInfo.avatar || avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-medium">
                      {userInfo.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userInfo.role.name}
                    </div>
                  </div>
                </div>
                <div className="w-1/2 flex flex-row justify-end items-center">
                  <button
                    className="border flex justify-center items-center rounded-md px-2 py-1 border-gray-300
                  hover:bg-gray-400 hover:border-gray-400 hover:text-white transition-colors duration-300"
                    onClick={handleDeleteAvatar}
                  >
                    <span className="">Xóa ảnh</span>
                  </button>
                  <label
                    htmlFor="avatar-upload"
                    className="ml-2 border flex flex-row justify-between items-center border-blue-600 rounded-md px-2 py-1 
                bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <ArrowUpOutlined />
                    Tải lên
                  </label>
                </div>
              </div>
              <div className="col-span-2 w-full">
                {profileType === ProfileType.PERSONAL && (
                  <PersonalInformation userInfo={userInfo} />
                )}
                {profileType === ProfileType.WORK && (
                  <JobInformationContainer jobInformation={jobInformation} />
                )}
                {profileType === ProfileType.CHANGE_PASSWORD && (
                  <ChangePassword />
                )}
              </div>
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
