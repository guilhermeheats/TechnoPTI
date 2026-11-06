import {
  Field,
  Heading,
  Flex,
  Text,
  VStack,
  List,
  ListItem,
  Box,
  Strong,
} from "@chakra-ui/react";

function TelaVisaoGeral({ variaveis = [], restricoes = [], dados }) {
  return (
    <>
      <Flex alignItems="center" justify="center">
        <VStack>
          <Heading size="2xl">Visão Geral</Heading>
          <Text>
            Revise as informações. Caso estejam corretas, clique em "Calcular"
            para calcular suas respostas ótimas.
          </Text>
        </VStack>
      </Flex>
      <Flex
        gap="40px"
        mt="30px"
        bg="gray.300"
        borderRadius="10px"
        p="10px"
        border="2px solid #c6c6c6"
        boxShadow="md"
        alignItems="center"
      >
        <Text>
          <Strong>Nome do problema:</Strong> {dados.nome}
        </Text>
        <Box w="1px" h="30px" bg="gray.00" opacity={0.6} />
        <Text>
          <Strong>Objetivo: </Strong>
          {dados.tipo === "max" ? "Maximização" : "Minimização"}
        </Text>
      </Flex>
      <Flex gap="20px">
        <Field.Root mt="20px">
          <Field.Label>Variáveis adicionadas:</Field.Label>
          <List.Root listStyle="none">
            {variaveis.map((variavel) => {
              return (
                <ListItem mb="5px" key={variavel.id}>
                  <Box
                    p="10px"
                    bg="gray.300"
                    boxShadow="2xl"
                    borderRadius="10px"
                    border="2px solid #c6c6c6"
                  >
                    <Flex gap="20px">
                      <Heading size="md" color="blue.800">
                        {variavel.nome}
                      </Heading>
                      <Text>
                        Coeficiente:{" "}
                        <Strong>{variavel.coeficiente_objetivo}</Strong>
                      </Text>
                    </Flex>
                  </Box>
                </ListItem>
              );
            })}
          </List.Root>
        </Field.Root>
        <Field.Root mt="20px">
          <Field.Label>Restrições adicionadas:</Field.Label>
          <List.Root listStyle="none">
            {restricoes.map((restricao) => {
              const ehNaoNegatividade =
                restricao.nome.includes("Não-negatividade");
              return ehNaoNegatividade ? null : (
                <ListItem mb="5px" key={restricao.id}>
                  <Box
                    p="10px"
                    bg="gray.300"
                    boxShadow="2xl"
                    borderRadius="10px"
                    border="2px solid #c6c6c6"
                  >
                    <Flex gap="20px" alignItems="center" justify="center">
                      <Heading size="md">{restricao.nome}</Heading>

                      <List.Root listStyle="none">
                        <VStack>
                          {restricao.coeficientes?.map((variavel, index) => (
                            <ListItem key={index}>
                              {variavel.valor} · {variavel.nome}
                            </ListItem>
                          ))}
                        </VStack>
                      </List.Root>

                      <Text color="green.700" fontWeight="bold">
                        {restricao.operador} {restricao.limite}
                      </Text>
                    </Flex>
                  </Box>
                </ListItem>
              );
            })}
          </List.Root>
        </Field.Root>
      </Flex>
    </>
  );
}

export default TelaVisaoGeral;
