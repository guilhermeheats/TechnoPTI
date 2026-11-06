import { useState, useRef } from "react";
import api from "../api";
import html2pdf from "html2pdf.js";
import {
  Field,
  Box,
  HStack,
  Status,
  VStack,
  Text,
  Separator,
  Heading,
  Button,
  Stat,
  List,
  Portal,
  Dialog,
  CloseButton,
  Table,
  Flex,
} from "@chakra-ui/react";

import { LuFileText, LuTrash, LuCheck, LuX } from "react-icons/lu";
import GraficoPizza from "./GraficoPizza.jsx";

function formatarNumero(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function CardProblema({ lista, onRemover, carregando }) {
  const [problemaAtivo, setProblemaAtivo] = useState(null);
  const [detalhes, setDetalhes] = useState(null);
  const [infoProblema, setInfoProblema] = useState(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const conteudoModalRef = useRef();

  const abrirRelatorioDoProblema = async (item) => {
    setProblemaAtivo(item);
    setCarregandoDetalhes(true);
    setDetalhes(null);
    setInfoProblema(null);

    const dispararChamadas = () =>
      Promise.all([
        api.get(`/problems/${item.id}`),
        api.get(`/problems/${item.id}/result`),
      ]);

    try {
      const [resEstrutura, resMatematica] = await dispararChamadas();
      setInfoProblema(resEstrutura.data);
      setDetalhes(resMatematica.data);
    } catch {
      console.warn("Lentidão detectada. Aguardando o HD respirar...");

      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const [resEstrutura, resMatematica] = await dispararChamadas();
        setInfoProblema(resEstrutura.data);
        setDetalhes(resMatematica.data);
      } catch (erroReal) {
        console.error("Erro definitivo no servidor:", erroReal);
      }
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const exportarPDFDoModal = async () => {
    const elemento = conteudoModalRef.current;
    if (!elemento) return;

    // Reduz o padding apenas durante a captura para o relatório caber em uma página A4.
    const paddingOriginal = elemento.style.padding;
    elemento.style.padding = "8px";

    const opcoes = {
      margin: [10, 10, 10, 10],
      filename: `relatorio-otimizacao-${problemaAtivo?.nome || ""}.pdf`,
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

    try {
      await html2pdf().set(opcoes).from(elemento).save();
    } finally {
      elemento.style.padding = paddingOriginal;
    }
  };

  return (
    <>
      <Dialog.Root size="5xl" placement="center" motionPreset="slide-in-bottom">
        <Field.Root>
          <Field.Label>Clique no problema para ver detalhes.</Field.Label>
          <List.Root>
            {lista.map((item) => {
              const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
              }).format(new Date(item.data_criacao));

              return (
                <List.Item mb="10px" key={item.id}>
                  <Box
                    borderRadius="10px"
                    color="gray.200"
                    border="2px solid #8b8b8b"
                    bg="#505050"
                    p="10px"
                    minW="550px"
                    boxShadow="xl"
                  >
                    <HStack gap="30px" w="100%" align="center">
                      <Status.Root
                        colorPalette={item.resolvido ? "green" : "red"}
                      >
                        <VStack spaceY="0" align="center">
                          <Status.Indicator />{" "}
                          <Text fontSize="10px">
                            {item.resolvido ? "Solucionado!" : "Sem resposta"}
                          </Text>
                        </VStack>
                      </Status.Root>

                      <Separator orientation="vertical" h="45px" />

                      <VStack align="start" spaceY="0">
                        <Dialog.Trigger asChild>
                          <Heading
                            size="lg"
                            cursor="pointer"
                            _hover={{ color: "#c0c0c0" }}
                            textDecoration="underline"
                            textUnderlineOffset="4px"
                            onClick={() => abrirRelatorioDoProblema(item)}
                          >
                            {item.nome}
                          </Heading>
                        </Dialog.Trigger>

                        <Text fontSize="12px">Criado em: {dataFormatada}</Text>
                      </VStack>

                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <Button
                            ml="auto"
                            variant="surface"
                            colorPalette="red"
                            size="sm"
                          >
                            <LuTrash color="red" />
                          </Button>
                        </Dialog.Trigger>
                        <Portal>
                          <Dialog.Backdrop />
                          <Dialog.Positioner>
                            <Dialog.Content>
                              <Dialog.Header>
                                <Dialog.Title>Confirmação</Dialog.Title>
                              </Dialog.Header>
                              <Dialog.Body>
                                <p>
                                  <strong>
                                    Isso apagará o problema permanentemente.
                                  </strong>{" "}
                                  Tem certeza?
                                </p>
                              </Dialog.Body>
                              <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                  <Button variant="outline">
                                    Não, cancelar
                                  </Button>
                                </Dialog.ActionTrigger>
                                <Button
                                  bg="#c81818"
                                  _hover={{ bg: "#a41414" }}
                                  _active={{ bg: "#851010" }}
                                  onClick={() => onRemover(item.id)}
                                  disabled={carregando}
                                >
                                  Sim, apagar
                                </Button>
                              </Dialog.Footer>
                              <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                              </Dialog.CloseTrigger>
                            </Dialog.Content>
                          </Dialog.Positioner>
                        </Portal>
                      </Dialog.Root>
                    </HStack>

                    <Separator my="10px" />

                    <HStack gap="30px">
                      <Stat.Root>
                        <Stat.Label color="gray.200" fontSize="15px">
                          Objetivo
                        </Stat.Label>
                        <Stat.ValueText fontSize="17px" lineHeight="1">
                          {item.objetivo === "maximize" && "Maximização"}
                          {item.objetivo === "minimize" && "Minimização"}
                        </Stat.ValueText>
                      </Stat.Root>
                    </HStack>
                  </Box>
                </List.Item>
              );
            })}
          </List.Root>
        </Field.Root>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            {/* maxH e overflowY evitam que a análise detalhada suma em telas pequenas */}
            <Dialog.Content maxH="95vh" overflowY="auto">
              <Dialog.Header>
                <Dialog.Title>
                  Dados: {problemaAtivo ? problemaAtivo.nome : "Carregando..."}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body>
                {carregandoDetalhes ? (
                  <Text
                    color="white"
                    textAlign="center"
                    p="6"
                    fontWeight="bold"
                  >
                    Processando...
                  </Text>
                ) : detalhes?.status === "Optimal" ? (
                  <>
                    <Box
                      ref={conteudoModalRef}
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

                      <HStack gap="30px" align="start">
                        <VStack align="stretch" w="45%">
                          <Field.Root>
                            <Field.Label fontWeight="bold">
                              Função Objetiva:
                            </Field.Label>
                            <Text fontSize="md">
                              {infoProblema?.objetivo === "minimize"
                                ? "Min"
                                : "Max"}
                              Z ={" "}
                              {infoProblema?.variaveis?.map(
                                (variavel, index) => (
                                  <span key={variavel.id || index}>
                                    {variavel.coeficiente_objetivo} ·{" "}
                                    {variavel.nome}
                                    {index < infoProblema.variaveis.length - 1
                                      ? " + "
                                      : ""}
                                  </span>
                                ),
                              )}
                            </Text>
                          </Field.Root>

                          <Box
                            mt="6"
                            pt="4"
                            borderTop="1px solid"
                            borderColor="gray.700"
                          >
                            <Text
                              fontWeight="bold"
                              color="gray.700"
                              mb="3"
                              fontSize="md"
                            >
                              sujeito às restrições:
                            </Text>
                            <VStack align="stretch" spaceY={3}>
                              {infoProblema?.restricoes?.map((restricao, i) => (
                                <Box key={restricao.id || i} fontSize="sm">
                                  <Text as="span" fontWeight="bold" mr="2">
                                    {restricao.nome}:
                                  </Text>
                                  {restricao.coeficientes?.map((coef, j) => {
                                    const nomeDaVariavel =
                                      infoProblema?.variaveis[j]?.nome ||
                                      `X${j + 1}`;
                                    return (
                                      <span key={j}>
                                        {coef.valor}·{nomeDaVariavel}
                                        {j < restricao.coeficientes.length - 1
                                          ? " + "
                                          : ""}
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

                        <VStack flex="1" align="stretch" w="100%" ml="30px">
                          <Table.Root
                            striped
                            borderRadius="10px"
                            border="2px solid"
                            borderColor="gray.500"
                            size="sm"
                          >
                            <Table.Caption
                              captionSide="top"
                              mb="5px"
                              color="black"
                              fontWeight="medium"
                            >
                              Quantidade a ser vendida de cada variável de modo
                              a otimizar os resultados:
                            </Table.Caption>
                            <Table.Header>
                              <Table.Row bg="gray.400">
                                <Table.ColumnHeader color="black">
                                  Variável
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color="black">
                                  Quantidade Ótima
                                </Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body bg="white">
                              {Object.entries(detalhes?.variaveis || {}).map(
                                ([nome, valor], index) => {
                                  const variavelCorrespondente =
                                    infoProblema?.variaveis?.find(
                                      (v) => v.nome === nome,
                                    );
                                  const unidadeMedida =
                                    variavelCorrespondente?.unidade_medida ||
                                    "unidades";
                                  return (
                                    <Table.Row key={index}>
                                      <Table.Cell color="black">
                                        {nome}
                                      </Table.Cell>

                                      <Table.Cell
                                        color="black"
                                        fontWeight="bold"
                                      >
                                        {Math.round(valor).toLocaleString(
                                          "pt-BR",
                                        )}{" "}
                                        {unidadeMedida}
                                      </Table.Cell>
                                    </Table.Row>
                                  );
                                },
                              )}
                            </Table.Body>
                          </Table.Root>

                          <Box
                            borderRadius="5px"
                            bg="gray.600"
                            minW="250px"
                            h="auto"
                            pl="10px"
                            mt="15px"
                            border="2px solid"
                            borderColor="gray.400"
                          >
                            <HStack justify="space-between" pr="5px">
                              <Text color="gray.200" fontSize="md">
                                {infoProblema?.objetivo === "minimize"
                                  ? "Custo mínimo a ser pago:"
                                  : "Lucro ótimo a ser obtido:"}
                              </Text>
                              <Box
                                bg="black"
                                m="10px"
                                borderRadius="5px"
                                p="10px"
                                w="12em"
                              >
                                <Text
                                  fontWeight="bold"
                                  color="white"
                                  textAlign="center"
                                >
                                  R$ {formatarNumero(detalhes.valor_objetivo)}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>

                          <GraficoPizza variaveis={detalhes?.variaveis} />
                        </VStack>
                      </HStack>

                      <Table.Root
                        borderRadius="10px"
                        border="2px solid"
                        borderColor="gray.500"
                        striped
                        mt="6"
                        size="sm"
                      >
                        <Table.Caption
                          captionSide="top"
                          mb="5px"
                          color="black"
                          fontWeight="bold"
                        >
                          Análise detalhada das restrições:
                        </Table.Caption>
                        <Table.Header lineHeight="1.1">
                          <Table.Row bg="gray.400">
                            <Table.ColumnHeader color="black">
                              Restrição atendida?
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color="black">
                              Restrição
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color="black">
                              Uso do limite máximo
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color="black">
                              Limite máximo
                            </Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body bg="white">
                          {detalhes?.restricoes.map((restricao) => (
                            <Table.Row key={restricao.id}>
                              <Table.Cell>
                                {restricao.atendida ? (
                                  <HStack color="green.500" fontWeight="bold">
                                    <LuCheck /> Sim!
                                  </HStack>
                                ) : (
                                  <HStack color="red.500" fontWeight="bold">
                                    <LuX /> Não!
                                  </HStack>
                                )}
                              </Table.Cell>
                              <Table.Cell color="black">
                                {restricao.nome}
                              </Table.Cell>
                              <Table.Cell
                                color={
                                  restricao.atendida ? "green.500" : "red.500"
                                }
                              >
                                {Math.round(restricao.uso)}
                              </Table.Cell>
                              <Table.Cell
                                color={
                                  restricao.atendida ? "green.500" : "red.500"
                                }
                                fontWeight="bold"
                              >
                                {Math.round(restricao.limite)}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </Box>

                    <Flex justify="flex-end" w="100%" mt="4">
                      <Button
                        bg="#28aa28"
                        _hover={{ bg: "#1e821e" }}
                        _active={{ bg: "#1a701a" }}
                        color="white"
                        onClick={exportarPDFDoModal}
                      >
                        <LuFileText /> Exportar como PDF
                      </Button>
                    </Flex>
                  </>
                ) : detalhes?.status === "Infeasible" ? (
                  <VStack p="6" spaceY="4">
                    <Heading
                      as="h1"
                      size="2xl"
                      color="red.500"
                      textAlign="center"
                    >
                      Não existe solução viável para seu problema.
                    </Heading>
                    <Text fontSize="lg" textAlign="center" color="gray.300">
                      Isso acontece pois as suas regras entram em conflito,
                      tornando impossível atender a tudo ao mesmo tempo. Reduza
                      as exigências ou dê mais recursos e tente novamente.
                    </Text>
                  </VStack>
                ) : detalhes?.status === "Unbounded" ? (
                  <VStack p="6" spaceY="4">
                    <Heading
                      as="h1"
                      size="2xl"
                      color="orange.500"
                      textAlign="center"
                    >
                      Não foi possível encontrar uma solução para seu
                      problema...
                    </Heading>
                    <Text fontSize="lg" textAlign="center" color="gray.300">
                      Isso acontece pois o problema ficou sem um limite real,
                      fazendo com que o resultado ou lucro cresça infinitamente
                      na matemática pura. Adicione alguma restrição de escassez
                      (como limite de estoque ou tempo) e tente novamente.
                    </Text>
                  </VStack>
                ) : (
                  <VStack p="6" spaceY="4">
                    <Heading
                      as="h1"
                      size="2xl"
                      color="gray.400"
                      textAlign="center"
                    >
                      Ocorreu um erro
                    </Heading>
                    <Text fontSize="lg" textAlign="center" color="gray.300">
                      Ocorreu um erro ao carregar. Tente novamente.
                    </Text>
                  </VStack>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default CardProblema;
