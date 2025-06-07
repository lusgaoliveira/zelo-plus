export interface CriarUsuario {
  nomeUsuario: string;
  senha: string;
  email: string;
  nome: string;
  tipoUsuario: string;
  dataNascimento: string; 
  codigoVinculo: string | null;
}
