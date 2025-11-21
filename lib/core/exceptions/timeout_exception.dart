import 'app_exception.dart';

class TimeoutException extends AppException {
  TimeoutException({
    super.message = 'Tempo limite excedido. Tente novamente.',
    super.code = 'TIMEOUT_ERROR',
    super.stackTrace,
  });
}
