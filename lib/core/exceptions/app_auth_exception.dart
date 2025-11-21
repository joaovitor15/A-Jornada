import 'app_exception.dart';

class AppAuthException extends AppException {
  AppAuthException({
    required super.message,
    super.code,
    super.stackTrace,
  });
}
