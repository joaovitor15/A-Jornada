import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/core/exceptions/app_auth_exception.dart';
import '../models/auth_model.dart';
import '../models/login_request_model.dart';
import '../models/signup_request_model.dart';
import 'auth_remote_datasource.dart';

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final SupabaseClient _supabaseClient;

  AuthRemoteDataSourceImpl({required SupabaseClient supabaseClient})
      : _supabaseClient = supabaseClient;

  @override
  Future<AuthModel?> getCurrentUser() async {
    try {
      final user = _supabaseClient.auth.currentUser;
      if (user == null) {
        return null;
      }
      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
      );
    } catch (e, st) {
      throw AppAuthException(
        message: 'Falha ao obter usuário atual',
        code: 'GET_CURRENT_USER_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<AuthModel> login(LoginRequestModel request) async {
    try {
      final response = await _supabaseClient.auth.signInWithPassword(
        email: request.email,
        password: request.password,
      );

      final user = response.user;
      if (user == null) {
        throw AppAuthException(
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND',
        );
      }

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
      );
    } on AppAuthException {
      rethrow;
    } catch (e, st) {
      throw AppAuthException(
        message: 'Falha ao fazer login',
        code: 'LOGIN_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<AuthModel> signup(SignupRequestModel request) async {
    try {
      final response = await _supabaseClient.auth.signUp(
        email: request.email,
        password: request.password,
        data: {'display_name': request.displayName},
      );

      final user = response.user;
      if (user == null) {
        throw AppAuthException(
          message: 'Falha ao criar conta',
          code: 'SIGNUP_ERROR',
        );
      }

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: request.displayName,
        isEmailVerified: false,
      );
    } on AppAuthException {
      rethrow;
    } catch (e, st) {
      throw AppAuthException(
        message: 'Falha ao criar conta',
        code: 'SIGNUP_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _supabaseClient.auth.signOut();
    } catch (e, st) {
      throw AppAuthException(
        message: 'Falha ao fazer logout',
        code: 'LOGOUT_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> resetPassword(String email) async {
    try {
      await _supabaseClient.auth.resetPasswordForEmail(email);
    } catch (e, st) {
      throw AppAuthException(
        message: 'Falha ao resetar senha',
        code: 'RESET_PASSWORD_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> verifyEmail(String email, String code) async {
    try {
      await _supabaseClient.auth.verifyOTP(
        email: email,
        token: code,
        type: OtpType.email,
      );
    } catch (e, st) {
      throw AppAuthException(
        message: 'Código de verificação inválido',
        code: 'VERIFY_EMAIL_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<AuthModel> refreshToken() async {
    try {
      final session = _supabaseClient.auth.currentSession;
      if (session == null) {
        throw AppAuthException(
          message: 'Sessão expirada',
          code: 'SESSION_EXPIRED',
        );
      }

      final response = await _supabaseClient.auth.refreshSession();
      final user = response.user;

      if (user == null) {
        throw AppAuthException(
          message: 'Falha ao atualizar sessão',
          code: 'REFRESH_TOKEN_ERROR',
        );
      }

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
      );
    } on AppAuthException {
      rethrow;
    } catch (e, st) {
      throw AppAuthException(
        message: 'Falha ao atualizar sessão',
        code: 'REFRESH_TOKEN_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    try {
      final user = _supabaseClient.auth.currentUser;
      return user != null;
    } catch (_) {
      return false;
    }
  }

  @override
  Stream<AuthModel?> watchAuthState() {
    return _supabaseClient.auth.onAuthStateChange.map((data) {
      final user = data.session?.user;
      if (user == null) {
        return null;
      }
      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
      );
    });
  }
}