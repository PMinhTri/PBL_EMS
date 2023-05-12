import React from "react";
import { Outlet } from "react-router-dom";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import ContentWrapper from "../../components/ContentWrapper";
import Sidebar from "../../components/Sidebar";
import PageWrapper from "../../components/PageWrapper";

const Admin: React.FunctionComponent = () => {
  return (
    <>
      <Container>
        <Navbar />
        <ContentWrapper>
          <Sidebar />
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </ContentWrapper>
      </Container>
    </>
  );
};

export default Admin;
