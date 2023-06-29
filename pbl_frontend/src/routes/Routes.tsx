import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import LoginPage from "../modules/auth/LoginPage";
import Admin from "../modules/admin/Admin";
import Dashboard from "../modules/admin/Dashboard/Dashboard";
import EmployeeManagement from "../modules/admin/EmployeeManagement/EmployeeManagement";
import Auth from "../modules/auth/Auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAuthState } from "../recoil/atoms/user";
import { UserAction } from "../actions/userAction";
import Employee from "../modules/employee/Employee";
import authSelector from "../recoil/selectors/auth";
import TimeSheetPage from "../modules/employee/timesheet/TimeSheet";
import LeaveManagement from "../modules/admin/LeaveManagement/LeaveManagement";
import PayrollManagement from "../modules/admin/PayrollManagement/PayrollManagement";
import TimeSheetManagement from "../modules/admin/TimeSheetManagement/TimeSheetManagement";
import LeaveRequest from "../modules/employee/leave/LeaveRequest";
import Account from "../modules/account/Account";
import Setting from "../modules/admin/SettingManagement/Setting";
import ForgotPassword from "../modules/auth/ForgotPassword";

export enum RoleEnum {
  ADMIN = "Admin",
  EMPLOYEE = "Employee",
}

const AuthenticatedRoute: React.FunctionComponent<{
  element: React.ReactNode;
}> = ({ element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{element}</>;
};

const Routes: React.FunctionComponent = () => {
  const token = localStorage.getItem("token");

  const { auth } = useRecoilValue(authSelector);
  const [userBasicInfo, setUserBasicInfo] = useRecoilState(userAuthState);

  React.useEffect(() => {
    if (token) {
      setUserBasicInfo(UserAction.getAuthInfo(token));
    }

    if (auth.isAuthenticated) {
      if (userBasicInfo.role === RoleEnum.ADMIN) {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/employee/time-sheet";
      }
    }
  }, [token, setUserBasicInfo, userBasicInfo.role, auth.isAuthenticated]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/*"
          element={
            !token ? (
              <Auth />
            ) : (
              <Navigate
                to={
                  userBasicInfo.role === RoleEnum.ADMIN ? "/admin" : "/employee"
                }
                replace
              />
            )
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        {userBasicInfo.role === RoleEnum.ADMIN ? (
          <>
            <Route
              path="/admin/*"
              element={<AuthenticatedRoute element={<Admin />} />}
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="leaves" element={<LeaveManagement />} />
              <Route path="payroll" element={<PayrollManagement />} />
              <Route path="time-sheet" element={<TimeSheetManagement />} />
              <Route path="setting" element={<Setting />} />
            </Route>
            <Route
              path="/employee/*"
              element={<AuthenticatedRoute element={<Employee />} />}
            >
              <Route path="time-sheet" element={<TimeSheetPage />} />
              <Route path="leaves" element={<LeaveRequest />} />
            </Route>
          </>
        ) : (
          <Route
            path="/employee/*"
            element={<AuthenticatedRoute element={<Employee />} />}
          >
            <Route path="time-sheet" element={<TimeSheetPage />} />
            <Route path="leaves" element={<LeaveRequest />} />
          </Route>
        )}

        <Route
          path="/account"
          element={<AuthenticatedRoute element={<Account />} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
