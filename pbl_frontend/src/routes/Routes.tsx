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

const Routes: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
