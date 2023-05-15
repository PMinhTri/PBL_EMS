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

const PrivateRoute: React.FunctionComponent<{
  element: React.ReactNode;
}> = ({ element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{element}</>;
};

const PublicRoute: React.FunctionComponent<{
  element: React.ReactNode;
}> = ({ element }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return <>{element}</>;
};

const Routes: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<PublicRoute element={<Auth />} />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/admin/*" element={<PrivateRoute element={<Admin />} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
