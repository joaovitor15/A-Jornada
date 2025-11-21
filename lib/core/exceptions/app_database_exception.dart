import 'app_exception.dart';

class AppDatabaseException extends AppException {
  AppDatabaseException({
    required super.message,
    super.code,
    super.stackTrace,
  });
}
