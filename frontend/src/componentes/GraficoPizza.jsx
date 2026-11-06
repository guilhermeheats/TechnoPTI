import { Text, Field } from "@chakra-ui/react";
import { PieChart, Pie, Sector } from "recharts";

const CORES = ["#4DEEEA", "#74EE15", "#FFE700", "#F000FF", "#001eff"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight="bold"
      fontSize="13px"
      fontFamily="arial"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props) => {
  return <Sector {...props} fill={CORES[props.index % CORES.length]} />;
};

function GraficoPizza({ variaveis, isAnimationActive = true }) {
  const dadosGrafico = Object.entries(variaveis || {})
    .filter(([, valor]) => valor > 0)
    .map(([nome, valor]) => ({
      name: nome,
      value: valor,
    }));

  if (dadosGrafico.length === 0) {
    return (
      <Text textAlign="center" color="gray.500" fontSize="xs" py="4">
        Nenhuma variável ativa para exibir no gráfico.
      </Text>
    );
  }

  return (
    <Field.Root
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100%"
    >
      <Field.Label mt="30px">Gráfico representando as variáveis:</Field.Label>
      <PieChart
        style={{ width: "100%", maxWidth: "340px", aspectRatio: 1 }}
        responsive="true"
      >
        <Pie
          data={dadosGrafico}
          labelLine={false}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={isAnimationActive}
          shape={MyCustomPie}
          innerRadius={0}
          outerRadius={90}
        />
      </PieChart>
    </Field.Root>
  );
}

export default GraficoPizza;
