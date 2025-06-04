export interface Perfil {
  id: number;
  nomeUsuario: string;
  fotoPerfil: string;
  email: string;
  nome: string;
  dataNascimento: string; // formato ISO, ex: '2000-01-01'
  tipoUsuario: string; // pode ser 'IDOSO', 'CUIDADOR'
  idUsuario: number;
  codigoVinculo: string;
}
