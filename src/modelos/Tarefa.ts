export interface TipoTarefa {
  id: number;
  nome: string;
}

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  dataCriacao: string;       
  dataAgendamento: string;   
  tipoTarefa: TipoTarefa;
  nivel: number;
  statusTarefa: string;
}
