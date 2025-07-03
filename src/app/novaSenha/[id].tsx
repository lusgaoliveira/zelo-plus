import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { router, useLocalSearchParams } from 'expo-router';
import Logo from "../../components/logo";
import * as Burnt from "burnt";
import { Chamadas } from '../../servicos/chamadasApi';
import RecuperacaoSchema from '../../utils/validadores/recuperacaoSenha';

export default function NovaSenhaScreen() {
  const { id } = useLocalSearchParams();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfSenha, setMostrarConfSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const senhaRef = useRef<TextInput>(null);
  const confirmarNovaSenhaRef = useRef<TextInput>(null);

  const atualizarSenha = async (values: { senha: string }) => {
    try {
      setCarregando(true);

      const idFormatado = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
      await Chamadas.atualizarSenha(idFormatado, values.senha);

      Burnt.toast({
        title: "Tudo Certo",
        message: "Senha alterada com sucesso!",
        preset: "done",
      });
      router.back();
    } catch (error: any) {
      Burnt.toast({
        title: "Eita, problema!",
        message: `error: ` + (error.message || error),
        preset: "error",
      });
      console.error(error.response?.data?.mensagem || error.message || "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
        <Text style={styles.subtitulo}>Crie uma senha</Text>
      </View>
      <View style={styles.conteudo}>
        <Formik
          initialValues={{ senha: "", confSenha: "" }}
          validationSchema={RecuperacaoSchema}
          onSubmit={atualizarSenha}
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
                <Ionicons name="lock-closed" size={20} color="#444" />
                <TextInput
                  ref={senhaRef}
                  style={styles.input}
                  placeholder="Senha"
                  secureTextEntry={!mostrarSenha}
                  onChangeText={handleChange('senha')}
                  placeholderTextColor="#666"
                  onBlur={handleBlur('senha')}
                  value={values.senha}
                  editable={!carregando}
                />
                <TouchableOpacity
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                  disabled={carregando}
                >
                  <Ionicons
                    name={mostrarSenha ? 'eye-off' : 'eye'}
                    size={20}
                    color="#444"
                  />
                </TouchableOpacity>
              </View>
              {touched.senha && errors.senha && (
                <Text style={styles.erro}>{errors.senha}</Text>
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#444" />
                <TextInput
                  ref={confirmarNovaSenhaRef}
                  style={styles.input}
                  placeholder="Confirmar Senha"
                  secureTextEntry={!mostrarConfSenha}
                  onChangeText={handleChange('confSenha')}
                  placeholderTextColor="#666"
                  onBlur={handleBlur('confSenha')}
                  value={values.confSenha}
                  editable={!carregando}
                />
                <TouchableOpacity
                  onPress={() => setMostrarConfSenha(!mostrarConfSenha)}
                  disabled={carregando}
                >
                  <Ionicons
                    name={mostrarConfSenha ? 'eye-off' : 'eye'}
                    size={20}
                    color="#444"
                  />
                </TouchableOpacity>
              </View>
              {touched.confSenha && errors.confSenha && (
                <Text style={styles.erro}>{errors.confSenha}</Text>
              )}

              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  style={[styles.botaoSecundario, carregando && { opacity: 0.5 }]}
                  onPress={() => router.back()}
                  disabled={carregando}
                >
                  <Text style={styles.botaoTexto}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botaoPrincipal, carregando && { opacity: 0.7 }]}
                  onPress={handleSubmit as any}
                  disabled={carregando}
                >
                  {carregando ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.botaoTexto}>Salvar</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FEF6E4',
  },
  logo: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  conteudo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  subtitulo: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    color: '#000'
  },
  erro: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: '#28A745',
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: 6,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: '#4A6FA5',
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 6,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
