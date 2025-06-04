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
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Chamadas } from "../../../servicos/chamadasApi";
import { Perfil } from "../../../modelos/Perfil"; 
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PerfilScreen() {
  const { dados } = useLocalSearchParams();
  const usuario = dados ? JSON.parse(dados as string) : null;
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [editavel, setEditavel] = useState(false);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  useEffect(() => {
    const buscarPerfil = async () => {
      if (!usuario?.id) {
        Alert.alert("Erro", "Usuário não encontrado.");
        setCarregando(false);
        return;
      }

      try {
        const resposta = await Chamadas.buscarPerfil(usuario.id);
        setPerfil(resposta);
      } catch (error) {
        Alert.alert("Erro", "Erro ao buscar perfil.");
      } finally {
        setCarregando(false);
      }
    };
    buscarPerfil();
  }, [usuario]);

  const selecionarImagem = async () => {
    if (!editavel) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Permita o acesso à galeria para alterar a foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });


    if (!result.canceled && result.assets.length > 0 && perfil !== null) {
        const imageUri = result.assets[0].uri;

        setPerfil((prev) => {
            if (!prev) return prev; 

            return {
            ...prev,
            fotoPerfil: imageUri,
            };
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

  if (!perfil) {
    return (
      <View style={styles.centered}>
        <Text>Perfil não encontrado</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Foto de Perfil</Text>
        <TouchableOpacity onPress={selecionarImagem}>
          {perfil.fotoPerfil && perfil.fotoPerfil.trim() !== "" ? (
            <Image
              source={{ uri: perfil.fotoPerfil }}
              style={styles.fotoPerfil}
            />
          ) : (
            <View style={styles.iconePerfil}>
              <Ionicons name="person-circle" size={100} color="#888" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome de Usuário</Text>
        <TextInput
          style={styles.input}
          value={perfil.nomeUsuario}
          editable={false}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={perfil.email}
          editable={editavel}
          onChangeText={(text) => setPerfil({ ...perfil, email: text })}
        />

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={perfil.nome}
          editable={editavel}
          onChangeText={(text) => setPerfil({ ...perfil, nome: text })}
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => editavel && setMostrarDatePicker(true)}
          disabled={!editavel}
        >
          <Text>{new Date(perfil.dataNascimento).toLocaleDateString("pt-BR")}</Text>
        </TouchableOpacity>

        {mostrarDatePicker && (
          <DateTimePicker
            value={new Date(perfil.dataNascimento)}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setMostrarDatePicker(false);
              if (selectedDate) {
                setPerfil({
                  ...perfil,
                  dataNascimento: selectedDate.toISOString().split("T")[0],
                });
              }
            }}
          />
        )}

        <Text style={styles.label}>Código de Vínculo</Text>
        <TextInput
          style={styles.input}
          value={perfil.codigoVinculo}
          editable={false}
        />
      </ScrollView>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => setEditavel(!editavel)}
        >
          <Text style={styles.botaoTexto}>
            {editavel ? "Cancelar" : "Editar"}
          </Text>
        </TouchableOpacity>
        {editavel && (
          <TouchableOpacity
            style={styles.botaoPrincipal}
            // onPress={async () => {
            //   try {
            //     await Chamadas.atualizarPerfil(perfil);
            //     Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
            //     setEditavel(false);
            //   } catch (error) {
            //     Alert.alert("Erro", "Não foi possível atualizar o perfil.");
            //   }
            // }}
          >
            <Text style={styles.botaoTexto}>Salvar</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
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
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
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
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 10,
  },
  iconePerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
});
