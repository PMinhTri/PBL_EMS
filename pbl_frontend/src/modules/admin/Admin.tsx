import React from "react";
import { Outlet } from "react-router-dom";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import ContentWrapper from "../../components/ContentWrapper";
import Sidebar from "../../components/Sidebar";
import PageWrapper from "../../components/PageWrapper";
import {
  BiCalendarAlt,
  BiDollarCircle,
  BiGridAlt,
  BiGroup,
  BiTask,
  BiWrench,
} from "react-icons/bi";

const Admin: React.FunctionComponent = () => {
  const adminSideBarItems = [
    { name: "Thống kê", icon: <BiGridAlt />, path: "/admin/dashboard" },
    { name: "Nhân viên", icon: <BiGroup />, path: "/admin/employees" },
    { name: "Chấm công", icon: <BiTask />, path: "/admin/time-sheet" },
    { name: "Nghỉ phép", icon: <BiCalendarAlt />, path: "/admin/leaves" },
    { name: "Lương", icon: <BiDollarCircle />, path: "/admin/payroll" },
    { name: "Thiết lập", icon: <BiWrench />, path: "/admin/setting" },
  ];
  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        <Sidebar sideBarItems={adminSideBarItems} />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default Admin;
