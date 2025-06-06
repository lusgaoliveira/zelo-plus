import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { Chamadas } from "../../servicos/chamadasApi";
import { Tarefa } from "../../modelos/Tarefa";
import { TipoTarefa } from "../../modelos/Tarefa";
import { Picker } from "@react-native-picker/picker";
import * as Burnt from "burnt";

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [tiposTarefa, setTiposTarefa] = useState<TipoTarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editavel, setEditavel] = useState(false);
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);

  const concluirTarefa = async (idTarefa: number) => {
    try {
      await Chamadas.concluirTarefa(idTarefa);
      Burnt.toast({
        title: "Tudo Certo",
        message: "Tarefa concluída com sucesso",
        preset: "done",
      });
      router.back(); 
    } catch (error: any) {
      console.error("Erro ao concluir tarefa:", error);
      Burnt.toast({
        title: "Erro",
        message: "Erro ao concluir tarefa",
        preset: "error",
      });
    }
  };

  const salvarTarefa = async () => {
    try {
      if (!tarefa) return;
      await Chamadas.atualizarTarefa(tarefa.id, tarefa);
      Burnt.toast({
        title: "Tudo Certo",
        message: "Tarefa atualizada com sucesso",
        preset: "done",
      });
      setEditavel(false);
    } catch (error: any) {
      console.error("Erro ao salvar tarefa:", error);
      Burnt.toast({
        title: "Erro",
        message: "Não foi possível salvar a tarefa",
        preset: "error",
      });
    }
  };

  useEffect(() => {
    const buscarTarefa = async () => {
      try {
        const resposta = await Chamadas.buscarTarefa(Number(id));
        const tipos = await Chamadas.listarTiposTarefa();
        setTarefa(resposta);
        setTiposTarefa(tipos);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };

    if (id) {
      buscarTarefa();
    }
  }, [id]);

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!tarefa || !tarefa.id) {
    return (
      <View style={styles.centered}>
        <Text>Tarefa não encontrada</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={tarefa.titulo}
          editable={editavel}
          onChangeText={(text) => setTarefa({ ...tarefa, titulo: text })}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={tarefa.descricao}
          multiline
          editable={editavel}
          onChangeText={(text) => setTarefa({ ...tarefa, descricao: text })}
        />

        <Text style={styles.label}>Data de Criação</Text>
        <View style={styles.inlineGroup}>
          <TextInput
            style={[styles.input, styles.metade, styles.inputDesabilitado]}
            value={new Date(tarefa.dataCriacao).toLocaleDateString("pt-BR")}
            editable={false}
          />
          <TextInput
            style={[styles.input, styles.metade, styles.inputDesabilitado]}
            value={new Date(tarefa.dataCriacao).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            editable={false}
          />
        </View>

        <Text style={styles.label}>Data de Agendamento</Text>
        <View style={styles.inlineGroup}>
          <TouchableOpacity
            style={[styles.input, styles.metade]}
            onPress={() => editavel && setMostrarDataPicker(true)}
            disabled={!editavel}
          >
            <Text>
              {new Date(tarefa.dataAgendamento).toLocaleDateString("pt-BR")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.input, styles.metade]}
            onPress={() => editavel && setMostrarHoraPicker(true)}
            disabled={!editavel}
          >
            <Text>
              {new Date(tarefa.dataAgendamento).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {mostrarDataPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={new Date(tarefa.dataAgendamento)}
            onChange={(event, selectedDate) => {
              setMostrarDataPicker(false);
              if (selectedDate) {
                const novaData = new Date(tarefa.dataAgendamento);
                novaData.setFullYear(selectedDate.getFullYear());
                novaData.setMonth(selectedDate.getMonth());
                novaData.setDate(selectedDate.getDate());
                setTarefa({ ...tarefa, dataAgendamento: novaData.toISOString() });
              }
            }}
          />
        )}

        {mostrarHoraPicker && (
          <DateTimePicker
            mode="time"
            display="spinner"
            is24Hour
            value={new Date(tarefa.dataAgendamento)}
            onChange={(event, selectedTime) => {
              setMostrarHoraPicker(false);
              if (selectedTime) {
                const novaHora = new Date(tarefa.dataAgendamento);
                novaHora.setHours(selectedTime.getHours());
                novaHora.setMinutes(selectedTime.getMinutes());
                setTarefa({ ...tarefa, dataAgendamento: novaHora.toISOString() });
              }
            }}
          />
        )}

        <Text style={styles.label}>Tipo de Tarefa</Text>
        {editavel ? (
          <View style={[styles.input, { padding: 0 }]}>
            <Picker
              selectedValue={tarefa.tipoTarefa.id}
              onValueChange={(itemValue) => {
                const tipoSelecionado = tiposTarefa.find(
                  (tipo) => tipo.id === itemValue
                );
                if (tipoSelecionado) {
                  setTarefa({ ...tarefa, tipoTarefa: tipoSelecionado });
                }
              }}
            >
              {tiposTarefa.map((tipo) => (
                <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
              ))}
            </Picker>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={tarefa.tipoTarefa.nome}
            editable={false}
          />
        )}

        <Text style={styles.label}>Nível</Text>
        {editavel ? (
          <View style={[styles.input, { padding: 0 }]}>
            <Picker
              selectedValue={tarefa.nivel}
              onValueChange={(itemValue) =>
                setTarefa({ ...tarefa, nivel: itemValue })
              }
            >
              {[1, 2, 3, 4, 5].map((nivel) => (
                <Picker.Item key={nivel} label={`Nível ${nivel}`} value={nivel} />
              ))}
            </Picker>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={String(tarefa.nivel)}
            editable={false}
          />
        )}

        <Text style={styles.label}>Status</Text>
        <TextInput
          style={styles.input}
          value={tarefa.statusTarefa}
          editable={false}
        />
      </ScrollView>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => router.back()}
        >
          <Text style={styles.botaoTexto}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={() => setEditavel(!editavel)}
        >
          <Text style={styles.botaoTexto}>
            {editavel ? "Cancelar" : "Editar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoFinalizar}
          onPress={() =>
            editavel ? salvarTarefa() : concluirTarefa(tarefa.id)
          }
        >
          <Text style={styles.botaoTexto}>
            {editavel ? "Salvar" : "Concluir"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFFAEC",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  inputDesabilitado: {
    backgroundColor: "#e0e0e0",
  },
  inlineGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  metade: {
    flex: 1,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    padding: 12,
    backgroundColor: "#FFFAEC",
    marginBottom: 10,
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: "#4A6FA5",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  botaoFinalizar: {
    flex: 1,
    backgroundColor: "#ff4d4d",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
