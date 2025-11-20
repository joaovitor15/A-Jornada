import 'app_exception.dart';

class ValidationException extends AppException {
  ValidationException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  factory ValidationException.emptyField(String fieldName) => ValidationException(
    message: '$fieldName não pode estar vazio',
    code: 'EMPTY_FIELD',
  );

  factory ValidationException.invalidFormat(String fieldName) => ValidationException(
    message: '$fieldName tem formato inválido',
    code: 'INVALID_FORMAT',
  );

  factory ValidationException.lengthMismatch({
    required String fieldName,
    required int minLength,
    required int maxLength,
  }) => ValidationException(
    message: '$fieldName deve ter entre $minLength e $maxLength caracteres',
    code: 'LENGTH_MISMATCH',
  );

  factory ValidationException.unknown({String? message}) => ValidationException(
    message: message ?? 'Erro de validação desconhecido',
    code: 'VALIDATION_UNKNOWN',
  );
}