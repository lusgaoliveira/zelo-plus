import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

export default function CriarTarefaHomeScreen() {
    const [tiposTarefa, setTiposTarefa] = useState([]);
    const [carregandoTipos, setCarregandoTipos] = useState(true);

    // useEffect(() => {
    //     const fetchTipos = async () => {
    //         try {
    //         const response = await instance.get("/tipos-tarefa"); // exemplo de endpoint
    //         setTiposTarefa(response.data);
    //         } catch (error) {
    //         console.error("Erro ao carregar tipos de tarefa", error);
    //         } finally {
    //         setCarregandoTipos(false);
    //         }
    //     };

    //     fetchTipos();
    // }, []);

    return (
       <View>
            <Text>Olá</Text>
       </View>
    );
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topo: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listaContainer: {
    flex: 0.5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemTitulo: {
    fontWeight: "bold",
  },
  itemStatus: {
    marginTop: 4,
  },
});
