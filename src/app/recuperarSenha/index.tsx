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



export default function RecuperarSenhaScreen() {
  const emailRef = useRef<TextInput>(null);

  const recuperacaoSenha = (value: {email : string} ) => {
    console.log('Usuário:', value.email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo/>
        <Text style={styles.subtitulo}>Informe o e-mail</Text>
      </View>
      <View style={styles.conteudo}>
        <Formik
          initialValues={{ email: ""}}
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

                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.erro}>{errors.email}</Text>
              )}



              <View style={styles.botoesContainer}>

                <TouchableOpacity style={styles.botaoSecundario} onPress={() =>router.back()}>
                  <Text style={styles.botaoTexto}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoPrincipal} >
                  <Text style={styles.botaoTexto}>Enviar</Text>
                </TouchableOpacity>

                
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}
