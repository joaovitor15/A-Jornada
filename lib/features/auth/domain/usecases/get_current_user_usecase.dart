import 'package:myapp/core/utils/logger.dart';
import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class GetCurrentUserUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  GetCurrentUserUseCase({required this.repository});

  Future<AuthEntity?> call() async {
    try {
      // ✅ NOVO: Log do início
      _logger.info('GetCurrentUserUseCase: Buscando usuário atual');

      final user = await repository.getCurrentUser();

      if (user != null) {
        // ✅ NOVO: Log de sucesso
        _logger.info('GetCurrentUserUseCase: Usuário encontrado: ${user.id}');
      } else {
        // ✅ NOVO: Log quando não há usuário
        _logger.info('GetCurrentUserUseCase: Nenhum usuário ativo');
      }

      return user;
    } catch (e, st) {
      // ✅ NOVO: Log de erro
      _logger.error(
        'GetCurrentUserUseCase: Erro ao buscar usuário',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}
