import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  
  logo: {
    alignItems: "center",
    marginTop: 40, 
    marginBottom: 20, 
  },

  scrollContent: {
    padding: 20, 
    flexGrow: 1,
    backgroundColor:"#FEF6E4"
  },
  formContainer: {
    gap: 10,
  },
  
  subtitulo: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
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
    height: 47, 
    marginLeft: 8, 
  },

  inputCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 8,
    margin: 10
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

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  
  labelWithIcon: {
    flexDirection: 'row',      
    alignItems: 'center',      
    marginBottom: 8,
    marginLeft: 4,
  },

  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,               
    flexShrink: 1,               
  },

  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },

  checkboxLabel: {
    fontSize: 14,
    color: "#444",
    marginRight: 6,
  },
  erro: {
    color: '#007BFF',
    fontSize: 12,
    marginBottom: 8,
}
});

export default styles;
