import '../models/auth_model.dart';
import '../models/login_request_model.dart';
import '../models/signup_request_model.dart';

abstract class AuthRemoteDataSource {
  Future<AuthModel?> getCurrentUser();
  Future<AuthModel> login(LoginRequestModel request);
  Future<AuthModel> signup(SignupRequestModel request);
  Future<void> logout();
  Future<void> resetPassword(String email);
  Future<void> verifyEmail(String email, String code);
  Future<AuthModel> refreshToken();
  Future<bool> isAuthenticated();
  Stream<AuthModel?> watchAuthState();

  // ✅ NOVO: Método para obter JWT real
  Future<String?> getAccessToken();
}
