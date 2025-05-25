import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import RecuperacaoSchema from '../../utils/validadores/recuperacaoSenha';
import styles from './styles';
import { router } from 'expo-router';
import Logo from "../../components/logo"



export default function NovaSenhaScreen() {

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
                  placeholder="confSenha"
                  secureTextEntry={!mostrarSenha}
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
                  <Text style={styles.botaoTexto}>Salvadr</Text>
                </TouchableOpacity>

                
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}
