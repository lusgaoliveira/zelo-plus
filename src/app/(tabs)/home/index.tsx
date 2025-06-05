import { useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Tarefas } from "../../../modelos/Tarefas";
import { Chamadas } from "../../../servicos/chamadasApi";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Burnt from "burnt";

export default function HomeScreen() {
  const { dados } = useLocalSearchParams();
  const usuario = dados ? JSON.parse(dados as string) : null;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tarefas, setTarefas] = useState<Tarefas[]>([]);
  const [pagina, setPagina] = useState(0);
  const [temMaisPaginas, setTemMaisPaginas] = useState(true);
  const [carregandoPagina, setCarregandoPagina] = useState(false);
  const [isScrollStarted, setIsScrollStarted] = useState(false);

  // refs para evitar stale closure
  const paginaRef = useRef(pagina);
  const temMaisPaginasRef = useRef(temMaisPaginas);
  const carregandoPaginaRef = useRef(carregandoPagina);

  // Sincroniza refs sempre que o estado mudar
  paginaRef.current = pagina;
  temMaisPaginasRef.current = temMaisPaginas;
  carregandoPaginaRef.current = carregandoPagina;

  const buscarTarefas = useCallback(async () => {
    if (!temMaisPaginasRef.current || carregandoPaginaRef.current) return;

    try {
      setCarregandoPagina(true);
      const resposta = await Chamadas.buscarTarefas(usuario.id, paginaRef.current);
      setTarefas((prev) => [...prev, ...resposta.content]);
      setTemMaisPaginas(!resposta.last);
      setPagina((prev) => prev + 1);
    } catch (error: any) {
      Burnt.toast({
        title: "Erro ao carregar tarefas",
        message: "Tente novamente mais tarde.",
        preset: "error",
      });
    } finally {
      setCarregandoPagina(false);
      setLoading(false);
    }
  }, [usuario.id]);

  useFocusEffect(
    useCallback(() => {
      setTarefas([]);
      setPagina(0);
      setTemMaisPaginas(true);
      setLoading(true);
      // Faz uma pequena espera para garantir o reset do estado antes da chamada

      setTimeout(() => {
        buscarTarefas();
      }, 0);
    }, [buscarTarefas])
  );

  const carregarMais = useCallback(() => {
    if (!carregandoPaginaRef.current && temMaisPaginasRef.current) {
      buscarTarefas();
    }
  }, [buscarTarefas]);

  const getIconByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "expirada":
        return <MaterialIcons name="pending-actions" size={20} color="orange" />;
      case "agendada":
        return <Feather name="loader" size={20} color="blue" />;
      case "concluida":
        return <FontAwesome5 name="check-circle" size={20} color="green" />;
      default:
        return <Feather name="alert-circle" size={20} color="gray" />;
    }
  };

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
      <View style={styles.itemStatusContainer}>
        {getIconByStatus(item.statusTarefa)}
        <Text style={styles.itemStatus}> {item.statusTarefa}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Tarefas</Text>
      </View>

      <View style={styles.listaContainer}>
        <FlatList
          data={tarefas}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          onEndReached={() => {
            if (isScrollStarted) {
              carregarMais();
              setIsScrollStarted(false);
            }
          }}
          onMomentumScrollBegin={() => setIsScrollStarted(true)}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            carregandoPagina ? (
              <ActivityIndicator size="small" color="#000" />
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Nenhuma tarefa encontrada.
              </Text>
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topo: {
    flex: 0.5,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
  },
  listaContainer: {
    flex: 1,
    padding: 8,
  },
  item: {
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  itemTitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemStatus: {
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
