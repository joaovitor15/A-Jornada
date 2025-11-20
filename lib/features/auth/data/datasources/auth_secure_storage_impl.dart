import 'package:myapp/core/config/secure_storage_config.dart';
import 'package:myapp/core/utils/logger.dart';
import 'auth_secure_storage.dart';

class AuthSecureStorageImpl implements AuthSecureStorage {
  @override
  Future<void> saveTokens({
    required String jwtToken,
    required String? refreshToken,
    required String userId,
  }) async {
    try {
      await SecureStorageConfig.saveJwtToken(jwtToken);
      if (refreshToken != null) {
        await SecureStorageConfig.saveRefreshToken(refreshToken);
      }
      await SecureStorageConfig.saveUserId(userId);
      logger.info('Tokens saved securely');
    } catch (e, st) {
      logger.error('Failed to save tokens', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<String?> getJwtToken() async {
    try {
      return await SecureStorageConfig.getJwtToken();
    } catch (e, st) {
      logger.error('Failed to get JWT token', err: e, stackTrace: st);
      return null;
    }
  }

  @override
  Future<String?> getRefreshToken() async {
    try {
      return await SecureStorageConfig.getRefreshToken();
    } catch (e, st) {
      logger.error('Failed to get refresh token', err: e, stackTrace: st);
      return null;
    }
  }

  @override
  Future<String?> getUserId() async {
    try {
      return await SecureStorageConfig.getUserId();
    } catch (e, st) {
      logger.error('Failed to get user ID', err: e, stackTrace: st);
      return null;
    }
  }

  @override
  Future<bool> hasValidToken() async {
    try {
      return await SecureStorageConfig.hasToken();
    } catch (e, st) {
      logger.error('Failed to check token validity', err: e, stackTrace: st);
      return false;
    }
  }

  @override
  Future<void> deleteAllTokens() async {
    try {
      await SecureStorageConfig.deleteAllTokens();
      logger.info('All tokens deleted');
    } catch (e, st) {
      logger.error('Failed to delete tokens', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<void> clearAll() async {
    try {
      await SecureStorageConfig.clearAll();
      logger.info('Secure storage cleared');
    } catch (e, st) {
      logger.error('Failed to clear storage', err: e, stackTrace: st);
      rethrow;
    }
  }
}
