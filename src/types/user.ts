export interface User {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  campus: string;
  foto: string;
  sexo: string;
  tipo_usuario: string;
  curso: string;
  situacao: string;
  data_nascimento: string;
  is_active: boolean;
  is_staff: boolean;
  groups: string[];
}