import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FEF6E4",
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
  formContainer: {
    marginBottom: 22,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 8,
  },
  containerCheckbox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    height: 48, 
    marginLeft: 8, 
  },

  inputCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 8,
    margin: 10
  },

  botao: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default styles;
