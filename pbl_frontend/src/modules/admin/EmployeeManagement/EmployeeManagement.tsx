import React from "react";
import { Button, Modal, Popover, Select, Space } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { UserAction } from "../../../actions/userAction";
import {
  CreateNewUserInformation,
  UserDetailInformation,
} from "../../../types/userTypes";
import { BiEditAlt, BiPlus, BiTrashAlt } from "react-icons/bi";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import EmployeeSort from "./components/EmployeeSort";
import EmployeeFilter from "./components/EmployeeFilter";
import CreateNewEmployee from "./components/CreateNewEmployee";
import showNotification from "../../../utils/notification";
import { JobInformationAction } from "../../../actions/jobInformationAction";
import dayjs from "dayjs";
import EditEmployee from "./components/EditEmployee";
import Loading from "../../../components/Loading";
import * as XLSX from "xlsx";

const EmployeeManagement: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [employeeList, setEmployeeList] = React.useState<
    UserDetailInformation[]
  >([]);
  const [listSearchData, setListSearchData] = React.useState<string[]>([]);

  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [filterQuery, setFilterQuery] = React.useState<{
    gender: string;
    departmentId: string;
    jobTitleId: string;
  }>({
    gender: "",
    departmentId: "",
    jobTitleId: "",
  });

  const [newEmployee, setNewEmployee] =
    React.useState<CreateNewUserInformation>({
      email: "",
      fullName: "",
      gender: "",
      status: "",
      roleId: "",
    });

  const [onSelectSort, setOnSelectSort] = React.useState<string>("");

  const [isOpenEditModal, setIsOpenEditModal] = React.useState<{
    isOpen: boolean;
    userInfo: UserDetailInformation;
  }>({ userInfo: {} as UserDetailInformation, isOpen: false });
  const [isOpenCreateModal, setIsOpenCreateModal] = React.useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = React.useState<{
    userId: string;
    isOpen: boolean;
  }>({
    userId: "",
    isOpen: false,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const employees = await UserAction.getAllEmployees();
      const arr: string[] = [];

      for (const employee of employees) {
        arr.push(employee.fullName);
        arr.push(employee.email);
      }

      setListSearchData(arr);

      if (searchQuery !== "") {
        const queryEmployees = await UserAction.getAllEmployees({
          search: searchQuery,
          filter: filterQuery,
        });
        setEmployeeList(queryEmployees);
      } else if (filterQuery) {
        setEmployeeList(
          await UserAction.getAllEmployees({
            filter: filterQuery,
          })
        );
      } else {
        setEmployeeList(employees);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [
    filterQuery,
    filterQuery.departmentId,
    filterQuery.gender,
    filterQuery.jobTitleId,
    searchQuery,
  ]);

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      // Check if the file extension is valid
      if (extension === "xlsx" || extension === "xls") {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Assuming the first sheet in the Excel file is the one you want to process
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert the worksheet to JSON format
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as string[][];

          const values: CreateNewUserInformation[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row: string[] = jsonData[i];
            let col = 1;
            values.push({
              fullName: row[col++],
              gender: row[col++],
              email: row[col++],
              status: row[col++],
              roleId: row[col++],
            });
          }

          await UserAction.importUsers(values);
        };

        reader.readAsArrayBuffer(file);
      } else {
        // Display an error message for invalid file type
        showNotification("error", "Vui lòng chọn file excel");
      }
    }
  };

  const handleCreateNewEmployee = async () => {
    if (
      !newEmployee.email ||
      !newEmployee.fullName ||
      !newEmployee.gender ||
      !newEmployee.status ||
      newEmployee.roleId === ""
    ) {
      showNotification("error", "Vui lòng điền đầy đủ thông tin");
    } else {
      const response = await UserAction.createNewUser(newEmployee);

      if (response?.user.id) {
        await JobInformationAction.create({
          userId: response.user.id,
          joinDate: dayjs(new Date()).format("YYYY-MM-DD"),
          employeeStatus: newEmployee.status,
        });
      }

      window.location.reload();
    }
  };

  const handleSort = (type: "Asc" | "Dsc") => {
    if (onSelectSort === "") {
      return;
    }

    const sortedEmployee: UserDetailInformation[] = [];

    switch (onSelectSort) {
      case "fullName":
        if (type === "Asc") {
          sortedEmployee.push(
            ...employeeList.sort((a, b) => {
              return a.fullName.localeCompare(b.fullName);
            })
          );
        }
        if (type === "Dsc") {
          sortedEmployee.push(
            ...employeeList.sort((a, b) => {
              return b.fullName.localeCompare(a.fullName);
            })
          );
        }
        break;

      case "Email":
        if (type === "Asc") {
          sortedEmployee.push(
            ...employeeList.sort((a, b) => {
              return a.email.localeCompare(b.email);
            })
          );
        }
        if (type === "Dsc") {
          sortedEmployee.push(
            ...employeeList.sort((a, b) => {
              return b.email.localeCompare(a.email);
            })
          );
        }
        break;

      default:
        break;
    }

    setEmployeeList(sortedEmployee);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await UserAction.deleteUser(userId);
    } catch (err) {
      showNotification("error", "Xóa nhân viên không thành công");
    }
    setIsModalDeleteOpen({
      userId: "",
      isOpen: false,
    });
    window.location.reload();
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex w-full h-16 justify-center items-center border-b-[2px]">
        <div className="w-[99%] flex flex-row justify-between">
          <div className="flex flex-row">
            <Space direction="vertical" className="w-[100%] mr-1 flex flex-row">
              <Popover
                placement="bottomRight"
                content={
                  <EmployeeFilter
                    onApply={(payload) =>
                      setFilterQuery({
                        gender: payload.gender,
                        departmentId: payload.department,
                        jobTitleId: payload.jobTitle,
                      })
                    }
                  />
                }
                title={"Filter"}
                trigger={"click"}
              >
                <Button size="middle" icon={<FilterOutlined />}>
                  Lọc
                </Button>
              </Popover>
              <Popover
                placement="right"
                content={
                  <>
                    <EmployeeSort
                      onSelect={(value) => setOnSelectSort(value)}
                    />
                    <Space className="flex justify-center flex-row mr-1">
                      <Button
                        type="primary"
                        size="middle"
                        className="bg-blue-600 mt-2"
                        icon={<ArrowUpOutlined />}
                        onClick={() => handleSort("Asc")}
                      >
                        Asc
                      </Button>
                      <Button
                        type="primary"
                        size="middle"
                        className="bg-blue-600 mt-2"
                        icon={<ArrowDownOutlined />}
                        onClick={() => handleSort("Dsc")}
                      >
                        Dsc
                      </Button>
                    </Space>
                  </>
                }
                title={"Sort"}
                trigger={"click"}
              >
                <Button size="middle" icon={<SortAscendingOutlined />}>
                  Sắp xếp
                </Button>
              </Popover>
            </Space>
          </div>
          <div>
            <Space.Compact style={{ width: "100%" }}>
              <Select
                showSearch
                style={{ width: 400 }}
                placeholder="Tìm kiếm"
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
                  ...listSearchData.map((item) => ({
                    label: item,
                    value: item,
                  })),
                ]}
                onChange={(value) => {
                  if (value === undefined) setSearchQuery("");
                  setSearchQuery(value.trim());
                }}
                allowClear
              />
            </Space.Compact>
          </div>
        </div>
      </div>
      <div className="w-full h-12 px-1 py-1 border-b flex flex-row justify-around">
        <div className="flex justify-between items-center w-full">
          <span className="ml-4">
            Tổng số nhân viên: <span>{employeeList.length}</span>
          </span>
          <div className="flex flex-row justify-around gap-2">
            <label
              htmlFor="import-file"
              className="w-28 h-8 bg-white text-blue-600 text-lg flex justify-center items-center rounded-md 
            hover:shadow-md border-[1px] border-blue-600 hover: cursor-pointer"
            >
              <input
                id="import-file"
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleImportFile}
              />
              <BsFillArrowDownCircleFill />
              <span className="ml-2 text-[16px]">Nhập file</span>
            </label>
            <button
              onClick={() => setIsOpenCreateModal(true)}
              className="w-24 h-8 bg-blue-600 text-white text-lg flex justify-center items-center border-[1px] rounded-md 
            hover:bg-white hover:text-blue-600 hover:border-blue-600"
            >
              <BiPlus />
              <span className="ml-2 text-[16px]">Tạo mới</span>
            </button>
            <Modal
              title="Tạo mới nhân viên"
              open={isOpenCreateModal}
              width={600}
              onCancel={() => setIsOpenCreateModal(false)}
              footer={[
                <Button
                  onClick={async () => {
                    await handleCreateNewEmployee();
                  }}
                  className="w-24 rounded-md h-8 bg-blue-500 text-white cursor-pointer"
                >
                  Tạo mới
                </Button>,
                <button
                  onClick={() => setIsOpenCreateModal(false)}
                  className="w-24 ml-2 rounded-md h-8 bg-red-500 text-white cursor-pointer"
                >
                  Hủy
                </button>,
              ]}
            >
              <CreateNewEmployee
                onChange={(value) => {
                  setNewEmployee({
                    email: value.email,
                    fullName: value.fullName,
                    gender: value.gender,
                    status: value.status,
                    roleId: value.roleId,
                  });
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-auto h-96 rounded-lg border border-gray-200 shadow-md m-5 scrollbar">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 w-2 font-medium text-gray-900"
                >
                  Họ và tên
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Giới tính
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Chức vụ
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Số điện thoại
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  CCCD/CMND
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Chi nhánh
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Trình độ
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-gray-900"
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {employeeList.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                    <div className="relative h-10 w-10">
                      <img
                        className="h-full w-full rounded-full object-cover object-center"
                        src={employee.avatar}
                        alt=""
                      />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">
                        {employee.fullName}
                      </div>
                      <div className="text-gray-400">{employee.email}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{employee.gender}</td>
                  <td className="px-6 py-4">
                    {employee.jobInformation?.jobTitle?.name}
                  </td>
                  <td className="px-6 py-4">{employee.phoneNumber}</td>
                  <td className="px-6 py-4">{employee.citizenId}</td>
                  <td className="px-6 py-4">
                    {employee.jobInformation?.department?.name}
                  </td>
                  <td className="px-6 py-4">{employee.education?.grade}</td>
                  <td className="px-6 py-4 w-36">
                    <div className="inline-flex items-center gap-1 rounded-sm bg-green-200 px-2 py-2 text-xs font-semibold text-green-600">
                      {employee.jobInformation?.employeeStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <div
                        className="flex justify-center items-center text-2xl cursor-pointer text-green-600"
                        onClick={() =>
                          setIsOpenEditModal({
                            userInfo: employee,
                            isOpen: true,
                          })
                        }
                      >
                        <BiEditAlt />
                      </div>
                      <div
                        onClick={() => {
                          setIsModalDeleteOpen({
                            userId: employee.id,
                            isOpen: true,
                          });
                        }}
                        className="flex justify-center items-center text-2xl cursor-pointer text-red-600"
                      >
                        <BiTrashAlt />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            title="Bạn muốn xóa nhân viên này?"
            open={isModalDeleteOpen.isOpen}
            width={400}
            onCancel={() =>
              setIsModalDeleteOpen({
                userId: "",
                isOpen: false,
              })
            }
            footer={[
              <button
                onClick={() =>
                  setIsModalDeleteOpen({
                    userId: "",
                    isOpen: false,
                  })
                }
                className="w-24 ml-2 rounded-md h-8 bg-red-500 text-white cursor-pointer"
              >
                Hủy
              </button>,
              <Button
                onClick={() => handleDeleteUser(isModalDeleteOpen.userId)}
                className="ml-2 w-24 rounded-md h-8 bg-blue-500 text-white cursor-pointer"
              >
                Xóa
              </Button>,
            ]}
          />
          <Modal
            onCancel={() =>
              setIsOpenEditModal({
                isOpen: false,
                userInfo: {} as UserDetailInformation,
              })
            }
            open={isOpenEditModal.isOpen}
            width={800}
            title="Thông tin nhân viên"
            footer={<></>}
          >
            <EditEmployee userInfo={isOpenEditModal.userInfo} />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
