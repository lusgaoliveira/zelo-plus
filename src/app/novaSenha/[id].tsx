import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet, 
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import RecuperacaoSchema from '../../utils/validadores/recuperacaoSenha';
import { router, useLocalSearchParams } from 'expo-router';
import Logo from "../../components/logo"

export default function NovaSenhaScreen() {

  const { id } = useLocalSearchParams();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfSenha, setMostrarConfSenha] = useState(false);

  const senhaRef = useRef<TextInput>(null);
  const confirmarNovaSenhaRef = useRef<TextInput>(null);

  const recuperacaoSenha = (value: {senha : string} ) => {
    console.log('Usuário:', value.senha);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo/>
        <Text style={styles.subtitulo}>Crie uma senha</Text>
      </View>
      <View style={styles.conteudo}>
        <Formik
          initialValues={{senha: ""}}
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
            
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar Senha"
                  secureTextEntry={!mostrarConfSenha}
                  onChangeText={handleChange('confSenha')}
                  onBlur={handleBlur('confSenha')}

                />
                <TouchableOpacity onPress={() => setMostrarConfSenha(!mostrarConfSenha)}>
                  <Ionicons
                    name={mostrarConfSenha ? 'eye-off' : 'eye'}
                    size={20}
                    color="#444"
                  />
                </TouchableOpacity>
              </View>
              {touched.senha && errors.senha && (
                <Text style={styles.erro}>{errors.senha}</Text>
              )}
              <View style={styles.botoesContainer}>

                <TouchableOpacity style={styles.botaoSecundario} onPress={() =>router.back()}>
                  <Text style={styles.botaoTexto}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoPrincipal} >
                  <Text style={styles.botaoTexto}>Salvar</Text>
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
    paddingTop: 20
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
  },
  containerBotoes: {
    flexDirection: "row"
  },
  botao: {
    backgroundColor: '#28A745',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  linkSecundario: {
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
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

  erro: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  }
});