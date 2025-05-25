import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import styles from "./styles";
import { useState } from "react";
import Checkbox from 'expo-checkbox';
import Logo from "../../components/logo";
export default function CadastroScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<'Idoso' | 'Cuidador' | null>(null);
  const [nomeIdoso, setNomeIdoso] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const formatarData = (texto: string) => {
    // Remove tudo que não for número
    const numeros = texto.replace(/\D/g, '');

    let resultado = '';
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

  const handleLogin = () => {
    console.log("Usuário:", usuario, "Senha:", senha);
  };

  return (
    <View style={styles.container}>
        <View style={styles.logo}>
            <Logo />
            <Text style={styles.subtitulo}>Acesse sua conta</Text>
        </View>

      <View style={styles.conteudo}>
        <View style={styles.formContainer}>

          <View style={styles.inputGroup}>
            <Ionicons name="person-circle" size={20} color="#444" />
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
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
            <Ionicons name="accessibility-outline" size={20} color="#444" />

            <View style={styles.containerCheckbox}>
              <Text>Idoso</Text>
              <Checkbox
                style={styles.inputCheckbox}
                value={tipo === 'Idoso'}
                onValueChange={() => setTipo('Idoso')}
              />
              <Text>Cuidador</Text>
              <Checkbox
                style={styles.inputCheckbox}
                value={tipo === 'Cuidador'}
                onValueChange={() => setTipo('Cuidador')}
              />
            </View>
          </View>

          {tipo === 'Cuidador' && (
            <View style={styles.inputGroup}>
                <Ionicons name="code-working" size={20} color="#444" />
                <TextInput
                  style={styles.input}
                  value={nomeIdoso}
                  onChangeText={setNomeIdoso}
                  maxLength={8}
                  placeholder="Digite o código de vínculo do idoso assistido"
                />
              </View>
            )}

      

          <View style={styles.inputGroup}>
            <Ionicons name="mail" size={20} color="#444" />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
            />
          </View>

          

          <View style={styles.inputGroup}>
            <Ionicons name="calendar-outline" size={20} color="#444" />
            <TextInput
              style={styles.input}
              placeholder="Data de Nascimento"
              keyboardType="numeric"
              maxLength={10}
              value={dataNascimento}
              onChangeText={formatarData}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
