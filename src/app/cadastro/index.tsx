import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View, Text, ScrollView, KeyboardAvoidingView, Platform} from "react-native";
import Checkbox from "expo-checkbox";
import Logo from "../../components/logo";
import styles from "./styles";
import { CriarUsuario } from "../../modelos/CriarUsuario";
import { Chamadas } from "../../servicos/chamadasApi";
import { router } from "expo-router";
import * as Burnt from "burnt";
import * as Notifications from 'expo-notifications';

async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permissão para notificações foi negada!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<"IDOSO" | "CUIDADOR" | null>(null);
  const [codigoIdoso, setCodigoIdoso] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('Expo Push Token:', token);
      }
    });
  }, []);

  const formatarData = (texto: string) => {
    const numeros = texto.replace(/\D/g, "");
    let resultado = "";
    if (numeros.length <= 2) {
      resultado = numeros;
    } else if (numeros.length <= 4) {
      resultado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    } else if (numeros.length <= 8) {
      resultado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
    } else {
      resultado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
    }
    setDataNascimento(resultado);
  };

  const criarUsuario = async () => {
  if (!usuario || !senha || !email || !nome || !dataNascimento || !tipo) {
    Burnt.toast({
      title: "Eita, problema!",
      message: "Preencha todos os campos obrigatórios",
      preset: "error",
    });
    return;
  }

  if (!expoPushToken) {
    Burnt.toast({
      title: "Erro no Token",
      message: "Não foi possível obter o token de notificações. Verifique as permissões.",
      preset: "error",
    });
    return;
  }

  const novoUsuario: CriarUsuario = {
    nomeUsuario: usuario,
    senha: senha,
    email: email,
    nome: nome,
    dataNascimento: dataNascimento,
    codigoVinculo: tipo === "CUIDADOR" ? codigoIdoso || null : null,
    tipoUsuario: tipo === "CUIDADOR" && codigoIdoso ? "CUIDADOR" : "IDOSO",
    tokenExpo: expoPushToken
  };

  try {
    const resposta = await Chamadas.criarUsuario(novoUsuario);

    if (resposta) {
      router.push({
        pathname: '/home',
        params: {
          dados: JSON.stringify(resposta),
        },
      });
    }
  } catch (error: any) {
    Burnt.toast({
      title: "Eita, problema!",
      message: "Erro desconhecido",
      preset: "error",
    });
    console.error(error.response?.data?.mensagem || error.message || "Erro desconhecido");
  }
};

  return (
   <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor:"#FEF6E4" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logo}>
            <Logo />
            <Text style={styles.subtitulo}>Criar nova conta</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Ionicons name="person-circle" size={20} color="#444" />
              <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="person" size={20} color="#444" />
              <TextInput
                style={styles.input}
                placeholder="Nome de Usuário"
                value={usuario}
                onChangeText={setUsuario}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed" size={20} color="#444" />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry={true}
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="mail" size={20} color="#444" />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="calendar-outline" size={20} color="#444" />
              <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (dd/mm/aaaa)"
                keyboardType="numeric"
                maxLength={10}
                value={dataNascimento}
                onChangeText={formatarData}
              />
            </View>

            <View style={styles.labelWithIcon}>
              <Ionicons name="accessibility-outline" size={20} color="#444" />
              <Text style={styles.labelText}>Abaixo selecione o seu tipo de usuário</Text>
            </View>
          <View style={styles.inputGroup}>

            <View style={styles.containerCheckbox}>
              <View style={styles.checkboxItem}>
                <Text style={styles.checkboxLabel}>Idoso</Text>
                <Checkbox
                  style={styles.inputCheckbox}
                  value={tipo === "IDOSO"}
                  onValueChange={() => setTipo("IDOSO")}
                />
              </View>

              <View style={styles.checkboxItem}>
                <Text style={styles.checkboxLabel}>Cuidador</Text>
                <Checkbox
                  style={styles.inputCheckbox}
                  value={tipo === "CUIDADOR"}
                  onValueChange={() => setTipo("CUIDADOR")}
                />
              </View>
            </View>
          </View>



            {tipo === "CUIDADOR" && (
              <View style={styles.inputGroup}>
                <Ionicons name="code-working" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  value={codigoIdoso}
                  onChangeText={setCodigoIdoso}
                  maxLength={8}
                  placeholder="Digite o código de vínculo do idoso assistido"
                />
              </View>
            )}
          </View>

          <View style={styles.botoesContainer}>
          
            <TouchableOpacity style={styles.botaoSecundario} onPress={()=>router.back()}>
              <Text style={styles.botaoTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoPrincipal} onPress={criarUsuario}>
              <Text style={styles.botaoTexto}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}
