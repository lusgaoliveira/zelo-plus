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
import * as Burnt from "burnt";

export default function CriarTarefaScreen() {
  const { dados } = useLocalSearchParams();
  const usuario = dados ? JSON.parse(dados as string) : null;
  const id = usuario.tipoUsuario === "CUIDADOR" ? usuario.codigo : usuario.id;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [tipos, setTipos] = useState<TipoTarefa[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<number | null>(null);
  const [nivel, setNivel] = useState<number>(1);
  const [carregando, setCarregando] = useState(true);

  function formatAsLocalISOString(date: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  useEffect(() => {
    const carregarTipos = async () => {
      try {
        const dados = await Chamadas.listarTiposTarefa();
        setTipos(dados || []);
      } catch (error) {
         Burnt.toast({
          title: "Eita, problema!",
          message: "Verifque os campos",
          preset: "error",
        });
      } finally {
        setCarregando(false);
      }
    };
    carregarTipos();
  }, []);

  const criarTarefa = async () => {
    if (!tipoSelecionado) {
      Burnt.toast({
        title: "Eita, problema!",
        message: "Verifque os campos",
        preset: "error",
      });
      return;
    }

    const tarefaDTO = {
      titulo,
      descricao,
      dataCriacao: formatAsLocalISOString(new Date()),
      dataAgendamento: formatAsLocalISOString(dataAgendamento),
      idTipoTarefa: tipoSelecionado,
      id,
      nivel,
    };

    try {
      await Chamadas.criarTarefa(tarefaDTO);
      Burnt.toast({
        title: "Sucesso",
        message: "Tarefa criada com sucesso!",
        preset: "done",
      });
      router.back();
    } catch (error) {
      Burnt.toast({
        title: "Erro",
        message: "Erro ao criar a tarefa!",
        preset: "error",
      });
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
        style={[styles.input, { height: 80 }]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Text style={styles.label}>Data de Agendamento</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setMostrarData(true)}
      >
        <Text style={styles.textInput}>
          {dataAgendamento.toLocaleDateString("pt-BR")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setMostrarHora(true)}
      >
        <Text style={styles.textInput}>
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
          style={styles.picker}
        >
          <Picker.Item label="Selecione um tipo..." value={null} />
          {tipos.map((tipo) => (
            <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nível</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={nivel}
          onValueChange={(itemValue) => setNivel(itemValue)}
          style={styles.picker}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <Picker.Item key={n} label={`${n}`} value={n} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.botao} onPress={criarTarefa}>
        <Text style={styles.botaoTexto}>Criar Tarefa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFAEC",
  },
  label: {
    fontWeight: "bold",
    marginTop: 16,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 14,
    marginTop: 6,
    backgroundColor: "#f5f5f5",
    fontSize: 16,
  },
  textInput: {
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  picker: {
    fontSize: 16,
  },
  botao: {
    backgroundColor: "#28A745",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 24,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
