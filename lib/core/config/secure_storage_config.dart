import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageConfig {
  static const String _jwtTokenKey = 'jwt_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userIdKey = 'user_id';

  static final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(
      resetOnError: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.unlocked,
    ),
  );

  /// Salva JWT token
  static Future<void> saveJwtToken(String token) async {
    await _storage.write(key: _jwtTokenKey, value: token);
  }

  /// Recupera JWT token
  static Future<String?> getJwtToken() async {
    return await _storage.read(key: _jwtTokenKey);
  }

  /// Salva Refresh token
  static Future<void> saveRefreshToken(String token) async {
    await _storage.write(key: _refreshTokenKey, value: token);
  }

  /// Recupera Refresh token
  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  /// Salva User ID
  static Future<void> saveUserId(String userId) async {
    await _storage.write(key: _userIdKey, value: userId);
  }

  /// Recupera User ID
  static Future<String?> getUserId() async {
    return await _storage.read(key: _userIdKey);
  }

  /// Deleta todos os tokens (logout)
  static Future<void> deleteAllTokens() async {
    await Future.wait([
      _storage.delete(key: _jwtTokenKey),
      _storage.delete(key: _refreshTokenKey),
      _storage.delete(key: _userIdKey),
    ]);
  }

  /// Verifica se tem token salvo
  static Future<bool> hasToken() async {
    final token = await _storage.read(key: _jwtTokenKey);
    return token != null && token.isNotEmpty;
  }

  /// Clear all (para testes)
  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}