import * as Yup from "yup";

const CriarUsuarioSchema = Yup.object().shape({
  nome: Yup.string().required("Nome é obrigatório"),
  nomeUsuario: Yup.string().required("Nome de usuário é obrigatório"),
  senha: Yup.string().min(6, "Mínimo de 6 caracteres").required("Senha é obrigatória"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  dataNascimento: Yup.string().required("Data de nascimento é obrigatória"),
  tipoUsuario: Yup.string()
    .oneOf(["IDOSO", "CUIDADOR"], "Tipo inválido")
    .required("Tipo de usuário é obrigatório"),
  codigoVinculo: Yup.string()
    .nullable()
    .when("tipoUsuario", {
      is: "CUIDADOR",
      then: (schema) => schema.required("Código do idoso é obrigatório"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export default CriarUsuarioSchema;
