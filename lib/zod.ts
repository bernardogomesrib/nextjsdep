import { getFilteredRowModel } from '@tanstack/react-table';
import { object, RefinementCtx, string, z, ZodIssueCode } from "zod";

export const signInSchema = object({
  email: string({ required_error: "E-mail é obrigatório" })
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: string({ required_error: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter mais de 6 caracteres")
    .max(32, "Senha deve ter menos de 32 caracteres"),
});

export const CredentialsSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
});

export const signUpSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório."),
  email: z.string().email("E-mail inválido."),
  telephone: z.string()
    .max(11, "O número deve ter os dois números de área e os 9 números do telefone")
    .min(11, "O número deve ter os dois números de área e os 9 números do telefone")
    .optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
});

export const idosoSchema = z.object({
  nome: z.string({message:"Não é possivel cadastrar sem nome"}).min(3, "Nome é obrigatório."),
  cpf: z.string({message:"Não é possivel cadastrar sem CPF"}).min(11, "CPF é obrigatório.").max(11, "CPF deve ter 11 dígitos."),
  email: z.string({message:"E-mail inválido"}).email("E-mail inválido."),
  telefone: z.string()
    .max(11, "O número deve ter os dois números de área e os 9 números do telefone")
    .min(11, "O número deve ter os dois números de área e os 9 números do telefone")
    .optional(),
});

export const InstituicoesParceirasSchema = z.object({
  nome: z.string({message:"Nome é obrigatório."}).min(3, "Nome é obrigatório."),
  cnpj: z.string({message:"CNPJ é obrigatório."}).min(14, "CNPJ é obrigatório.").max(14, "CNPJ deve ter 14 dígitos."),
  email: z.string().email("E-mail inválido."),
  telefone: z.string()
    .max(11, "O número deve ter os dois números de área e os 9 números do telefone")
    .min(11, "O número deve ter os dois números de área e os 9 números do telefone")
    .optional(),
  endereco: z.string({message:"Endereço é obrigatório."}).min(5, "Endereço é obrigatório."),
});

export const ValidadeSchema = z.object({
  validade: z.date({ message: "Data de validade é obrigatória!" }).superRefine((value: Date, context: RefinementCtx): boolean => {
    const currentDate = new Date();
    if (value === null) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Data de validade é obrigatória.",
        fatal: true,
      });
      return z.NEVER;
    }
    if (value <= currentDate) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Data de validade deve ser posterior à data atual.",
        fatal: true,
      });
      return z.NEVER;
    }
    return true;
  }),
  quantidade: z.number({ message: "Quantidade é obrigatória!" }).min(1, "Quantidade deve ser maior que 0."),
  lote: z.string({ message: "Lote é obrigatório" }).min(3, "Lote é obrigatório."),
  fabricacao: z.date({ message: "Data de fabricação é obrigatória" }).superRefine((value: Date, context: RefinementCtx): boolean => {
    const currentDate = new Date();
    if (value >= currentDate) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Data de fabricação deve ser anterior à data atual.",
        fatal: true,
      });
      return z.NEVER;
    }
    const validade = getFilteredRowModel().arguments.validade;
    if (validade && value >= validade) {
      context.addIssue({
        code: ZodIssueCode.custom,
        message: "Data de fabricação deve ser anterior à data de validade.",
        fatal: true,
      });
      return z.NEVER;
    }
    return true;
  }),
});
