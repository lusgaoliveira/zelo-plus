import instance from "../infra/axiosConfig";
import { CriarUsuario } from "../modelos/CriarUsuario";
import { Login } from "../modelos/Login";
import { Perfil } from "../modelos/Perfil";
import { Tarefa, TipoTarefa } from "../modelos/Tarefa";


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

  static async listarTiposTarefa(): Promise<TipoTarefa[]> {
    try {
      const resposta = await instance.get("/tipos-tarefa");
      return resposta.data;
    } catch (error) {
      pegarErros(error);
      throw error; 
    }
  } 

  static async criarTarefa(dados: any): Promise<void> {
    try {
      await instance.post("/tarefas/criar", dados);
    } catch (error) {
      pegarErros(error);
      throw error;
    }
  }

  static async concluirTarefa(idTarefa: number): Promise<void> {
    try {
      const resposta = await instance.patch(`/tarefas/concluir/${idTarefa}`)
      return resposta.data;
    } catch (error) {
      pegarErros(error)
      throw error;
    }
  }

  static async excluirTarefa(idTarefa: number): Promise<void> {
    try {
      const resposta = await instance.patch(`/tarefas/excluir/${idTarefa}`)
      return resposta.data;
    } catch (error) {
      pegarErros(error)
      throw error;
    }
  }
  static async atualizarTarefa(id: number, dados: Partial<Tarefa>): Promise<Tarefa> {
    try {
      const resposta = await instance.patch(`/tarefas/${id}`, dados);
      return resposta.data;
    } catch (error) {
      pegarErros(error);
      throw error;
    }
  }
  static async buscarPerfil(id: number): Promise<Perfil> {
    try {
      const resposta = await instance.get<Perfil>(`/usuarios/perfil/${id}`)
      return resposta.data;
    } catch (error) {
      pegarErros(error)
      throw error;
    }
  }


  static async atualizarPerfil(id: number, dados: any): Promise<void> {
  try {
    const payload = { ...dados };

    if (dados.fotoPerfil && dados.fotoPerfil.startsWith("data:image")) {
      payload.fotoPerfil = dados.fotoPerfil.split(",")[1]; 
    }

    const resposta = await instance.patch(`/usuarios/perfil/${id}`, payload);
    return resposta.data;
  } catch (error) {
    pegarErros(error);
    throw error;
  }
}

  static async gerarVinculo(id: number): Promise<void> {
    try {
      const resposta = await instance.patch(`/usuarios/gerar-vinculo/${id}`);
      return resposta.data;
    } catch (error) {
      pegarErros(error)
      throw error;
    }
  }

  static async buscarTarefasPorCriterioEMes(id: number, criterio: String, mes: number) {

    try {
      const resposta = await instance.get(`/tarefas/${criterio}`, {
        params: {
          id: id,
          mes: mes ?? "",
        },
      })
      return resposta.data;
    } catch (error) {
      pegarErros(error)
      throw error;
    }
  }
  
  static async atualizarSenha(id: number, senha: string) {
    
    try {
      const resposta = await instance.patch(`/usuarios/atualizar-senha/${id}`, { senha });
      return resposta.data;
    } catch (error) {
      pegarErros(error);
      throw error;
    }
  }

  static async recuperarSenha(email: string) {
    try {
      const resposta = await instance.patch(`/usuarios/recuperar-senha`, email);
      return resposta.data;
    } catch (error) {
      pegarErros(error)
      throw error;
    }
  }
}
