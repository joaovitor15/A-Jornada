import 'package:myapp/core/utils/logger.dart';
import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class RefreshTokenUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  RefreshTokenUseCase({required this.repository});

  Future<AuthEntity> call() async {
    try {
      // ✅ NOVO: Log do início
      _logger.info('RefreshTokenUseCase: Renovando token');

      final result = await repository.refreshToken();

      // ✅ NOVO: Log de sucesso
      _logger.info('RefreshTokenUseCase: Token renovado com sucesso');

      return result;
    } catch (e, st) {
      // ✅ NOVO: Log de erro
      _logger.error(
        'RefreshTokenUseCase: Erro ao renovar token',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}
