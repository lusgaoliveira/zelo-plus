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
import { Tarefas } from "../../../modelos/Tarefas";
import { Chamadas } from "../../../servicos/chamadasApi";

export default function HomeScreen() {
  const { dados } = useLocalSearchParams();
  const usuario = dados ? JSON.parse(dados as string) : null;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tarefas, setTarefas] = useState<Tarefas[]>([]);
  const [pagina, setPagina] = useState(0);
  const [temMaisPaginas, setTemMaisPaginas] = useState(true);
  const [carregandoPagina, setCarregandoPagina] = useState(false);

  const buscarTarefas = async () => {
    if (!temMaisPaginas || carregandoPagina) return;
    try {
      setCarregandoPagina(true);
      const resposta = await Chamadas.buscarTarefas(usuario.id, pagina);
      setTarefas((prev) => [...prev, ...resposta.content]);
      setTemMaisPaginas(!resposta.last);
      setPagina((prev) => prev + 1);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setCarregandoPagina(false);
      setLoading(false);
    }
  };

  const carregarMais = useCallback(() => {
    if (!carregandoPagina && temMaisPaginas) {
      buscarTarefas();
    }
  }, [carregandoPagina, temMaisPaginas]);

  useEffect(() => {
    buscarTarefas();
  }, []);

  const renderItem = ({ item }: { item: Tarefas }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: "/detalhes/[id]",
          params: { id: item.id.toString() },
        })
      }
    >
      <Text style={styles.itemTitulo}>{item.titulo}</Text>
      <Text style={styles.itemStatus}>Status: {item.statusTarefa}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Parte superior da tela - título e conteúdo futuro */}
      <View style={styles.topo}>
        <Text style={styles.titulo}>Tarefas</Text>
        {/* Aqui você pode adicionar mais conteúdo futuramente */}
      </View>

      {/* Parte inferior da tela - FlatList */}
      <View style={styles.listaContainer}>
        <FlatList
          data={tarefas}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            carregandoPagina ? (
              <ActivityIndicator size="small" color="#000" />
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
