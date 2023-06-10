import React from "react";
import { Outlet } from "react-router-dom";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import ContentWrapper from "../../components/ContentWrapper";
import Sidebar from "../../components/Sidebar";
import PageWrapper from "../../components/PageWrapper";
import { BiCalendarAlt, BiTask } from "react-icons/bi";

export const Employee: React.FunctionComponent = () => {
  const employeeSideBarItems = [
    { name: "Chấm công", icon: <BiTask />, path: "/employee/time-sheet" },
    { name: "Nghỉ phép", icon: <BiCalendarAlt />, path: "/employee/leaves" },
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
