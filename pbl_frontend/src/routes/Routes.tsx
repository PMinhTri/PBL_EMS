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
import { userAuthState } from "../recoil/atoms/user";
import { UserAction } from "../actions/userAction";
import Account from "../modules/Account";

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

  const setUser = useSetRecoilState(userAuthState);

  React.useEffect(() => {
    if (token) {
      setUser(UserAction.getAuthInfo(token));
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
          element={<AuthenticatedRoute element={<Admin />} />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
        </Route>
        <Route
          path="/account"
          element={<AuthenticatedRoute element={<Account />} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
