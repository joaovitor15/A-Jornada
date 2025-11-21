abstract class AuthSecureStorage {
  /// Salva JWT e Refresh tokens
  Future<void> saveTokens({
    required String jwtToken,
    required String? refreshToken,
    required String userId,
  });

  /// Recupera JWT token
  Future<String?> getJwtToken();

  /// Recupera Refresh token
  Future<String?> getRefreshToken();

  /// Recupera User ID
  Future<String?> getUserId();

  /// Verifica se tem token válido
  Future<bool> hasValidToken();

  /// Deleta todos os tokens (logout)
  Future<void> deleteAllTokens();

  /// Clear all (testes)
  Future<void> clearAll();
}
