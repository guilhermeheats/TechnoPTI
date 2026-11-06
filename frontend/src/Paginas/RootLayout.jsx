import Cabecalho from "../componentes/Cabecalho.jsx";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@chakra-ui/react";
function RootLayout() {
  return (
    <>
      <Box
        minH="100vh"
        bgImage="url('/background.png')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Cabecalho />
        <Container
          maxW="2xl"
          pt="15px"
          pb="40px"
          px="40px"
          mx="auto"
          mt="6vh"
          bg="rgba(255, 255, 255, 0.85)"
          borderRadius="20px"
          boxShadow="2xl"
        >
          <Outlet />
        </Container>
      </Box>
    </>
  );
}

export default RootLayout;
