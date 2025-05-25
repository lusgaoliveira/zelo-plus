import { object, string } from "yup";

const RecuperacaoSchema = object({
    email: string()
    .trim()
    .email('Email válido é obrigatório'),
});
export default RecuperacaoSchema;