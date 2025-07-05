import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid
} from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Burnt from "burnt";
import * as Notifications from "expo-notifications";
import CriarUsuarioSchema from "../../utils/validadores/criarUsuario";
import { CriarUsuario } from "../../modelos/CriarUsuario";
import { Chamadas } from "../../servicos/chamadasApi";
import Logo from "../../components/logo";
import styles from "./styles";
import { router } from "expo-router";
import Constants from "expo-constants"; 
import { agendarNotificacaoAleatoria } from "../../utils/notifacacao/notificacoesDicas";
import * as Device from "expo-device";

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default', 
    });
  }

  if (!Device.isDevice) {
    alert("Notificações só funcionam em dispositivos físicos.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      alert('Permissão POST_NOTIFICATIONS negada!');
      return null;
    }
  }

  if (finalStatus !== 'granted') {
    alert('Permissão para notificações foi negada!');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    alert("projectId não encontrado. Verifique se está definido em app.json ou app.config.js");
    return null;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log("Expo Push Token:", token);
    return token;
  } catch (error) {
    console.error("Erro ao obter token de push:", error);
    alert("Erro ao obter token de notificações.");
    return null;
  }
}



export default function CadastroScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(setExpoPushToken);
  }, []);

  const formatarData = (texto: string, setFieldValue: any) => {
    const numeros = texto.replace(/\D/g, "");
    let resultado = "";
    if (numeros.length <= 2) {
      resultado = numeros;
    } else if (numeros.length <= 4) {
      resultado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    } else {
      resultado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
    }
    setFieldValue("dataNascimento", resultado);
  };

  const criarUsuario = async (values: any) => {
    if (!expoPushToken) {
      Burnt.toast({
        title: "Erro no Token",
        message: "Não foi possível obter o token de notificações.",
        preset: "error",
      });
      return;
    }

    const novoUsuario: CriarUsuario = {
      nome: values.nome,
      nomeUsuario: values.nomeUsuario,
      senha: values.senha,
      email: values.email,
      dataNascimento: values.dataNascimento,
      tipoUsuario: values.tipoUsuario,
      codigoVinculo: values.tipoUsuario === "CUIDADOR" ? values.codigoVinculo : null,
      tokenExpo: expoPushToken,
    };

    try {
      const resposta = await Chamadas.criarUsuario(novoUsuario);

      if (resposta) {
        if (values.tipoUsuario === "IDOSO") {
          for (let i = 0; i < 3; i++) {
            await agendarNotificacaoAleatoria();
          }
        }
        router.back()
      }
    } catch (error: any) {
      Burnt.toast({
        title: "Erro!",
        message: error.response?.data?.mensagem || "Erro desconhecido",
        preset: "error",
      });
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FEF6E4" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logo}>
          <Logo />
          <Text style={styles.subtitulo}>Criar nova conta</Text>
        </View>

        <Formik
          initialValues={{
            nome: "",
            nomeUsuario: "",
            senha: "",
            email: "",
            dataNascimento: "",
            tipoUsuario: "",
            codigoVinculo: "",
          }}
          validationSchema={CriarUsuarioSchema}
          onSubmit={criarUsuario}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* Nome */}
              <View style={styles.inputGroup}>
                <Ionicons name="person-circle" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="Nome Completo"
                  placeholderTextColor="#666"
                  value={values.nome}
                  onChangeText={handleChange("nome")}
                  onBlur={handleBlur("nome")}
                />
              </View>
              {touched.nome && errors.nome && <Text style={styles.erro}>{errors.nome}</Text>}

              {/* Nome de usuário */}
              <View style={styles.inputGroup}>
                <Ionicons name="person" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="Nome de Usuário"
                  placeholderTextColor="#666"
                  value={values.nomeUsuario}
                  onChangeText={handleChange("nomeUsuario")}
                  onBlur={handleBlur("nomeUsuario")}
                />
              </View>
              {touched.nomeUsuario && errors.nomeUsuario && (
                <Text style={styles.erro}>{errors.nomeUsuario}</Text>
              )}

              {/* Senha */}
              <View style={styles.inputGroup}>
                <Ionicons name="lock-closed" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#666"
                  secureTextEntry
                  value={values.senha}
                  onChangeText={handleChange("senha")}
                  onBlur={handleBlur("senha")}
                />
              </View>
              {touched.senha && errors.senha && <Text style={styles.erro}>{errors.senha}</Text>}

              {/* Email */}
              <View style={styles.inputGroup}>
                <Ionicons name="mail" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
              </View>
              {touched.email && errors.email && <Text style={styles.erro}>{errors.email}</Text>}

              {/* Data de nascimento */}
              <View style={styles.inputGroup}>
                <Ionicons name="calendar-outline" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="Data de Nascimento (dd/mm/aaaa)"
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                  maxLength={10}
                  value={values.dataNascimento}
                  onChangeText={(text) => formatarData(text, setFieldValue)}
                  onBlur={handleBlur("dataNascimento")}
                />
              </View>
              {touched.dataNascimento && errors.dataNascimento && (
                <Text style={styles.erro}>{errors.dataNascimento}</Text>
              )}

              {/* Tipo de usuário */}
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
                      value={values.tipoUsuario === "IDOSO"}
                      onValueChange={() => setFieldValue("tipoUsuario", "IDOSO")}
                    />
                  </View>

                  <View style={styles.checkboxItem}>
                    <Text style={styles.checkboxLabel}>Cuidador</Text>
                    <Checkbox
                      style={styles.inputCheckbox}
                      value={values.tipoUsuario === "CUIDADOR"}
                      onValueChange={() => setFieldValue("tipoUsuario", "CUIDADOR")}
                    />
                  </View>
                </View>
              </View>
              {touched.tipoUsuario && errors.tipoUsuario && (
                <Text style={styles.erro}>{errors.tipoUsuario}</Text>
              )}

              {/* Código do idoso (se cuidador) */}
              {values.tipoUsuario === "CUIDADOR" && (
                <View style={styles.inputGroup}>
                  <Ionicons name="code-working" size={20} color="#444" />
                  <TextInput
                    style={styles.input}
                    value={values.codigoVinculo}
                    onChangeText={handleChange("codigoVinculo")}
                    placeholderTextColor="#666"
                    onBlur={handleBlur("codigoVinculo")}
                    maxLength={8}
                    placeholder="Código de vínculo do idoso"
                  />
                </View>
              )}
              {values.tipoUsuario === "CUIDADOR" &&
                touched.codigoVinculo &&
                errors.codigoVinculo && (
                  <Text style={styles.erro}>{errors.codigoVinculo}</Text>
                )}

              {/* Botões */}
              <View style={styles.botoesContainer}>
                <TouchableOpacity style={styles.botaoSecundario} onPress={() => router.back()}>
                  <Text style={styles.botaoTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoPrincipal} onPress={handleSubmit as any}>
                  <Text style={styles.botaoTexto}>Cadastrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
