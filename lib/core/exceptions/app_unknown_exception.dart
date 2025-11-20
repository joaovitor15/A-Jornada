import 'app_exception.dart';

class AppUnknownException extends AppException {
  AppUnknownException({
    required super.message,
    super.code,
    super.stackTrace,
  });
}