import React from "react";
import { BiEdit } from "react-icons/bi";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Modal,
  Popover,
  Row,
  Select,
  Space,
} from "antd";
import showNotification from "../../../../utils/notification";
import { LeaveAction } from "../../../../actions/leaveAction";
import {
  LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "../../../../types/leaveTypes";
import { UserDetailInformation } from "../../../../types/userTypes";
import ApproveContent from "./ApproveContent";
import { FilterOutlined } from "@ant-design/icons";
import { UserAction } from "../../../../actions/userAction";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const currentYears = Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() + index
);

type Props = {
  employees: UserDetailInformation[];
};

const checkBoxOptions = [
  { label: LeaveStatus.Pending, value: "Pending" },
  { label: LeaveStatus.Approved, value: "Approved" },
  { label: LeaveStatus.Rejected, value: "Rejected" },
  { label: LeaveStatus.Cancelled, value: "Cancelled" },
];

const LeaveRequestManagement: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { employees } = props;
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );

  const [listUser, setListUser] = React.useState<UserDetailInformation[]>([]);

  const [requestHistoryData, setRequestHistoryData] = React.useState<
    LeaveRequest[]
  >([]);

  const [leaveType, setLeaveType] = React.useState<LeaveType[]>([]);
  const [checkAll, setCheckAll] = React.useState(true);
  const [checkedList, setCheckedList] = React.useState<string[]>([]);

  const [isSearchEmployee, setIsSearchEmployee] = React.useState(false);
  const [searchEmployeeId, setSearchEmployeeId] = React.useState("");

  const [openApproveModal, setOpenApproveModal] = React.useState<{
    leaveRequest: LeaveRequest;
    isOpen: boolean;
  }>({
    leaveRequest: {} as LeaveRequest,
    isOpen: false,
  });

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleRejectRequest = React.useCallback(async (id: string) => {
    try {
      await LeaveAction.reject(id);

      showNotification("success", "Đã từ chối yêu cầu!");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      showNotification("error", "Từ chối thất bại!");
    }
  }, []);

  const handleApproveRequest = React.useCallback(async (id: string) => {
    try {
      await LeaveAction.approve(id);

      showNotification("success", "Đã duyệt yêu cầu!");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      showNotification("error", "Duyệt thất bại!");
    }
  }, []);

  const handleOnSelectCheckBox = React.useCallback((values: string[]) => {
    if (values.length === 4) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }

    setCheckedList(values);
  }, []);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(
      e.target.checked ? checkBoxOptions.map((option) => option.value) : []
    );
    setCheckAll(e.target.checked);
  };

  React.useEffect(() => {
    const fetchDate = async () => {
      const leaveRequests = await LeaveAction.getAllLeaveRequest(
        selectedMonth,
        selectedYear,
        checkedList
      );
      setListUser(await UserAction.getAllEmployees());
      setLeaveType(await LeaveAction.getAllLeaveType());
      setRequestHistoryData(leaveRequests ?? []);
    };

    fetchDate();
  }, [
    selectedMonth,
    selectedYear,
    handleRejectRequest,
    handleApproveRequest,
    checkedList,
  ]);

  React.useEffect(() => {
    if (checkAll) {
      setCheckedList(checkBoxOptions.map((option) => option.value));
    }
  }, [checkAll]);

  const listRequestHistory = React.useMemo(() => {
    if (isSearchEmployee) {
      return requestHistoryData.filter(
        (item) => item.userId === searchEmployeeId
      );
    }

    return requestHistoryData;
  }, [isSearchEmployee, requestHistoryData, searchEmployeeId]);

  return (
    <div className="w-full mt-3 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Quản lý yêu cầu nghỉ phép</h2>
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex justify-start mb-4">
          <div>
            <label className="mx-2">Năm:</label>
            <select
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {currentYears.map((year) => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mx-2">Tháng:</label>
            <select
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-1">
          <Space>
            <Popover
              placement="left"
              content={
                <div>
                  <Checkbox onChange={onCheckAllChange} checked={checkAll}>
                    Tất cả
                  </Checkbox>
                  <Divider />
                  <Checkbox.Group
                    value={checkedList}
                    onChange={(values) => {
                      handleOnSelectCheckBox(values as string[]);
                    }}
                  >
                    <Row>
                      {checkBoxOptions.map((option) => (
                        <Col span={16}>
                          <Checkbox value={option.value}>
                            {option.label}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              }
              title={"Trạng thái"}
              trigger={"click"}
            >
              <Button size="middle" icon={<FilterOutlined />}>
                Trạng thái
              </Button>
            </Popover>
          </Space>
          <Space>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Tên nhân viên"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                ...listUser.map((user) => ({
                  label: user.fullName,
                  value: user.id,
                })),
              ]}
              onChange={(value) => {
                if (value === undefined) {
                  setIsSearchEmployee(false);
                  return;
                }
                setIsSearchEmployee(true);
                setSearchEmployeeId(value.toString());
              }}
              allowClear
            />
          </Space>
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Lịch sử yêu cầu</h2>
        <div className="flex border-[2px] max-h-[400px] overflow-x-auto overflow-y-auto scrollbar">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-center border-b">Họ và tên</th>
                <th className="py-3 px-4 text-center border-b">Loại phép</th>
                <th className="py-3 px-4 text-center border-b">Số ngày nghỉ</th>
                <th className="py-3 px-4 text-center border-b">Trạng thái</th>
                <th className="py-3 px-4 text-center border-b">Phê duyệt</th>
              </tr>
            </thead>
            <tbody>
              {listRequestHistory.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-center border-b">
                    {
                      employees.find((employee) => employee.id === item.userId)
                        ?.fullName
                    }
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {
                      leaveType.find((type) => type.id === item.leaveTypeId)
                        ?.name
                    }
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {item.leaveDays}
                  </td>
                  <td className={`py-3 px-4 text-center border-b`}>
                    <div
                      className={`inline-flex items-center gap-1 rounded-sm
                    px-2 py-2 text-xs font-semibold ${
                      item.status === LeaveStatus.Pending &&
                      "bg-blue-200 text-blue-600"
                    } ${
                        item.status === LeaveStatus.Rejected &&
                        "bg-red-200 text-red-600"
                      } ${
                        item.status === LeaveStatus.Approved &&
                        "bg-green-200 text-green-600 "
                      } ${
                        item.status === LeaveStatus.Cancelled &&
                        "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    <div className="w-full flex flex-row gap-2 justify-center items-center">
                      {item.status === LeaveStatus.Pending && (
                        <>
                          <div
                            className="text-green-500 text-2xl hover:text-green-600 hover:cursor-pointer"
                            onClick={() =>
                              setOpenApproveModal({
                                leaveRequest: item,
                                isOpen: true,
                              })
                            }
                          >
                            <BiEdit />
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            title="Duyệt yêu cầu này?"
            open={openApproveModal.isOpen}
            width={600}
            onCancel={() =>
              setOpenApproveModal({
                leaveRequest: {} as LeaveRequest,
                isOpen: false,
              })
            }
            footer={[
              <button
                onClick={() =>
                  handleRejectRequest(openApproveModal.leaveRequest.id)
                }
                className="w-24 ml-2 rounded-md h-8 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              >
                Từ chối
              </button>,
              <button
                className="ml-2 w-24 rounded-md h-8 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                onClick={() =>
                  handleApproveRequest(openApproveModal.leaveRequest.id)
                }
              >
                Duyệt
              </button>,
            ]}
          >
            <ApproveContent leaveRequest={openApproveModal.leaveRequest} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestManagement;
