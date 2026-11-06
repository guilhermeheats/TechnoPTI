import { Heading, Box, Button, Text, VStack } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CardProblema from "../componentes/CardProblema";
import api from "../api";

function Home() {
  const [listaDeProblemas, setListaDeProblemas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const deletarDoBanco = async (idDoProblema) => {
    setCarregando(true);
    try {
      await api.delete(`/problems/${idDoProblema}`);

      setListaDeProblemas((listaAtual) =>
        listaAtual.filter((problema) => problema.id !== idDoProblema),
      );
    } catch (erro) {
      console.error("Erro ao tentar remover o problema:", erro);
    }
    setCarregando(false);
  };

  const buscarDoBanco = async () => {
    try {
      const resposta = await api.get("/problems");
      setListaDeProblemas(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar problemas na Home:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarDoBanco();
  }, []);

  const listaVazia = listaDeProblemas.length === 0;
  return (
    <>
      <VStack spaceY={2} align="center" textAlign="center">
        <Heading
          as="h1"
          textStyle="3xl"
          fontWeight="bold"
          color="gray.800"
          mt="20px"
        >
          Bem vindo ao Technopti, sua calculadora de otimização
        </Heading>
        <Heading size="md">
          Uma ferramenta inteligente feita para otimizar seus resultados:
          Calcule o cenário ideal, maximizando seus lucros ou minimizando seus
          custos com relatórios e gráficos automáticos.
        </Heading>
        <Box
          bg="gray.400"
          boxShadow="2xl"
          border="2px solid #c6c6c6"
          borderRadius="10px"
          justifyContent="center"
          alignItems="center"
          p="20px"
        >
          {carregando ? (
            <>
              <Text>Carregando seu histórico...</Text>
            </>
          ) : (
            <>
              {listaVazia && (
                <>
                  <Heading size="2xl" fontWeight="bold" mb="10px">
                    Você ainda não tem problemas criados.
                  </Heading>
                </>
              )}
              {!listaVazia && (
                <>
                  <Heading size="2xl" fontWeight="bold" mb="10px">
                    Meus problemas
                  </Heading>

                  <CardProblema
                    lista={listaDeProblemas}
                    onRemover={deletarDoBanco}
                    carregando={carregando}
                  />
                </>
              )}
            </>
          )}

          <Text color="gray.900" fontWeight="medium" px="4" mb="5px">
            Clique no botão abaixo para criar um novo problema.
          </Text>

          <Link
            to="/problem"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              w="80%"
              size="lg"
              bg="#28aa28"
              _hover={{ bg: "#1e821e" }}
              _active={{ bg: "#1a701a" }}
              color="white"
              fontWeight="bold"
              cursor="pointer"
            >
              <LuPlus /> Criar problema
            </Button>
          </Link>
        </Box>
      </VStack>
    </>
  );
}

export default Home;
