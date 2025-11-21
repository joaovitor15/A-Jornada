import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import '../models/auth_model.dart';
import '../models/login_request_model.dart';
import '../models/signup_request_model.dart';
import 'auth_remote_datasource.dart';

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final SupabaseClient _supabaseClient;
  final Logger _logger = Logger();

  AuthRemoteDataSourceImpl({required SupabaseClient supabaseClient})
      : _supabaseClient = supabaseClient;

  /// Converte para DateTime de forma segura
  DateTime _parseDateTime(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }

  /// Converte para DateTime? de forma segura
  DateTime? _parseDateTimeNullable(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value);
    return null;
  }

  @override
  Future<AuthModel?> getCurrentUser() async {
    try {
      _logger.info('AuthRemoteDataSourceImpl: Buscando usuário do Supabase');

      final user = _supabaseClient.auth.currentUser;
      if (user == null) {
        _logger.info('AuthRemoteDataSourceImpl: Nenhum usuário no Supabase');
        return null;
      }

      _logger.info('AuthRemoteDataSourceImpl: Usuário encontrado: ${user.id}');

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
        createdAt: _parseDateTime(user.createdAt),
        lastSignInAt: _parseDateTimeNullable(user.lastSignInAt),
      );
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro ao buscar usuário',
        err: e,
        stackTrace: st,
      );
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
      _logger.info(
        'AuthRemoteDataSourceImpl: Enviando login para ${request.email}',
      );

      final response = await _supabaseClient.auth.signInWithPassword(
        email: request.email,
        password: request.password,
      );

      final user = response.user;
      if (user == null) {
        _logger.warning('AuthRemoteDataSourceImpl: Login retornou usuário nulo');
        throw AppAuthException(
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND',
        );
      }

      _logger.info('AuthRemoteDataSourceImpl: Login bem-sucedido para ${user.id}');

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
        createdAt: _parseDateTime(user.createdAt),
        lastSignInAt: _parseDateTimeNullable(user.lastSignInAt),
      );
    } on AppAuthException {
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro no login',
        err: e,
        stackTrace: st,
      );
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
      _logger.info(
        'AuthRemoteDataSourceImpl: Enviando signup para ${request.email}',
      );

      final response = await _supabaseClient.auth.signUp(
        email: request.email,
        password: request.password,
        data: {'display_name': request.displayName},
      );

      final user = response.user;
      if (user == null) {
        _logger.warning('AuthRemoteDataSourceImpl: Signup retornou usuário nulo');
        throw AppAuthException(
          message: 'Falha ao criar conta',
          code: 'SIGNUP_ERROR',
        );
      }

      _logger.info('AuthRemoteDataSourceImpl: Signup bem-sucedido para ${user.id}');

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: request.displayName,
        isEmailVerified: false,
        createdAt: _parseDateTime(user.createdAt),
        lastSignInAt: _parseDateTimeNullable(user.lastSignInAt),
      );
    } on AppAuthException {
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro no signup',
        err: e,
        stackTrace: st,
      );
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
      _logger.info('AuthRemoteDataSourceImpl: Enviando logout ao Supabase');

      await _supabaseClient.auth.signOut();

      _logger.info('AuthRemoteDataSourceImpl: Logout bem-sucedido');
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro no logout',
        err: e,
        stackTrace: st,
      );
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
      _logger.info('AuthRemoteDataSourceImpl: Enviando reset de senha para $email');

      await _supabaseClient.auth.resetPasswordForEmail(email);

      _logger.info('AuthRemoteDataSourceImpl: Email de reset enviado');
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro ao resetar senha',
        err: e,
        stackTrace: st,
      );
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
      _logger.info('AuthRemoteDataSourceImpl: Verificando email $email');

      await _supabaseClient.auth.verifyOTP(
        email: email,
        token: code,
        type: OtpType.email,
      );

      _logger.info('AuthRemoteDataSourceImpl: Email verificado com sucesso');
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro ao verificar email',
        err: e,
        stackTrace: st,
      );
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
      _logger.info('AuthRemoteDataSourceImpl: Renovando token');

      final session = _supabaseClient.auth.currentSession;
      if (session == null) {
        _logger.warning('AuthRemoteDataSourceImpl: Sessão nula ao renovar token');
        throw AppAuthException(
          message: 'Sessão expirada',
          code: 'SESSION_EXPIRED',
        );
      }

      final response = await _supabaseClient.auth.refreshSession();
      final user = response.user;

      if (user == null) {
        _logger.warning('AuthRemoteDataSourceImpl: Usuário nulo após refresh');
        throw AppAuthException(
          message: 'Falha ao atualizar sessão',
          code: 'REFRESH_TOKEN_ERROR',
        );
      }

      _logger.info('AuthRemoteDataSourceImpl: Token renovado com sucesso');

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
        createdAt: _parseDateTime(user.createdAt),
        lastSignInAt: _parseDateTimeNullable(user.lastSignInAt),
      );
    } on AppAuthException {
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro ao renovar token',
        err: e,
        stackTrace: st,
      );
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
      _logger.info('AuthRemoteDataSourceImpl: Verificando autenticação');

      final user = _supabaseClient.auth.currentUser;
      final result = user != null;

      _logger.info('AuthRemoteDataSourceImpl: Autenticado = $result');
      return result;
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro ao verificar autenticação',
        err: e,
        stackTrace: st,
      );
      return false;
    }
  }

  @override
  Stream<AuthModel?> watchAuthState() {
    _logger.info('AuthRemoteDataSourceImpl: Iniciando observação de auth state');

    return _supabaseClient.auth.onAuthStateChange.map((data) {
      final user = data.session?.user;
      if (user == null) {
        _logger.info('AuthRemoteDataSourceImpl: Usuário deslogado (stream)');
        return null;
      }

      _logger.info('AuthRemoteDataSourceImpl: Estado atualizado para ${user.id}');

      return AuthModel(
        id: user.id,
        email: user.email ?? '',
        displayName: user.userMetadata?['display_name'],
        isEmailVerified: user.emailConfirmedAt != null,
        createdAt: _parseDateTime(user.createdAt),
        lastSignInAt: _parseDateTimeNullable(user.lastSignInAt),
      );
    });
  }

  // ✅ NOVO: Método para obter session.accessToken (JWT real)
  @override
  Future<String?> getAccessToken() async {
    try {
      _logger.info('AuthRemoteDataSourceImpl: Recuperando JWT da sessão');

      final session = _supabaseClient.auth.currentSession;
      if (session == null) {
        _logger.warning(
          'AuthRemoteDataSourceImpl: Sessão nula ao buscar access token',
        );
        return null;
      }

      final accessToken = session.accessToken;

      if (accessToken.isNotEmpty) {
        _logger.info('AuthRemoteDataSourceImpl: JWT obtido com sucesso');
      } else {
        _logger.warning('AuthRemoteDataSourceImpl: Access token vazio');
      }

return accessToken.isNotEmpty ? accessToken : null;
    } catch (e, st) {
      _logger.error(
        'AuthRemoteDataSourceImpl: Erro ao obter access token',
        err: e,
        stackTrace: st,
      );
      return null;
    }
  }
}