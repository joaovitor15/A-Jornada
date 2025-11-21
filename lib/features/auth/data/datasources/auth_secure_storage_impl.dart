import 'package:myapp/core/config/secure_storage_config.dart';
import 'package:myapp/core/utils/logger.dart';
import 'auth_secure_storage.dart';

class AuthSecureStorageImpl implements AuthSecureStorage {
  final Logger _logger = Logger();

  @override
  Future<void> saveTokens({
    required String jwtToken,
    required String? refreshToken,
    required String userId,
  }) async {
    try {
      _logger.info(
        'AuthSecureStorageImpl: Salvando tokens para usuário $userId',
      );

      await SecureStorageConfig.saveJwtToken(jwtToken);
      if (refreshToken != null) {
        await SecureStorageConfig.saveRefreshToken(refreshToken);
      }
      await SecureStorageConfig.saveUserId(userId);

      _logger.info('AuthSecureStorageImpl: Tokens salvos com sucesso');
    } catch (e, st) {
      _logger.error(
        'AuthSecureStorageImpl: Erro ao salvar tokens',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<String?> getJwtToken() async {
    try {
      _logger.info('AuthSecureStorageImpl: Recuperando JWT token');

      final token = await SecureStorageConfig.getJwtToken();

      if (token != null) {
        _logger.info('AuthSecureStorageImpl: JWT token encontrado');
      } else {
        _logger.info('AuthSecureStorageImpl: JWT token não encontrado');
      }

      return token;
    } catch (e, st) {
      _logger.error(
        'AuthSecureStorageImpl: Erro ao recuperar JWT token',
        err: e,
        stackTrace: st,
      );
      return null;
    }
  }

  @override
  Future<String?> getRefreshToken() async {
    try {
      _logger.info('AuthSecureStorageImpl: Recuperando refresh token');

      final token = await SecureStorageConfig.getRefreshToken();

      if (token != null) {
        _logger.info('AuthSecureStorageImpl: Refresh token encontrado');
      } else {
        _logger.info('AuthSecureStorageImpl: Refresh token não encontrado');
      }

      return token;
    } catch (e, st) {
      _logger.error(
        'AuthSecureStorageImpl: Erro ao recuperar refresh token',
        err: e,
        stackTrace: st,
      );
      return null;
    }
  }

  @override
  Future<String?> getUserId() async {
    try {
      _logger.info('AuthSecureStorageImpl: Recuperando user ID');

      final userId = await SecureStorageConfig.getUserId();

      if (userId != null) {
        _logger.info('AuthSecureStorageImpl: User ID encontrado: $userId');
      } else {
        _logger.info('AuthSecureStorageImpl: User ID não encontrado');
      }

      return userId;
    } catch (e, st) {
      _logger.error(
        'AuthSecureStorageImpl: Erro ao recuperar user ID',
        err: e,
        stackTrace: st,
      );
      return null;
    }
  }

  @override
  Future<bool> hasValidToken() async {
    try {
      _logger.info('AuthSecureStorageImpl: Verificando validade do token');

      final hasToken = await SecureStorageConfig.hasToken();

      _logger.info('AuthSecureStorageImpl: Token válido = $hasToken');
      return hasToken;
    } catch (e, st) {
      _logger.error(
        'AuthSecureStorageImpl: Erro ao verificar validade do token',
        err: e,
        stackTrace: st,
      );
      return false;
    }
  }

  @override
  Future<void> deleteAllTokens() async {
    try {
      _logger.info('AuthSecureStorageImpl: Deletando todos os tokens');

      await SecureStorageConfig.deleteAllTokens();

      _logger.info('AuthSecureStorageImpl: Todos os tokens deletados');
    } catch (e, st) {
      _logger.error(
        'AuthSecureStorageImpl: Erro ao deletar tokens',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> clearAll() async {
    try {
      _logger.info('AuthSecureStorageImpl: Limpando armazenamento seguro');

      await SecureStorageConfig.clearAll();

      _logger.info('AuthSecureStorageImpl: Armazenamento limpo');
    } catch (e, st) {
      _logger.error(
        'AuthSecureStorageImpl: Erro ao limpar armazenamento',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}