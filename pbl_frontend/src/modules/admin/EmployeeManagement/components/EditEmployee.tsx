import React from "react";
import { UserDetailInformation } from "../../../../types/userTypes";
import PersonalInformation from "../../../account/components/PersonalInformation";
import JobInformationContainer from "../../../account/components/JobInformation";
import { JobInformation } from "../../../../types/jobInformationTypes";
import { JobInformationAction } from "../../../../actions/jobInformationAction";
import { defaultJobInformation } from "../../../../constants/constantVariables";

type Props = {
  userInfo: UserDetailInformation;
};

const EditEmployee: React.FunctionComponent<Props> = (props: Props) => {
  const { userInfo } = props;
  const [jobInformation, setJobInformation] = React.useState<JobInformation>(
    defaultJobInformation
  );

  React.useEffect(() => {
    const fetchData = async () => {
      setJobInformation(await JobInformationAction.getByUserId(userInfo.id));
    };

    fetchData();
  }, [userInfo.id]);

  return (
    <div
      className="p-4 max-h-[480px] flex flex-col overflow-y-auto gap-4 scrollbar
    border rounded-md"
    >
      <div className="w-full flex flex-row justify-between items-center h-32 border-b-[2px] p-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex-shrink-0 mr-4"></div>
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
          <JobInformationContainer jobInformation={jobInformation} />
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
