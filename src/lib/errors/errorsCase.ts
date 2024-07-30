import { CredentialsSignin } from "next-auth";
class UserNotFound extends CredentialsSignin{
    code ="Usuário não encontrado.";
}
class InvalidPassword extends CredentialsSignin{
    code ="Senha inválida.";
}
class InvalidCredentials extends CredentialsSignin{
    code = "Credenciais inválidas.";
}
export { InvalidCredentials, InvalidPassword, UserNotFound };

