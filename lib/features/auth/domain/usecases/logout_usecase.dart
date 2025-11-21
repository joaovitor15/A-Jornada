import 'package:myapp/core/utils/logger.dart';
import '../repositories/auth_repository.dart';

class LogoutUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  LogoutUseCase({required this.repository});

  Future<void> call() async {
    try {
      // ✅ NOVO: Log do início
      _logger.info('LogoutUseCase: Iniciando logout');

      await repository.logout();

      // ✅ NOVO: Log de sucesso
      _logger.info('LogoutUseCase: Logout bem-sucedido');
    } catch (e, st) {
      // ✅ NOVO: Log de erro
      _logger.error('LogoutUseCase: Erro ao fazer logout', err: e, stackTrace: st);
      rethrow;
    }
  }
}