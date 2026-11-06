import { Card, Button, Heading, HStack, Text } from "@chakra-ui/react";
import { LuMinus } from "react-icons/lu";

function CardRestricao(props) {
  return (
    <Card.Root h="45px" mb="5px" pr="1" pl="10px" minW="70vh" bg={props.color}>
      <HStack justify="space-between" align="center" h="100%">
        <Heading size="lg" mr="10px">
          {props.nome}
        </Heading>
        <Text mr="1px">Limite: {props.limite}</Text>
        {props.onRemover && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            minW="auto"
            px="1"
            _hover={{ bg: "red.50" }}
            onClick={props.onRemover}
          >
            <LuMinus color="red" />
          </Button>
        )}
      </HStack>
    </Card.Root>
  );
}
export default CardRestricao;
