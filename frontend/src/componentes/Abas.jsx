import { useState } from "react";
import {
  Tabs,
  Heading,
  Field,
  Text,
  Button,
  Drawer,
  Portal,
  CloseButton,
  Input,
  VStack,
  HStack,
  Box,
  Select,
  Strong,
  createListCollection,
  InputGroup,
} from "@chakra-ui/react";
import { LuScale, LuVariable, LuPlus } from "react-icons/lu";

import CardVariavel from "./CardVariavel.jsx";
import CardRestricao from "./CardRestricao.jsx";
import BotaoAjuda from "../componentes/BotaoAjuda.jsx";
import { toaster } from "../components/ui/toaster.jsx";

function Abas({ variaveis, setVariaveis, restricoes, setRestricoes }) {
  const [painelVarAberto, setPainelVarAberto] = useState(false);
  const [painelRestAberto, setPainelRestAberto] = useState(false);

  const [nomeVar, setNomeVar] = useState("");
  const [medidaVar, setMedidaVar] = useState("");
  const [coeficienteVar, setCoeficienteVar] = useState(null);

  const [nomeRest, setNomeRest] = useState("");
  const [operadorRest, setOperadorRest] = useState([]);
  const [limiteRest, setLimiteRest] = useState(null);

  const [varSelecionada, setVarSelecionada] = useState([]);
  const [coefVarRest, setCoefVarRest] = useState("");
  const [coeficientesDaRestricao, setCoeficientesDaRestricao] = useState([]);

  const coeficienteInvalido = !coeficienteVar || Number(coeficienteVar) < 0;
  const operadores = createListCollection({
    items: [
      { nome: "<= (menor ou igual a...)", value: "<=" },
      { nome: "= (igual a...)", value: "=" },
      { nome: ">= (maior ou igual a...)", value: ">=" },
    ],
  });

  const colecaoVariaveis = createListCollection({
    items: variaveis.map((v) => ({ label: v.nome, value: String(v.id) })),
  });

  function handleAdicionarVariavel() {
    const novaVariavel = {
      id: variaveis.length + 1,
      nome: nomeVar,
      coeficiente_objetivo: Number(coeficienteVar),
      unidade_medida: medidaVar,
      problema_id: 1,
    };

    setVariaveis((v) => [...v, novaVariavel]);

    const novaRestricaoNN = {
      nome: `Não-negatividade (${nomeVar})`,
      limite: "≥ 0",
    };

    setRestricoes((r) => [...r, novaRestricaoNN]);

    setNomeVar("");
    setMedidaVar("");
    setCoeficienteVar(null);
    setPainelVarAberto(false);
    mostrarToast({
      title: "Sucesso!",
      description: "Variável adicionada com sucesso!",
      duration: 3000,
      type: "success",
    });
  }

  function handleVincularCoeficiente() {
    if (varSelecionada.length === 0 || !coefVarRest) return;
    const idDaVar = Number(varSelecionada[0]);

    const variavelEncontrada = variaveis.find((v) => v.id === idDaVar);
    const nomeRealDaVar = variavelEncontrada ? variavelEncontrada.nome : "";

    setCoeficientesDaRestricao((prev) => {
      const jaExiste = prev.find((c) => c.variavel_id === idDaVar);
      if (jaExiste) {
        return prev.map((c) =>
          c.variavel_id === idDaVar ? { ...c, valor: Number(coefVarRest) } : c,
        );
      }
      return [
        ...prev,

        {
          valor: Number(coefVarRest),
          variavel_id: idDaVar,
          nome: nomeRealDaVar,
        },
      ];
    });

    setVarSelecionada([]);
    setCoefVarRest("");
  }

  function handleAdicionarRestricao() {
    const operadorReal = operadorRest[0] || "";

    const novaRestricao = {
      id: restricoes.length + 1,
      nome: nomeRest,
      operador: operadorReal,
      limite: Number(limiteRest),
      coeficientes: coeficientesDaRestricao,
      problema_id: 1,
    };

    setRestricoes((r) => [...r, novaRestricao]);

    setNomeRest("");
    setOperadorRest([]);
    setLimiteRest(null);
    setCoeficientesDaRestricao([]);
    setPainelRestAberto(false);
    mostrarToast({
      title: "Sucesso!",
      description: "Restrição adicionada com sucesso!",
      duration: 3000,
      type: "success",
    });
  }

  function removerVariavel(indexAlvo) {
    const variavelDeletada = variaveis[indexAlvo];
    if (!variavelDeletada) return;

    setVariaveis((v) => v.filter((_, i) => i !== indexAlvo));
    setRestricoes((r) =>
      r.filter(
        (rest) => rest.nome !== `Não-negatividade (${variavelDeletada.nome})`,
      ),
    );
  }

  function mostrarToast(atributos) {
    toaster.create(atributos);
  }

  const removerRestricao = (indexAlvo) =>
    setRestricoes((r) => r.filter((_, i) => i !== indexAlvo));
  const variavelSelecionadaObjeto = variaveis.find(
    (v) => String(v.id) === varSelecionada[0],
  );
  return (
    <Tabs.Root defaultValue="variaveis" variant="enclosed">
      <Tabs.List bg="gray.300" w="35rem">
        <Tabs.Trigger value="variaveis" w="20em">
          <LuVariable /> Variáveis de Decisão
        </Tabs.Trigger>
        <Tabs.Trigger value="restricoes" w="20em">
          <LuScale /> Restrições
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="variaveis" py="6">
        <HStack>
          <Heading mb="2">Variáveis (Produtos / Serviços oferecidos) </Heading>
          <BotaoAjuda>
            <>
              São as opções ou serviços que você pode controlar e quer descobrir
              a <Strong color="blue.500">quantidade ideal</Strong> para
              produzir, comprar ou vender. É a resposta que o sistema vai
              calcular para você.
              <Box
                mt="2"
                p="2"
                bg="gray.100"
                borderRadius="sm"
                borderLeft="3px solid"
                borderColor="blue.400"
                fontSize="xs"
              >
                <Strong>Exemplo:</Strong> "Sistema Web", "Cibersegurança" ou
                "App Mobile".
              </Box>
            </>
          </BotaoAjuda>
        </HStack>
        <Text color="gray.600" mb="4">
          Clique no botão abaixo para adicionar uma variável de decisão.
        </Text>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {variaveis.map((item, index) => (
            <li key={index}>
              <CardVariavel
                nome={item.nome}
                coeficiente={item.coeficiente_objetivo}
                onRemover={() => removerVariavel(index)}
              />
            </li>
          ))}
        </ul>

        <Button
          type="button"
          bg="#28aa28"
          _hover={{ bg: "#1e821e" }}
          _active={{ bg: "#1a701a" }}
          w="365px"
          mt="4"
          onClick={() => setPainelVarAberto(true)}
        >
          <LuPlus /> Adicionar Variável
        </Button>

        <Drawer.Root
          open={painelVarAberto}
          onOpenChange={(e) => setPainelVarAberto(e.open)}
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content bg="gray.300">
                <Drawer.Header>
                  <Drawer.Title>Adicionar variáveis</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <VStack spaceY={4} align="stretch">
                    <Field.Root required>
                      <Field.Label>
                        Nome da variável / serviço
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="text"
                        value={nomeVar}
                        placeholder="Ex: Sistema Web"
                        onChange={(e) => setNomeVar(e.target.value)}
                      />
                    </Field.Root>
                    <Field.Root required>
                      <Field.Label>Unidade de medida (opcional)</Field.Label>
                      <Input
                        type="text"
                        value={medidaVar}
                        placeholder="Ex: Contratos, unidades"
                        onChange={(e) => setMedidaVar(e.target.value)}
                      />
                    </Field.Root>
                    <Field.Root required invalid={coeficienteInvalido}>
                      <Field.Label>
                        Coeficiente (valor / custo)
                        <Field.RequiredIndicator />
                        <BotaoAjuda>
                          <>
                            É o valor de impacto financeiro ou de peso que{" "}
                            <Strong color="green.500">uma única unidade</Strong>{" "}
                            dessa variável traz para o seu objetivo final.
                            <Box
                              mt="2"
                              p="2"
                              bg="gray.100"
                              borderRadius="sm"
                              borderLeft="3px solid"
                              borderColor="blue.400"
                              fontSize="xs"
                            >
                              <Strong>Exemplo:</Strong> Se cada "Sistema Web"
                              vendido gera <Strong>R$ 900,00</Strong> de lucro
                              para a empresa, o coeficiente dele será 900.
                            </Box>
                          </>
                        </BotaoAjuda>
                      </Field.Label>
                      <InputGroup startElement="R$ ">
                        <Input
                          type="number"
                          value={coeficienteVar}
                          onChange={(e) => setCoeficienteVar(e.target.value)}
                        />
                      </InputGroup>
                      {coeficienteInvalido && (
                        <Field.ErrorText
                          fontWeight="bold"
                          color="red.400"
                          fontSize="xs"
                        >
                          O coeficiente não pode ser menor que 0.
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  </VStack>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button
                    type="button"
                    bg="#28aa28"
                    _hover={{ bg: "#1e821e" }}
                    _active={{ bg: "#1a701a" }}
                    w="100%"
                    onClick={handleAdicionarVariavel}
                    disabled={coeficienteInvalido || !nomeVar.trim()}
                  >
                    <LuPlus /> Adicionar variável
                  </Button>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Tabs.Content>

      <Tabs.Content value="restricoes" py="6">
        <HStack>
          <Heading mb="2">Restrições / Limitações</Heading>
          <BotaoAjuda>
            <>
              São os <Strong color="red.500">limites e regras</Strong> do mundo
              real que regulam o seu problema.
              <Box
                mt="2"
                p="2"
                bg="gray.100"
                borderRadius="sm"
                borderLeft="3px solid"
                borderColor="blue.400"
                fontSize="xs"
              >
                <Strong>Exemplo:</Strong> Orçamento máximo disponível ou limite
                de horas de trabalho da equipe.
              </Box>
              <Text mt="2" fontSize="xs" color="gray.700">
                O sistema também gerencia as{" "}
                <Strong color="orange.600">
                  Restrições de Não-Negatividade
                </Strong>
                . Elas são regras matemáticas que garantem que os resultados
                finais sejam maiores ou iguais a zero (afinal, no mundo real não
                faz sentido sugerir desenvolver "-10 Sistemas Web").
              </Text>
              <Box
                mt="2"
                p="2"
                bg="gray.100"
                borderRadius="sm"
                borderLeft="3px solid"
                borderColor="green.500"
                fontSize="xs"
              >
                <Strong color="green.700">Praticidade:</Strong> Para facilitar o
                preenchimento, as regras de não-negatividade são criadas{" "}
                <Strong>automaticamente</Strong> ao cadastrar uma nova variável
                de decisão!
              </Box>
            </>
          </BotaoAjuda>
        </HStack>
        <Text color="gray.600" mb="4">
          Clique no botão abaixo para adicionar uma restrição.
        </Text>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {restricoes.map((item, index) => {
            const ehNaoNegatividade = item.nome.includes("Não-negatividade");
            return (
              <li key={index}>
                <CardRestricao
                  nome={item.nome}
                  limite={item.limite}
                  color={ehNaoNegatividade ? "orange.200" : "white"}
                  onRemover={
                    ehNaoNegatividade ? null : () => removerRestricao(index)
                  }
                />
              </li>
            );
          })}
        </ul>

        <Button
          type="button"
          bg="#28aa28"
          _hover={{ bg: "#1e821e" }}
          _active={{ bg: "#1a701a" }}
          w="365px"
          mt="4"
          onClick={() => setPainelRestAberto(true)}
        >
          <LuPlus /> Adicionar Restrição
        </Button>

        <Drawer.Root
          open={painelRestAberto}
          onOpenChange={(e) => setPainelRestAberto(e.open)}
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content bg="gray.300">
                <Drawer.Header>
                  <Drawer.Title>Adicionar restrições</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <VStack spaceY={4} align="stretch">
                    <Field.Root required>
                      <Field.Label>
                        Nome da restrição <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="text"
                        value={nomeRest}
                        placeholder="Ex: Horas de trabalho"
                        onChange={(e) => setNomeRest(e.target.value)}
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label>
                        Operador <Field.RequiredIndicator />
                        <BotaoAjuda>
                          <>
                            Define o{" "}
                            <Strong color="purple.500">tipo de limite</Strong>{" "}
                            da sua regra:
                            <br />• <Strong>
                              &lt;= (Menor ou igual):
                            </Strong>{" "}
                            Você tem um teto máximo de recurso e não pode passar
                            dele.
                            <br />• <Strong>&gt;= (Maior ou igual):</Strong> É
                            uma meta ou exigência mínima que você precisa
                            atingir.
                            <br />• <Strong>= (Igual):</Strong> A produção deve
                            usar exatamente aquele valor, sem sobras.
                          </>
                        </BotaoAjuda>
                      </Field.Label>
                      <Select.Root
                        collection={operadores}
                        size="sm"
                        width="19em"
                        value={operadorRest}
                        onValueChange={(e) => setOperadorRest(e.value)}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Selecione o operador..." />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {operadores.items.map((op) => (
                                <Select.Item item={op} key={op.value}>
                                  {op.nome}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label>
                        Vincular gasto das variáveis <Field.RequiredIndicator />{" "}
                        <BotaoAjuda>
                          <>
                            Indica quanto de recurso{" "}
                            <Strong color="orange.500">
                              uma única unidade
                            </Strong>{" "}
                            da variável selecionada gasta ou exige
                            especificamente dentro desta regra de restrição.
                            <Box
                              mt="2"
                              p="2"
                              bg="gray.100"
                              borderRadius="sm"
                              borderLeft="3px solid"
                              borderColor="blue.400"
                              fontSize="xs"
                            >
                              <Strong>Exemplo:</Strong> Na restrição "Horas de
                              desenvolvedores", se 1 App Mobile precisa de{" "}
                              <Strong>250 horas</Strong> para ser desenvolvido,
                              o vínculo dele nesta regra será 250.
                            </Box>
                          </>
                        </BotaoAjuda>
                      </Field.Label>
                      <Select.Root
                        collection={colecaoVariaveis}
                        size="sm"
                        width="19em"
                        value={varSelecionada}
                        onValueChange={(e) => setVarSelecionada(e.value)}
                        disabled={variaveis.length === 0}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText
                              placeholder={
                                variaveis.length === 0
                                  ? "Adicione variáveis primeiro..."
                                  : "Escolha uma variável..."
                              }
                            />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {colecaoVariaveis.items.map((v) => (
                                <Select.Item item={v} key={v.value}>
                                  {v.label}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                      <Field.HelperText>
                        É possível vincular mais de uma variável.
                      </Field.HelperText>
                    </Field.Root>

                    {varSelecionada.length > 0 && (
                      <Field.Root
                        required
                        invalid={Number(coefVarRest) < 0 || !coefVarRest}
                      >
                        <Box
                          border="1px solid"
                          borderColor="gray.400"
                          p="3"
                          borderRadius="md"
                          bg="white"
                        >
                          <VStack align="stretch" spaceY={2}>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="gray.700"
                            >
                              Gasto de: {variavelSelecionadaObjeto?.nome}{" "}
                              <Field.RequiredIndicator />
                            </Text>

                            <HStack>
                              <VStack>
                                <Input
                                  type="number"
                                  placeholder="Ex: 200"
                                  value={coefVarRest}
                                  onChange={(e) =>
                                    setCoefVarRest(e.target.value)
                                  }
                                />
                                {Number(coefVarRest) < 1 && (
                                  <Field.ErrorText
                                    fontWeight="bold"
                                    color="red.400"
                                    fontSize="2xs"
                                  >
                                    Não pode ser menor que 0.
                                  </Field.ErrorText>
                                )}
                              </VStack>
                              <Button
                                size="sm"
                                bg="#28aa28"
                                _hover={{ bg: "#1e821e" }}
                                _active={{ bg: "#1a701a" }}
                                color="white"
                                onClick={handleVincularCoeficiente}
                                disabled={Number(coefVarRest) < 0}
                              >
                                Vincular
                              </Button>
                            </HStack>
                          </VStack>
                        </Box>
                      </Field.Root>
                    )}

                    {coeficientesDaRestricao.length > 0 && (
                      <Box>
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color="gray.600"
                          mb="1"
                        >
                          Expressão sendo montada:
                        </Text>
                        <HStack wrap="wrap" gap="2">
                          {coeficientesDaRestricao.map((c, i) => (
                            <Box
                              key={i}
                              bg="blue.50"
                              color="blue.700"
                              px="2"
                              py="1"
                              borderRadius="sm"
                              fontSize="xs"
                              fontWeight="bold"
                              border="1px solid"
                              borderColor="blue.200"
                            >
                              {c.valor} · {c.nome}
                            </Box>
                          ))}
                        </HStack>
                      </Box>
                    )}

                    <Field.Root
                      required
                      invalid={Number(limiteRest) < 0 || !limiteRest}
                    >
                      <Field.Label>
                        Limite máximo
                        <Field.RequiredIndicator />
                        <BotaoAjuda>
                          <>
                            É a{" "}
                            <Strong color="red.500">capacidade total</Strong>{" "}
                            disponível do seu recurso ou o alvo exato que a
                            regra exige (o número que fica depois do operador).
                            <Box
                              mt="2"
                              p="2"
                              bg="gray.100"
                              borderRadius="sm"
                              borderLeft="3px solid"
                              borderColor="blue.400"
                              fontSize="xs"
                            >
                              <Strong>Exemplo:</Strong> Se seus desenvolvedores
                              tem um limite máximo de{" "}
                              <Strong>4.000 horas de trabalho</Strong> , o
                              limite final desta restrição será 4000.
                            </Box>
                          </>
                        </BotaoAjuda>
                      </Field.Label>
                      <Input
                        type="number"
                        value={limiteRest}
                        onChange={(e) => setLimiteRest(e.target.value)}
                      />
                      {Number(limiteRest) < 0 && (
                        <Field.ErrorText
                          fontWeight="bold"
                          color="red.400"
                          fontSize="xs"
                        >
                          O limite não pode ser menor que 0.
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  </VStack>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button
                    type="button"
                    bg="#28aa28"
                    _hover={{ bg: "#1e821e" }}
                    _active={{ bg: "#1a701a" }}
                    w="100%"
                    onClick={handleAdicionarRestricao}
                    disabled={
                      !nomeRest.trim() ||
                      !operadorRest.length ||
                      !coeficientesDaRestricao.length ||
                      Number(limiteRest) < 0 ||
                      !limiteRest
                    }
                  >
                    <LuPlus /> Adicionar restrição
                  </Button>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default Abas;
