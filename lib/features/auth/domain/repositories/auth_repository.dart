import '../entities/auth_entity.dart';

abstract class AuthRepository {
  // Get current authenticated user
  Future<AuthEntity?> getCurrentUser();

  // Login with email and password
  Future<AuthEntity> login({
    required String email,
    required String password,
  });

  // Sign up with email and password
  Future<AuthEntity> signup({
    required String email,
    required String password,
    required String displayName,
  });

  // Logout current user
  Future<void> logout();

  // Reset password
  Future<void> resetPassword(String email);

  // Verify email with code
  Future<void> verifyEmail(String email, String code);

  // Refresh authentication token
  Future<AuthEntity> refreshToken();

  // Check if user is currently authenticated
  Future<bool> isAuthenticated();

  // Watch auth state changes (streaming)
  Stream<AuthEntity?> watchAuthState();
}