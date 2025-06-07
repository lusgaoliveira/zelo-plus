export interface CriarUsuario {
  nomeUsuario: string;
  senha: string;
  email: string;
  fotoPerfil: string;
  nome: string;
  tipoUsuario: string;
  dataNascimento: string; 
  codigoVinculo: string | null;
}
