import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/core/config/secure_storage_config.dart';
import '../models/login_request_model.dart';
import '../models/signup_request_model.dart';
import '../../domain/entities/auth_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final Logger _logger = Logger();

  AuthRepositoryImpl({required this.remoteDataSource});

  @override
  Future<AuthEntity?> getCurrentUser() async {
    try {
      _logger.info('AuthRepositoryImpl: Buscando usuário atual');

      final model = await remoteDataSource.getCurrentUser();
      if (model == null) {
        _logger.info('AuthRepositoryImpl: Nenhum usuário ativo');
        return null;
      }

      _logger.info('AuthRepositoryImpl: Usuário encontrado: ${model.id}');
      return model.toEntity(status: AuthStatus.authenticated);
    } on AppAuthException {
      _logger.warning(
          'AuthRepositoryImpl: Erro de autenticação ao buscar usuário');
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao buscar usuário',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<AuthEntity> login({
    required String email,
    required String password,
  }) async {
    try {
      _logger.info('AuthRepositoryImpl: Iniciando login para $email');

      // ✅ NOVO: Valida antes de enviar
      final request = LoginRequestModel.validated(
        email: email,
        password: password,
      );

      final model = await remoteDataSource.login(request);

      _logger.info('AuthRepositoryImpl: Login bem-sucedido para ${model.id}');
      return model.toEntity(status: AuthStatus.authenticated);
    } on AppAuthException catch (e) {
      _logger.warning(
        'AuthRepositoryImpl: Erro de autenticação no login: ${e.code}',
      );
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro inesperado no login',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<AuthEntity> signup({
    required String email,
    required String password,
    required String displayName,
  }) async {
    try {
      _logger.info('AuthRepositoryImpl: Iniciando signup para $email');

      // ✅ NOVO: Valida antes de enviar
      final request = SignupRequestModel.validated(
        email: email,
        password: password,
        displayName: displayName,
      );

      final model = await remoteDataSource.signup(request);

      _logger.info('AuthRepositoryImpl: Signup bem-sucedido para ${model.id}');
      return model.toEntity(status: AuthStatus.authenticated);
    } on AppAuthException catch (e) {
      _logger.warning(
        'AuthRepositoryImpl: Erro de autenticação no signup: ${e.code}',
      );
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro inesperado no signup',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    try {
      _logger.info('AuthRepositoryImpl: Iniciando logout');

      // 1️⃣ Faz logout no Supabase
      await remoteDataSource.logout();

      // 2️⃣ Limpa tokens do Secure Storage
      await SecureStorageConfig.deleteAllTokens();

      _logger.info('AuthRepositoryImpl: Logout bem-sucedido - Dados limpos');
    } on AppAuthException catch (e) {
      _logger.warning(
        'AuthRepositoryImpl: Erro de autenticação no logout: ${e.code}',
      );
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao fazer logout',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> resetPassword(String email) async {
    try {
      _logger
          .info('AuthRepositoryImpl: Solicitando reset de senha para $email');

      await remoteDataSource.resetPassword(email);

      _logger.info('AuthRepositoryImpl: Email de reset enviado');
    } on AppAuthException catch (e) {
      _logger.warning(
        'AuthRepositoryImpl: Erro ao resetar senha: ${e.code}',
      );
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao resetar senha',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> verifyEmail(String email, String code) async {
    try {
      _logger.info('AuthRepositoryImpl: Verificando email $email');

      await remoteDataSource.verifyEmail(email, code);

      _logger.info('AuthRepositoryImpl: Email verificado com sucesso');
    } on AppAuthException catch (e) {
      _logger.warning(
        'AuthRepositoryImpl: Erro ao verificar email: ${e.code}',
      );
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao verificar email',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<AuthEntity> refreshToken() async {
    try {
      _logger.info('AuthRepositoryImpl: Renovando token');

      final model = await remoteDataSource.refreshToken();

      _logger.info('AuthRepositoryImpl: Token renovado com sucesso');
      return model.toEntity(status: AuthStatus.authenticated);
    } on AppAuthException catch (e) {
      _logger.warning(
        'AuthRepositoryImpl: Erro ao renovar token: ${e.code}',
      );
      rethrow;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao renovar token',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    try {
      _logger.info('AuthRepositoryImpl: Verificando autenticação');

      final result = await remoteDataSource.isAuthenticated();

      _logger.info('AuthRepositoryImpl: Autenticado = $result');
      return result;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao verificar autenticação',
        err: e,
        stackTrace: st,
      );
      return false;
    }
  }

  @override
  Stream<AuthEntity?> watchAuthState() {
    _logger.info('AuthRepositoryImpl: Iniciando observação de estado de auth');

    return remoteDataSource.watchAuthState().map((model) {
      if (model == null) {
        _logger.info('AuthRepositoryImpl: Usuário deslogado (stream)');
        return null;
      }
      _logger.info('AuthRepositoryImpl: Estado de auth atualizado (stream)');
      return model.toEntity(status: AuthStatus.authenticated);
    }).handleError((error, stackTrace) {
      _logger.error(
        'AuthRepositoryImpl: Erro no stream de auth',
        err: error,
        stackTrace: stackTrace,
      );
    });
  }
}
