import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Chamadas } from "../../../servicos/chamadasApi";
import { BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const id = 1;
const criterios = ["status", "tipo", "nivel"];

const meses = [
  { label: "Todos", value: null },
  { label: "Janeiro", value: 1 },
  { label: "Fevereiro", value: 2 },
  { label: "Março", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Maio", value: 5 },
  { label: "Junho", value: 6 },
  { label: "Julho", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Setembro", value: 9 },
  { label: "Outubro", value: 10 },
  { label: "Novembro", value: 11 },
  { label: "Dezembro", value: 12 },
];

export default function RelatorioScreen() {
  const [criterio, setCriterio] = useState<string | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  const [dados, setDados] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (criterio) buscarDados();
  }, [criterio, mesSelecionado]);

  const buscarDados = async () => {
    try {
      const resposta = await Chamadas.buscarTarefasPorCriterioEMes(
        id,
        criterio!,
        mesSelecionado ?? 0
      );

      const formatado = Object.entries(resposta).map(([label, value]) => ({
        label,
        value: Number(value),
      }));

      setDados(formatado);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar os dados.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Escolha o critério:</Text>
      <View style={styles.optionsContainer}>
        {criterios.map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => setCriterio(label)}
            style={[
              styles.option,
              criterio === label && styles.optionSelecionado,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                criterio === label && styles.optionTextSelecionado,
              ]}
            >
              {label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Filtrar por mês:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={mesSelecionado}
          onValueChange={(value) => setMesSelecionado(value)}
          style={styles.picker}
        >
          {meses.map((m) => (
            <Picker.Item key={m.label} label={m.label} value={m.value} />
          ))}
        </Picker>
      </View>

      {criterio && (
        <View style={styles.dadosContainer}>
          <Text style={styles.title}>Relatório por {criterio}</Text>

          {dados.length > 0 ? (
            criterio !== "status" ? (
              <BarChart
                data={{
                  labels: dados.map((d) => d.label),
                  datasets: [{ data: dados.map((d) => d.value) }],
                }}
                width={screenWidth - 40}
                height={240}
                fromZero
                yAxisLabel="" // ✅ Adicione isso
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                }}
                style={styles.chart}
              />

            ) : (
              <PieChart
                data={dados.map((item, index) => ({
                  name: item.label,
                  population: item.value,
                  color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"][index % 6],
                  legendFontColor: "#000",
                  legendFontSize: 14,
                }))}
                width={screenWidth - 40}
                height={240}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
              />
            )
          ) : (
            <Text style={styles.noData}>Nenhum dado encontrado.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAEC",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
  label: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 16,
    
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  optionSelecionado: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    color: "#000",
    fontWeight: "600",
  },
  optionTextSelecionado: {
    color: "#fff",
  },
  dadosContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
    alignSelf: "center",
  },
  noData: {
    marginTop: 12,
    fontStyle: "italic",
    textAlign: "center",
  },
});
