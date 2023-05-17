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
import EmployeeManagement from "../modules/admin/EmployeeManagement";
import Auth from "../modules/auth/Auth";
import { useSetRecoilState } from "recoil";
import { userState } from "../recoil/user";
import { UserAction } from "../actions/userAction";

const Routes: React.FunctionComponent = () => {
  const token = localStorage.getItem("token");

  const setUser = useSetRecoilState(userState);

  React.useEffect(() => {
    if (token) {
      setUser(UserAction.getUserInformation(token));
    }
  }, [token, setUser]);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/*"
          element={!token ? <Auth /> : <Navigate to="/admin" replace />}
        >
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route
          path="/admin/*"
          element={token ? <Admin /> : <Navigate to="/auth/login" replace />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
