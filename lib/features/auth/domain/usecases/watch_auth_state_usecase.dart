import 'package:myapp/core/utils/logger.dart';
import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class WatchAuthStateUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  WatchAuthStateUseCase({required this.repository});

  Stream<AuthEntity?> call() {
    // ✅ NOVO: Log do início do stream
    _logger
        .info('WatchAuthStateUseCase: Iniciando observação de estado de auth');

    return repository.watchAuthState().handleError((error, stackTrace) {
      // ✅ NOVO: Log de erro do stream
      _logger.error(
        'WatchAuthStateUseCase: Erro no stream de auth',
        err: error,
        stackTrace: stackTrace,
      );
    });
  }
}
