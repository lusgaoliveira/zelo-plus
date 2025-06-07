import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View, Text, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import Logo from "../../components/logo";
import styles from "./styles";
import { CriarUsuario } from "../../modelos/CriarUsuario";
import { Chamadas } from "../../servicos/chamadasApi";
import { router } from "expo-router";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<"IDOSO" | "CUIDADOR" | null>(null);
  const [codigoIdoso, setCodigoIdoso] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");

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
    if (!usuario || !senha || !email || !nome || !dataNascimento) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

   const novoUsuario: CriarUsuario = {
    nomeUsuario: usuario,
    senha: senha,
    email: email,
    fotoPerfil: fotoPerfil || "",
    nome: nome,
    dataNascimento: dataNascimento,
    codigoVinculo: tipo === "CUIDADOR" ? codigoIdoso || null : null,
    tipoUsuario: (tipo === "CUIDADOR" && codigoIdoso) ? "CUIDADOR" : "IDOSO",
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
      Alert.alert(
        "Erro ao criar usuário",
        error.response?.data?.mensagem || error.message || "Erro desconhecido"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
        <Text style={styles.subtitulo}>Criar nova conta</Text>
      </View>

      <View style={styles.conteudo}>
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

          <View style={styles.inputGroup}>
            <Ionicons name="image" size={20} color="#444" />
            <TextInput
              style={styles.input}
              placeholder="URL da Foto de Perfil (opcional)"
              value={fotoPerfil}
              onChangeText={setFotoPerfil}
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="accessibility-outline" size={20} color="#444" />
            <View style={styles.containerCheckbox}>
              <Text>Idoso</Text>
              <Checkbox
                style={styles.inputCheckbox}
                value={tipo === "IDOSO"}
                onValueChange={() => setTipo("IDOSO")}
              />
              <Text>Cuidador</Text>
              <Checkbox
                style={styles.inputCheckbox}
                value={tipo === "CUIDADOR"}
                onValueChange={() => setTipo("CUIDADOR")}
              />
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

        <TouchableOpacity style={styles.botao} onPress={criarUsuario}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
