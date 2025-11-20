import 'app_exception.dart';

class UnknownException extends AppException {
  UnknownException({
    required super.message,
    super.code,
    super.stackTrace,
  });

  factory UnknownException.fromException(Object exception, StackTrace stackTrace) {
    return UnknownException(
      message: exception.toString(),
      code: 'UNKNOWN_ERROR',
      stackTrace: stackTrace,
    );
  }
}