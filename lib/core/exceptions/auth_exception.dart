import 'app_exception.dart';

class AuthException extends AppException {
  AuthException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  factory AuthException.invalidEmail() => AuthException(
    message: 'Email inválido',
    code: 'INVALID_EMAIL',
  );

  factory AuthException.weakPassword() => AuthException(
    message: 'Senha muito fraca',
    code: 'WEAK_PASSWORD',
  );

  factory AuthException.userNotFound() => AuthException(
    message: 'Usuário não encontrado',
    code: 'USER_NOT_FOUND',
  );

  factory AuthException.wrongPassword() => AuthException(
    message: 'Senha incorreta',
    code: 'WRONG_PASSWORD',
  );

  factory AuthException.userAlreadyExists() => AuthException(
    message: 'Usuário já existe',
    code: 'USER_ALREADY_EXISTS',
  );

  factory AuthException.sessionExpired() => AuthException(
    message: 'Sessão expirada',
    code: 'SESSION_EXPIRED',
  );

  factory AuthException.unknown({String? message}) => AuthException(
    message: message ?? 'Erro de autenticação desconhecido',
    code: 'AUTH_UNKNOWN',
  );
}