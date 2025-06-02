import instance from "../infra/axiosConfig";
import { CriarUsuario } from "../modelos/CriarUsuario";
import { Login } from "../modelos/Login";

const pegarErros = (error: any): never => {
  if (error.response) {
    const message = error.response.data.error || error.response.data;
    throw new Error(message);
  } else if (error.request) {
    throw new Error(
      "Erro na conexão com o servidor. Tente novamente mais tarde."
    );
  } else {
    throw new Error("Erro desconhecido. Tente novamente mais tarde.");
  }
};

function converterDataBrasileiraParaISO(data: string): string {
  const [dia, mes, ano] = data.split("/");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}


export class Chamadas {
  static async login(dados: Login) {
    try {
        const payload = {
            ...dados
        }
        console.log(payload)
        const resposta = await instance.post("/login", payload);
        return resposta.data;
    } catch (error) {
      pegarErros(error);
    }
  }

  static async criarUsuario(dados: CriarUsuario) {
    try {
        const payload = {
        ...dados,
        dataNascimento: converterDataBrasileiraParaISO(dados.dataNascimento),
      };
      const resposta = await instance.post("/usuarios/criar", payload);
      return resposta.data;
    } catch (error) {
      pegarErros(error);
    }
  }

  static async buscarTarefas(id: number, pagina = 0) {
    try {
      const resposta = await instance.get(`/tarefas/buscartarefas/${id}`, {
        params: { page: pagina }
      });
      return resposta.data; 
    } catch (error) {
      pegarErros(error);
    }
  }

  static async buscarTarefa(id: number) {
    try {
      const resposta = await instance.get(`/tarefas/buscar/${id}`);
      return resposta.data
    } catch (error) {
      pegarErros(error)
    }
  }
}
