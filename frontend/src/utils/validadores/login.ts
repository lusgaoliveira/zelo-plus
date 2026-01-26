import { object, string, boolean } from "yup";

const LoginSchema = object({
    nomeUsuario: string()
            .trim()
            .required('Falta o nome de usuário'),
    senha: string()
            .trim()
            .required('Falta a senha'),
});

export default LoginSchema;