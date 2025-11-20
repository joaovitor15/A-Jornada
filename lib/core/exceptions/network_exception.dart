import 'app_exception.dart';

class NetworkException extends AppException {
  NetworkException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  factory NetworkException.noConnection() => NetworkException(
    message: 'Sem conexão com a internet',
    code: 'NO_CONNECTION',
  );

  factory NetworkException.timeout() => NetworkException(
    message: 'Tempo limite de conexão excedido',
    code: 'TIMEOUT',
  );

  factory NetworkException.badRequest() => NetworkException(
    message: 'Solicitação inválida',
    code: 'BAD_REQUEST',
  );

  factory NetworkException.unauthorized() => NetworkException(
    message: 'Não autorizado',
    code: 'UNAUTHORIZED',
  );

  factory NetworkException.forbidden() => NetworkException(
    message: 'Acesso proibido',
    code: 'FORBIDDEN',
  );

  factory NetworkException.notFound() => NetworkException(
    message: 'Recurso não encontrado',
    code: 'NOT_FOUND',
  );

  factory NetworkException.serverError() => NetworkException(
    message: 'Erro no servidor',
    code: 'SERVER_ERROR',
  );

  factory NetworkException.unknown({String? message}) => NetworkException(
    message: message ?? 'Erro de rede desconhecido',
    code: 'NETWORK_UNKNOWN',
  );
}