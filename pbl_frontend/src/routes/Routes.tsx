import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import LoginPage from "../modules/auth/LoginPage";
import Admin from "../modules/admin/Admin";
import Dashboard from "../modules/admin/Dashboard";
import EmployeeManagement from "../modules/admin/EmployeeManagement/EmployeeManagement";
import Auth from "../modules/auth/Auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAuthState } from "../recoil/atoms/user";
import { UserAction } from "../actions/userAction";
import Account from "../modules/Account";
import Employee from "../modules/employee/Employee";
import authSelector from "../recoil/selectors/auth";

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
      }
      if (userBasicInfo.role === RoleEnum.EMPLOYEE) {
        window.location.href = "/employee";
      }
    }
  }, [token, setUserBasicInfo, userBasicInfo.role, auth.isAuthenticated]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/*"
          element={!token ? <Auth /> : <Navigate to="/admin/dashboard" replace />}
        >
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route
          path="/admin/*"
          element={
            <AuthenticatedRoute
              element={
                userBasicInfo.role === RoleEnum.ADMIN ? (
                  <Admin />
                ) : (
                  <Navigate to="/employee" replace />
                )
              }
            />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
        </Route>
        <Route
          path="/employee/*"
          element={
            <AuthenticatedRoute
              element={
                userBasicInfo.role === RoleEnum.EMPLOYEE ? (
                  <Employee />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
          }
        />
        <Route
          path="/account"
          element={<AuthenticatedRoute element={<Account />} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
