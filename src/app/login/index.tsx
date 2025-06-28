import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import LoginSchema from '../../utils/validadores/login';
import styles from './styles';
import Logo from "../../components/logo"
import { router } from 'expo-router';
import { Chamadas } from '../../servicos/chamadasApi';
import { Login } from '../../modelos/Login';
import * as Burnt from "burnt";

export default function LoginScreen() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async (values: {nomeUsuario : string, senha: string}) => {
    try {

      const loginPayload: Login = {
        nomeUsuario: values.nomeUsuario,
        senha: values.senha,
      };
      
      const dadosUsuario = await Chamadas.login(loginPayload);

      if (dadosUsuario) {
        console.log(dadosUsuario)
        router.push({
          pathname: '/home',
          params: {
            dados: JSON.stringify(dadosUsuario),
          },
        });
      } else {
        Burnt.alert({
          title: "Eita, problema!",
          message: "Usuário ou senha inválidos",
          preset: "error",
        });
      }
    } catch (error: any) {
      Burnt.alert({
        title: "Eita, problema!",
        message: 'Erro ' + error.response?.data?.mensagem || 'Erro ao tentar fazer login',
        preset: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo/>
        <Text style={styles.subtitulo}>Acesse sua conta</Text>
      </View>
    
      <View style={styles.conteudo}>
        <Formik
          initialValues={{ nomeUsuario: '', senha: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
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
                <Ionicons name="person" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="Usuário"
                  onChangeText={handleChange('nomeUsuario')}
                  onBlur={handleBlur('nomeUsuario')}
                  value={values.nomeUsuario}
                />
              </View>
              {touched.nomeUsuario && errors.nomeUsuario && (
                <Text style={styles.erro}>{errors.nomeUsuario}</Text>
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  secureTextEntry={!mostrarSenha}
                  onChangeText={handleChange('senha')}
                  onBlur={handleBlur('senha')}
                  value={values.senha}
                />
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
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

              <TouchableOpacity style={styles.botao} onPress={() => handleSubmit()}>
                <Text style={styles.botaoTexto}>Entrar</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <TouchableOpacity onPress={() => router.push("/recuperarSenha")}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text style={styles.linkSecundario}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
