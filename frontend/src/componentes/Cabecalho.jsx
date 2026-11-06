import { Heading, Box, Flex, Spacer, Button, Image } from "@chakra-ui/react";
import { LuHouse } from "react-icons/lu";
import { Link } from "react-router-dom";

function Cabecalho() {
  return (
    <Box bg="rgba(93, 93, 93, 0.85)" h="70px" px="10px">
      <Flex justify="center" align="center" h="100%">
        <Image src="/technopti-logo.png" h="70px" w="70px" />
        <Heading color="white">Technopti</Heading>
        <Spacer></Spacer>
        <Link to="/">
          <Button
            color="white"
            m="10px"
            textAlign="center"
            _hover={{ color: "black" }}
            _active={{ bg: "white", color: "black" }}
            variant="ghost"
          >
            <LuHouse style={{ marginRight: "5px" }} />
            Voltar para Home
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default Cabecalho;
