import React from "react";
import { Outlet } from "react-router-dom";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import ContentWrapper from "../../components/ContentWrapper";
import Sidebar from "../../components/Sidebar";
import PageWrapper from "../../components/PageWrapper";
import {
  BiBarChartAlt2,
  BiCalendar,
  BiCalendarAlt,
  BiDollarCircle,
  BiGridAlt,
  BiGroup,
  BiMessageDetail,
  BiTask,
} from "react-icons/bi";

const Admin: React.FunctionComponent = () => {
  const adminSideBarItems = [
    { name: "Dashboard", icon: <BiGridAlt />, path: "/admin/dashboard" },
    { name: "Employees", icon: <BiGroup />, path: "/admin/employees" },
    { name: "Time Sheet", icon: <BiTask />, path: "#" },
    { name: "Leave", icon: <BiCalendarAlt />, path: "/admin/leaves" },
    { name: "Payroll", icon: <BiDollarCircle />, path: "#" },
    { name: "Projects", icon: <BiBarChartAlt2 />, path: "#" },
    { name: "Calendar", icon: <BiCalendar />, path: "#" },
    { name: "Message", icon: <BiMessageDetail />, path: "#" },
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
