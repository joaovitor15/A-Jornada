import 'app_exception.dart';

class AppValidationException extends AppException {
  AppValidationException({
    required super.message,
    super.code,
    super.stackTrace,
  });
}