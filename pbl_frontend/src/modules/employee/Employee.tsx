import React from "react";
import { Outlet } from "react-router-dom";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import ContentWrapper from "../../components/ContentWrapper";
import Sidebar from "../../components/Sidebar";
import PageWrapper from "../../components/PageWrapper";
import {
  BiCalendar,
  BiCalendarAlt,
  BiDollarCircle,
  BiMessageDetail,
  BiTask,
} from "react-icons/bi";

export const Employee: React.FunctionComponent = () => {
  const employeeSideBarItems = [
    { name: "Time Sheet", icon: <BiTask />, path: "#" },
    { name: "Leave", icon: <BiCalendarAlt />, path: "#" },
    { name: "Payroll", icon: <BiDollarCircle />, path: "#" },
    { name: "Calendar", icon: <BiCalendar />, path: "#" },
    { name: "Message", icon: <BiMessageDetail />, path: "" },
  ];
  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        <Sidebar sideBarItems={employeeSideBarItems} />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default Employee;
