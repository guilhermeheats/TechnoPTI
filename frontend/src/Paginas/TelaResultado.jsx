import {
  Heading,
  Box,
  Button,
  Field,
  Text,
  VStack,
  HStack,
  Table,
} from "@chakra-ui/react";
import GraficoPizza from "../componentes/GraficoPizza.jsx";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import { LuCheck, LuFileText, LuX } from "react-icons/lu";

function formatarNumero(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function TelaResultado({ res, jsonPost, objetivo }) {
  const conteudoRef = useRef();
  if (res?.status === "Optimal") {
    const exportarPDF = () => {
      const elemento = conteudoRef.current;

      const opcoes = {
        margin: [10, 10, 10, 10],
        filename: `relatorio-otimizacao-${jsonPost?.nome || ""}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#1A202C",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      html2pdf().set(opcoes).from(elemento).save();
    };
    return (
      <>
        <Box
          ref={conteudoRef}
          w="100%"
          p="4"
          style={{
            backgroundColor: "#c3c3c3",
            color: "black",
          }}
          borderRadius="xl"
        >
          <Heading
            as="h1"
            size="2xl"
            mb="2"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Foi encontrada uma solução.
          </Heading>
          <Heading
            as="h3"
            size="lg"
            mb="6"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Todas as restrições foram satisfeitas.
          </Heading>
          <HStack gap="30px">
            <VStack>
              <Field.Root>
                <Field.Label fontWeight="bold">Função Objetiva:</Field.Label>

                <Text fontSize="lg">
                  {objetivo === "minimize" ? "Min" : "Max"}Z ={" "}
                  {jsonPost?.variaveis?.map((variavel, index) => (
                    <span key={variavel.id || index}>
                      {variavel.coeficiente_objetivo} · {variavel.nome}
                      {index < jsonPost.variaveis.length - 1 ? " + " : ""}
                    </span>
                  ))}
                </Text>
              </Field.Root>

              <Box mt="6" pt="4" borderTop="1px solid" borderColor="gray.700">
                <Text fontWeight="bold" color="gray.700" mb="3" fontSize="md">
                  sujeito às restrições:
                </Text>

                <VStack align="stretch" spaceY={3}>
                  {jsonPost?.restricoes?.map((restricao, i) => (
                    <Box key={restricao.id || i}>
                      <Text as="span" fontWeight="bold" mr="2">
                        {restricao.nome}:
                      </Text>

                      {restricao.coeficientes?.map((valorCoeficiente, j) => {
                        const nomeDaVariavel =
                          jsonPost?.variaveis[j]?.nome || `X${j + 1}`;

                        return (
                          <span key={j}>
                            {valorCoeficiente}·{nomeDaVariavel}
                            {j < restricao.coeficientes.length - 1 ? " + " : ""}
                          </span>
                        );
                      })}

                      <Text as="span" fontWeight="bold" ml="2">
                        {restricao.operador} {restricao.limite}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
            <VStack ml="30px">
              <Table.Root
                striped
                borderRadius="10px"
                border="2px solid"
                borderColor="gray.500"
              >
                <Table.Caption captionSide="top" mb="5px">
                  Quantidade a ser vendida de cada variável de modo a otimizar
                  os resultados:
                </Table.Caption>
                <Table.Header>
                  <Table.Row bg="gray.400">
                    <Table.ColumnHeader>Variável</Table.ColumnHeader>
                    <Table.ColumnHeader>Quantidade Ótima</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {Object.entries(res?.variaveis || {}).map(
                    ([nome, valor], index) => {
                      const variavelCorrespondente = jsonPost?.variaveis?.find(
                        (v) => v.nome === nome,
                      );

                      const unidadeMedida =
                        variavelCorrespondente?.unidade_medida || "unidades";
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{nome}</Table.Cell>
                          <Table.Cell>
                            {valor.toLocaleString("pt-BR", {
                              maximumFractionDigits: 2,
                            })}{" "}
                            {unidadeMedida}
                          </Table.Cell>
                        </Table.Row>
                      );
                    },
                  )}
                </Table.Body>
                <Table.Footer></Table.Footer>
              </Table.Root>

              <Box
                borderRadius="5px"
                bg="gray.600"
                w="250px"
                h="auto"
                pl="10px"
                mt="15px"
                border="2px solid"
                borderColor="gray.400"
              >
                <HStack>
                  <Text mr="20px" color="gray.200">
                    {objetivo === "minimize"
                      ? "Custo mínimo a ser pago:"
                      : "Lucro ótimo a ser obtido:"}
                  </Text>

                  <Box bg="black" m="10px" borderRadius="5px" p="10px" w="12em">
                    {" "}
                    <Text fontWeight="bold" color="white">
                      R$ {formatarNumero(res.valor_objetivo)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <GraficoPizza variaveis={res?.variaveis} />
            </VStack>
          </HStack>
          <Table.Root
            borderRadius="10px"
            border="2px solid"
            borderColor="gray.500"
            striped
          >
            <Table.Caption captionSide="top" mb="5px">
              Análise detalhada das restrições:
            </Table.Caption>
            <Table.Header lineHeight="1.1">
              <Table.Row bg="gray.400">
                <Table.ColumnHeader>Restrição atendida?</Table.ColumnHeader>
                <Table.ColumnHeader>Restrição</Table.ColumnHeader>
                <Table.ColumnHeader>Uso do limite máximo</Table.ColumnHeader>
                <Table.ColumnHeader>Limite máximo</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {res?.restricoes.map((restricao) => (
                <Table.Row key={restricao.id}>
                  <Table.Cell>
                    {restricao.atendida ? (
                      <>
                        <HStack color="green.500">
                          <LuCheck /> Sim!
                        </HStack>
                      </>
                    ) : (
                      <>
                        <HStack color="red.500">
                          <LuX /> Não!
                        </HStack>
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>{restricao.nome}</Table.Cell>
                  <Table.Cell>
                    {restricao.atendida ? (
                      <>
                        <Text color="green.500">{restricao.uso}</Text>
                      </>
                    ) : (
                      <>
                        <Text color="red.500">{restricao.uso}</Text>
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {restricao.atendida ? (
                      <>
                        <Text color="green.500" fontWeight="bold">
                          {restricao.limite}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text color="red.500" fontWeight="bold">
                          {restricao.limite}
                        </Text>
                      </>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        <Button
          bg="#28aa28"
          _hover={{ bg: "#1e821e" }}
          _active={{ bg: "#1a701a" }}
          onClick={exportarPDF}
          mr="230px"
          mt="10px"
        >
          <LuFileText /> Exportar como PDF
        </Button>
      </>
    );
  } else if (res?.status === "Infeasible") {
    return (
      <>
        <Heading
          as="h1"
          size="2xl"
          mb="6"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Não existe solução viável para seu problema.
        </Heading>
        <Text
          size="lg"
          mb="8"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Isso acontece pois as suas regras entram em conflito, tornando
          impossível atender a tudo ao mesmo tempo. Reduza as exigências ou dê
          mais recursos e tente novamente.
        </Text>
      </>
    );
  } else if (res?.status === "Unbounded") {
    return (
      <>
        <Heading
          as="h1"
          size="2xl"
          mb="6"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Não foi possível encontrar uma solução para seu problema...
        </Heading>
        <Text
          size="lg"
          mb="8"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Isso acontece pois o problema ficou sem um limite real, fazendo com
          que o resultado ou lucro cresça infinitamente na matemática pura.
          Adicione alguma restrição de escassez (como limite de estoque ou
          tempo) e tente novamente.
        </Text>
      </>
    );
  } else {
    return (
      <>
        <Heading
          as="h1"
          size="2xl"
          mb="6"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Não foi possível encontrar uma solução para seu problema...
        </Heading>
        <Text
          size="lg"
          mb="8"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Ocorreu um erro ao calcular a resposta para seu problema. Verifique as
          variáveis de decisão e as restrições e tente novamente.
        </Text>
      </>
    );
  }
}

export default TelaResultado;
