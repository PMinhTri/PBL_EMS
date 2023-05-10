import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Container from "../../components/Container";

const HomePage: React.FunctionComponent = () => {
  return (
    <Container>
      <Navbar />
      <Sidebar />
    </Container>
  );
};

export default HomePage;
