import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import RecuperacaoSchema from '../../utils/validadores/recuperacaoSenha';
import styles from './styles';
import { router } from 'expo-router';
import Logo from "../../components/logo";
import { Chamadas } from '../../servicos/chamadasApi';
import * as Burnt from "burnt";

export default function RecuperarSenhaScreen() {
  const emailRef = useRef<TextInput>(null);
  const [carregando, setCarregando] = useState(false);

  const recuperacaoSenha = async (values: { email: string }) => {
    try {
      setCarregando(true);

      await Chamadas.recuperarSenha(values.email);

      Burnt.toast({
        title: "Tudo Certo",
        message: "Nova senha enviada para o e-mail",
        preset: "done",
      });
      router.back();
    } catch (error: any) {
      Burnt.toast({
        title: "Eita, problema  " + error.message,
        message: error?.response?.data?.mensagem || error.message || "Erro desconhecido",
        preset: "error",
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
        <Text style={styles.subtitulo}>Informe o e-mail</Text>
      </View>
      <View style={styles.conteudo}>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={RecuperacaoSchema}
          onSubmit={recuperacaoSenha}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  returnKeyType="done"
                  value={values.email}
                  ref={emailRef}
                  editable={!carregando}
                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.erro}>{errors.email}</Text>
              )}

              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  style={[styles.botaoSecundario, carregando && { opacity: 0.5 }]}
                  onPress={() => router.back()}
                  disabled={carregando}
                >
                  <Text style={styles.botaoTexto}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botaoPrincipal, carregando && { opacity: 0.5 }]}
                  onPress={handleSubmit as any}
                  disabled={carregando}
                >
                  {carregando ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.botaoTexto}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}
