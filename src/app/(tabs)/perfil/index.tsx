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
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Burnt from "burnt";

export default function PerfilScreen() {
  const { dados } = useLocalSearchParams();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [editavel, setEditavel] = useState(false);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const usuario = dados ? JSON.parse(dados as string) : null;

  useEffect(() => {
    const buscarPerfil = async () => {
      if (!dados) {
        Burnt.toast({
          title: "Erro",
          message: "Usuário não encontrado",
          preset: "error",
        });
        setCarregando(false);
        return;
      }

      const usuario = JSON.parse(dados as string);
      if (!usuario?.id) {
        Burnt.toast({
          title: "Erro",
          message: "ID de usuário inválido",
          preset: "error",
        });
        setCarregando(false);
        return;
      }

      try {
        const resposta = await Chamadas.buscarPerfil(usuario.id);
        setPerfil(resposta);
      } catch (error) {
        Burnt.toast({
          title: "Erro",
          message: "IErro ao buscar perfil",
          preset: "error",
        });
      } finally {
        setCarregando(false);
      }
    };

    buscarPerfil();
  }, [dados]);

  const gerarCodigoVinculo = async () => {
    if (!perfil) return;

    try {
      await Chamadas.gerarVinculo(perfil.id);
      const resposta = await Chamadas.buscarPerfil(perfil.id); 
      setPerfil(resposta);
      Burnt.toast({
        title: "Sucesso",
        message: "Código de vínculo gerado com sucesso!",
        preset: "done",
      });
    } catch (error) {
        Burnt.toast({
          title: "Erro",
          message: "Não foi possível gerar o código de vínculo!",
          preset: "error",
        });
    }
  };

  
  const selecionarImagem = async () => {
    if (!editavel) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Burnt.toast({
        title: "Permissão negada",
        message: "Permita o acesso à galeria para alterar a foto!",
        preset: "error",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setPerfil((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          fotoPerfil: `data:image/jpeg;base64,${asset.base64}`,
        };
      });
    }
  };

  const salvarPerfil = async () => {
    if (!perfil) return;

    try {
      const base64 = perfil.fotoPerfil?.startsWith("data:image")
        ? perfil.fotoPerfil.split(",")[1]
        : undefined;

      await Chamadas.atualizarPerfil(perfil.id, {
        email: perfil.email,
        nome: perfil.nome,
        dataNascimento: perfil.dataNascimento,
        fotoPerfil: base64,
      });
      Burnt.toast({
        title: "Sucesso",
        message: "Perfil atualizado com sucesso!",
        preset: "done",
      });
      setEditavel(false);
    } catch (error) {
      Burnt.toast({
        title: "Erro",
        message: "Não foi possível atualizar o perfil!",
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
        <Text style={styles.labelPerfil}>Foto de Perfil</Text>
        <TouchableOpacity onPress={selecionarImagem}>
          {perfil.fotoPerfil && perfil.fotoPerfil.trim() !== "" ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${perfil.fotoPerfil}?t=${Date.now()}`
              }}
              style={styles.fotoPerfil}
            />
          ) : (
            <View style={styles.iconePerfil}>
              <Ionicons name="person-circle" size={100} color="#888" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome de Usuário</Text>
        <TextInput style={styles.input} value={perfil.nomeUsuario} editable={false} />

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
        <TextInput style={styles.input} value={perfil.codigoVinculo} editable={false} />
        

        {perfil?.tipoUsuario === "IDOSO" && !perfil.codigoVinculo && (
          <TouchableOpacity
            style={[styles.botaoPrincipal, { marginTop: 10 }]}
            onPress={gerarCodigoVinculo}
          >
            <Text style={styles.botaoTexto}>Gerar Código de Vínculo</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botaoSecundario} onPress={() => setEditavel(!editavel)}>
          <Text style={styles.botaoTexto}>{editavel ? "Cancelar" : "Editar"}</Text>
        </TouchableOpacity>
        {!editavel && (
          <TouchableOpacity
            style={styles.botaoNovaSenha}
            onPress={() =>
              router.push({
                pathname: "/novaSenha/[id]",
                params: { id: usuario?.id.toString() },
              })
            }
          >
            <Text style={styles.botaoTexto}>Alterar Senha</Text>
          </TouchableOpacity>
        )}

        {editavel && (
          <TouchableOpacity style={styles.botaoPrincipal} onPress={salvarPerfil}>
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
    backgroundColor: "#FFFAEC",
  },
  container: {
    padding: 20,
    alignItems: "center", 
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 18, 
    alignSelf: "flex-start",
    marginTop: 12,
    color: "#666",
  },
  labelPerfil: {
    fontWeight: "bold",
    fontSize: 18, 
    alignSelf: "center",
    marginTop: 12,
    color: "#333",
  },
  input: {
    width: "100%",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 6,
    backgroundColor: "#fff",
    elevation: 1,
    color: "#000"

  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    padding: 16,
    backgroundColor: "#FFFAEC",
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: "#4A6FA5",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
  },
  botaoNovaSenha: {
    flex: 1,
    backgroundColor: "#DC3545",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  fotoPerfil: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  iconePerfil: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginVertical: 12,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
});
