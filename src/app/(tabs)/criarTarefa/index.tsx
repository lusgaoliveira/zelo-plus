import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Chamadas } from "../../../servicos/chamadasApi";
import { TipoTarefa } from "../../../modelos/Tarefa";
import { router, useLocalSearchParams } from "expo-router";

export default function CriarTarefaScreen() {
  const { dados } = useLocalSearchParams();
  const usuario = dados ? JSON.parse(dados as string) : null;
  const idIdoso = usuario?.id; // ID vindo dos params

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [tipos, setTipos] = useState<TipoTarefa[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<number | null>(null);
  const [nivel, setNivel] = useState<number>(1);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarTipos = async () => {
      try {
        const dados = await Chamadas.listarTiposTarefa();
        setTipos(dados || []);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os tipos de tarefa.");
      } finally {
        setCarregando(false);
      }
    };
    carregarTipos();
  }, []);

  const criarTarefa = async () => {
    if (!tipoSelecionado) {
      Alert.alert("Atenção", "Selecione um tipo de tarefa.");
      return;
    }

    const tarefaDTO = {
      titulo,
      descricao,
      dataCriacao: new Date().toISOString(),
      dataAgendamento: dataAgendamento.toISOString(),
      idTipoTarefa: tipoSelecionado,
      idIdoso,
      nivel,
    };

    try {
      await Chamadas.criarTarefa(tarefaDTO);
      Alert.alert("Sucesso", "Tarefa criada com sucesso!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar a tarefa.");
    }
  };

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Text style={styles.label}>Data de Agendamento</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setMostrarData(true)}
      >
        <Text>{dataAgendamento.toLocaleDateString("pt-BR")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setMostrarHora(true)}
      >
        <Text>
          {dataAgendamento.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      {mostrarData && (
        <DateTimePicker
          mode="date"
          value={dataAgendamento}
          display="spinner"
          onChange={(e, date) => {
            setMostrarData(false);
            if (date) {
              const novaData = new Date(dataAgendamento);
              novaData.setFullYear(date.getFullYear());
              novaData.setMonth(date.getMonth());
              novaData.setDate(date.getDate());
              setDataAgendamento(novaData);
            }
          }}
        />
      )}

      {mostrarHora && (
        <DateTimePicker
          mode="time"
          is24Hour
          display="spinner"
          value={dataAgendamento}
          onChange={(e, hora) => {
            setMostrarHora(false);
            if (hora) {
              const novaData = new Date(dataAgendamento);
              novaData.setHours(hora.getHours());
              novaData.setMinutes(hora.getMinutes());
              setDataAgendamento(novaData);
            }
          }}
        />
      )}

      <Text style={styles.label}>Tipo de Tarefa</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={tipoSelecionado}
          onValueChange={(itemValue) => setTipoSelecionado(itemValue)}
        >
          <Picker.Item label="Selecione um tipo..." value={null} />
          {tipos.map((tipo) => (
            <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nível</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={nivel.toString()}
        onChangeText={(valor) => setNivel(Number(valor))}
      />

      <TouchableOpacity style={styles.botao} onPress={criarTarefa}>
        <Text style={styles.botaoTexto}>Criar Tarefa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
    backgroundColor: "#f5f5f5",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: "#f5f5f5",
  },
  botao: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
