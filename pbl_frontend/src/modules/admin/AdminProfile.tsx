import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoState } from "../../recoil/atoms/user";
import { UserAction } from "../../actions/userAction";
import userSelector from "../../recoil/selectors/user";

const AdminProfile = () => {
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
    <div>
      {isLoading ? (
        <div>...loading</div>
      ) : (
        <div>{JSON.stringify(userInfo)}</div>
      )}
    </div>
  );
};

export default AdminProfile;
