import {
  Field,
  HStack,
  Input,
  RadioCard,
  VStack,
  Box,
  Button,
  Strong,
  Spacer,
  Flex,
  Portal,
  Dialog,
  CloseButton,
  FieldRequiredIndicator,
  HoverCard,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Abas from "../componentes/Abas.jsx";
import TelaResultado from "./TelaResultado.jsx";
import BotaoAjuda from "../componentes/BotaoAjuda.jsx";
import TelaVisaoGeral from "./TelaVisaoGeral.jsx";
import api from "../api";
import { LuArrowLeft, LuArrowRight, LuHouse, LuX } from "react-icons/lu";
import { toaster } from "../components/ui/toaster.jsx";

function Problema() {
  const [etapa, setEtapa] = useState(1);
  const [dados, setDados] = useState({
    nome: "",
    tipo: "max",
  });

  const [variaveis, setVariaveis] = useState([]);
  const [restricoes, setRestricoes] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [jsonPost, setJsonPost] = useState(null);
  const [calculoPronto, setCalculoPronto] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const validarEtapa1 = !dados.nome.trim();
  const restricoesManuais = restricoes.filter(
    (r) => !r.nome.includes("Não-negatividade"),
  );

  const validarEtapa2 =
    variaveis.length === 0 || restricoesManuais.length === 0;

  const opcoesTipo = [
    { nome: "Maximização", valor: "max" },
    { nome: "Minimização", valor: "min" },
  ];

  function enviarAoBack() {
    setCarregando(true);
    const dataCriacao = new Date();

    const restricoesReais = restricoes.filter(
      (r) => !r.nome.includes("Não-negatividade"),
    );

    const restricoesFormatadas = restricoesReais.map((restricao) => {
      const listaDeNumerosPuros = variaveis.map((v) => {
        const vinculo = restricao.coeficientes?.find(
          (c) => c.variavel_id === v.id,
        );

        return vinculo ? Number(vinculo.valor) : 0;
      });

      return {
        nome: restricao.nome,
        operador: restricao.operador || "<=",
        limite: Number(restricao.limite),
        coeficientes: listaDeNumerosPuros,
      };
    });

    const jsonFinal = {
      data_criacao: dataCriacao.toISOString(),
      nome: dados.nome,
      objetivo: dados.tipo === "max" ? "maximize" : "minimize",
      variaveis: variaveis.map((v) => ({
        nome: v.nome,
        coeficiente_objetivo: Number(v.coeficiente_objetivo),
        unidade_medida: v.unidade_medida,
      })),
      restricoes: restricoesFormatadas,
    };
    setJsonPost(jsonFinal);
    api
      .post("/problems/create", jsonFinal)
      .then((resposta) => {
        calcularSimplex(resposta);
      })
      .catch(() => {
        mostrarToast({
          title: "Erro!",
          description:
            "Ocorreu um erro ao calcular. Verifique as variáveis e as restrições.",
          type: "error",
          duration: 3000,
        });
      });
  }

  function mostrarToast(atributos) {
    toaster.create(atributos);
  }

  function calcularSimplex(respostaApi) {
    const idProblema = respostaApi.data.id;
    api
      .post(`/problems/${idProblema}/solve`, respostaApi)
      .then((res) => {
        setResultado(res.data);
        setCalculoPronto(true);
        setEtapa(4);
      })
      .catch((erro) => {
        console.log(erro);
      })
      .finally(setCarregando(false));
    mostrarToast({
      title: "Sucesso!",
      description: "Problema salvo com sucesso!",
      duration: 3000,
      type: "success",
    });
  }

  return (
    <Box maxW="xl" mx="auto" mt="10">
      {etapa === 1 && (
        <VStack>
          <Field.Root required>
            <Field.Label>
              Nome do Problema <FieldRequiredIndicator />
            </Field.Label>

            <Input
              name="inputNome"
              type="text"
              placeholder="Ex: Meu Problema"
              variant="outline"
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              fontWeight="bold"
              border="2px solid"
            />
            <Field.HelperText>
              Esse é o nome que aparecerá na sua lista de problemas.
            </Field.HelperText>
          </Field.Root>

          <Field.Root required mt="4">
            <RadioCard.Root
              value={dados.tipo}
              onValueChange={(e) => setDados({ ...dados, tipo: e.value })}
            >
              <HStack gap="10px">
                <RadioCard.Label>Objetivo do problema</RadioCard.Label>
                <BotaoAjuda>
                  <>
                    Define o <Strong color="blue.500">foco principal</Strong> da
                    sua otimização. Escolha <Strong>Maximização</Strong> se o
                    seu objetivo for extrair o maior ganho ou faturamento
                    possível. Escolha <Strong>Minimização</Strong> se a meta for
                    reduzir gastos, tempo ou desperdício ao menor nível.
                    <Box
                      mt="2"
                      p="2"
                      bg="gray.100"
                      borderRadius="sm"
                      borderLeft="3px solid"
                      borderColor="blue.400"
                      fontSize="xs"
                    >
                      <Strong>Exemplo:</Strong> Maximizar o lucro da venda de
                      serviços de tecnologia ou Minimizar o custo total de
                      infraestrutura.
                    </Box>
                  </>
                </BotaoAjuda>
              </HStack>
              <HStack align="stretch" gap="30px">
                {opcoesTipo.map((opcao) => (
                  <RadioCard.Item
                    cursor="pointer"
                    value={opcao.valor}
                    key={opcao.valor}
                    flex="1"
                  >
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemText>{opcao.nome}</RadioCard.ItemText>
                      <RadioCard.ItemIndicator cursor="pointer" />
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </HStack>
            </RadioCard.Root>

            <HStack gap="40px" mt="6">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button
                    bg="#c81818"
                    w="10rem"
                    _hover={{ bg: "#a41414" }}
                    _active={{ bg: "#851010" }}
                  >
                    <LuX />
                    Cancelar
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
                          <Strong>Todos os dados serão perdidos. </Strong>Deseja
                          mesmo cancelar?
                        </p>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">Não, continuar</Button>
                        </Dialog.ActionTrigger>
                        <Link to="/">
                          <Button
                            bg="#c81818"
                            _hover={{ bg: "#a41414" }}
                            _active={{ bg: "#851010" }}
                          >
                            Sim, cancelar
                          </Button>
                        </Link>
                      </Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

              <Button
                bg="#28aa28"
                _hover={{ bg: "#1e821e" }}
                _active={{ bg: "#1a701a" }}
                onClick={() => setEtapa(2)}
                w="10rem"
                disabled={validarEtapa1}
              >
                Seguinte <LuArrowRight />
              </Button>
            </HStack>
          </Field.Root>
        </VStack>
      )}

      {etapa === 2 && (
        <>
          <Abas
            variaveis={variaveis}
            setVariaveis={setVariaveis}
            restricoes={restricoes}
            setRestricoes={setRestricoes}
          />

          <Box mt="6" p="4" borderRadius="md">
            <HStack>
              <Button
                bg="#c81818"
                _hover={{ bg: "#a41414" }}
                _active={{ bg: "#851010" }}
                w="10rem"
                mr="40px"
                onClick={() => setEtapa(1)}
              >
                <LuArrowLeft />
                Voltar
              </Button>

              <HoverCard.Root
                openDelay={300}
                closeDelay={300}
                open={validarEtapa2 ? undefined : false}
              >
                <HoverCard.Trigger asChild>
                  <Box w="fit-content">
                    <Button
                      bg="#28aa28"
                      _hover={{ bg: "#1e821e" }}
                      _active={{ bg: "#1a701a" }}
                      onClick={() => setEtapa(3)}
                      w="10rem"
                      fontWeight="bold"
                      disabled={validarEtapa2}
                    >
                      Seguinte <LuArrowRight />
                    </Button>
                  </Box>
                </HoverCard.Trigger>
                <Portal>
                  <HoverCard.Positioner>
                    <HoverCard.Content
                      bg="gray.900"
                      borderColor="gray.800"
                      p="4"
                      borderRadius="xl"
                      boxShadow="2xl"
                      maxW="280px"
                    >
                      <VStack align="start" spaceY={2}>
                        <Text fontSize="xs" color="gray.300" lineHeight="short">
                          {"\u00C9"} necessário adicionar ao menos{" "}
                          <strong>1 variável</strong> e{" "}
                          <strong>1 restrição</strong> para prosseguir.
                        </Text>
                      </VStack>
                    </HoverCard.Content>
                  </HoverCard.Positioner>
                </Portal>
              </HoverCard.Root>
            </HStack>
          </Box>
        </>
      )}
      {etapa === 3 && (
        <>
          <TelaVisaoGeral
            variaveis={variaveis}
            restricoes={restricoes}
            dados={dados}
          />
          <Flex mt="30px">
            <Button
              onClick={() => setEtapa(2)}
              bg="#c81818"
              w="10rem"
              _hover={{ bg: "#a41414" }}
              _active={{ bg: "#851010" }}
            >
              <LuArrowLeft />
              Voltar
            </Button>
            <Spacer />
            <Button
              bg="#28aa28"
              _hover={{ bg: "#1e821e" }}
              _active={{ bg: "#1a701a" }}
              onClick={enviarAoBack}
              w="11rem"
              disabled={carregando}
            >
              Calcular
            </Button>
          </Flex>
        </>
      )}
      {calculoPronto === true && etapa === 4 && (
        <>
          <TelaResultado
            res={resultado}
            jsonPost={jsonPost}
            objetivo={dados.tipo}
          />
          <Link to="/">
            <Button
              bg="#747474"
              w="10rem"
              _hover={{ bg: "#585858" }}
              _active={{ bg: "#464646" }}
              mt="10px"
            >
              <LuHouse />
              Voltar para Home
            </Button>
          </Link>
        </>
      )}
      {carregando && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.7)"
          backdropFilter="blur(4px)"
          zIndex="9999"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <VStack spaceY="4">
            <Spinner size="xl" color="#28aa28" thickness="4px" />
            <Text color="white" fontWeight="bold" fontSize="lg">
              Estamos calculando suas respostas ótimas. Por favor, aguarde...
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default Problema;
