import 'app_exception.dart';

class AppNetworkException extends AppException {
  AppNetworkException({
    required super.message,
    super.code,
    super.stackTrace,
  });
}