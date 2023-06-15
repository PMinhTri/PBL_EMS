import React from "react";
import { UserDetailInformation } from "../../../../types/userTypes";
import PersonalInformation from "../../../account/components/PersonalInformation";
import JobInformationContainer from "../../../account/components/JobInformation";
import { defaultJobInformation } from "../../../../constants/constantVariables";

type Props = {
  userInfo: UserDetailInformation;
};

const EditEmployee: React.FunctionComponent<Props> = (props: Props) => {
  const { userInfo } = props;

  return (
    <div
      className="p-4 max-h-[480px] flex flex-col overflow-y-auto gap-4 scrollbar
    border rounded-md"
    >
      <div className="w-full flex flex-row justify-between items-center h-32 border-b-[2px] p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-4">
              <img
                src={userInfo.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full flex justify-start flex-col">
            <div className="text-2xl font-semibold text-gray-800 mb-1">
              {userInfo.fullName}
            </div>
            <div className="text-[16px] font-medium text-gray-600">
              {userInfo.email}
            </div>
            <div className="text-sm text-gray-500">{userInfo.role.name}</div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <PersonalInformation userInfo={userInfo} />
        </div>
        <div className="w-full">
          <JobInformationContainer
            jobInformation={userInfo.jobInformation || defaultJobInformation}
          />
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
