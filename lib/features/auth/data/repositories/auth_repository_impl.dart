import 'package:myapp/core/utils/logger.dart';
import '../../domain/entities/auth_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/login_request_model.dart';
import '../models/signup_request_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final Logger _logger = Logger();

  AuthRepositoryImpl({required AuthRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  @override
  Future<AuthEntity?> getCurrentUser() async {
    try {
      _logger.info('AuthRepositoryImpl: Buscando usuário atual');

      final model = await _remoteDataSource.getCurrentUser();

      if (model == null) {
        _logger.info('AuthRepositoryImpl: Nenhum usuário autenticado');
        return null;
      }

      final entity = model.toEntity();

      _logger.info('AuthRepositoryImpl: Usuário atual encontrado: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao buscar usuário atual',
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

      final request = LoginRequestModel(
        email: email,
        password: password,
      );

      final model = await _remoteDataSource.login(request);

      final entity = model.toEntity();

      _logger.info('AuthRepositoryImpl: Login bem-sucedido para ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao fazer login',
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

      final request = SignupRequestModel(
        email: email,
        password: password,
        displayName: displayName,
      );

      final model = await _remoteDataSource.signup(request);

      final entity = model.toEntity();

      _logger.info('AuthRepositoryImpl: Signup bem-sucedido para ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao fazer signup',
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

      await _remoteDataSource.logout();

      _logger.info('AuthRepositoryImpl: Logout bem-sucedido');
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
      _logger.info('AuthRepositoryImpl: Enviando reset de senha para $email');

      await _remoteDataSource.resetPassword(email);

      _logger.info('AuthRepositoryImpl: Email de reset enviado com sucesso');
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao enviar reset de senha',
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

      await _remoteDataSource.verifyEmail(email, code);

      _logger.info('AuthRepositoryImpl: Email verificado com sucesso');
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
      _logger.info('AuthRepositoryImpl: Refreshando token');

      final model = await _remoteDataSource.refreshToken();

      final entity = model.toEntity();

      _logger.info('AuthRepositoryImpl: Token refreshado com sucesso');

      return entity;
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao refreshar token',
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

      final isAuth = await _remoteDataSource.isAuthenticated();

      _logger.info('AuthRepositoryImpl: Autenticado = $isAuth');

      return isAuth;
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
    try {
      _logger.info('AuthRepositoryImpl: Observando mudanças de auth state');

      return _remoteDataSource.watchAuthState().map((model) {
        if (model == null) return null;
        return model.toEntity();
      });
    } catch (e, st) {
      _logger.error(
        'AuthRepositoryImpl: Erro ao observar auth state',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}