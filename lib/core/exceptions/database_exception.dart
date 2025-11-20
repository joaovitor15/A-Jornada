import 'app_exception.dart';

class DatabaseException extends AppException {
  DatabaseException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  factory DatabaseException.notFound() => DatabaseException(
    message: 'Registro não encontrado',
    code: 'NOT_FOUND',
  );

  factory DatabaseException.duplicateEntry() => DatabaseException(
    message: 'Registro duplicado',
    code: 'DUPLICATE_ENTRY',
  );

  factory DatabaseException.constraintViolation() => DatabaseException(
    message: 'Violação de restrição do banco de dados',
    code: 'CONSTRAINT_VIOLATION',
  );

  factory DatabaseException.operationFailed() => DatabaseException(
    message: 'Operação de banco de dados falhou',
    code: 'OPERATION_FAILED',
  );

  factory DatabaseException.unknown({String? message}) => DatabaseException(
    message: message ?? 'Erro desconhecido do banco de dados',
    code: 'DATABASE_UNKNOWN',
  );
}