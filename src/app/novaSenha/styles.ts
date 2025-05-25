import {

  StyleSheet,
} from 'react-native';

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
export default styles;