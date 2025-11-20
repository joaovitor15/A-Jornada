import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import '../models/login_request_model.dart';
import '../models/signup_request_model.dart';
import '../../domain/entities/auth_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl({required this.remoteDataSource});

  @override
  Future<AuthEntity?> getCurrentUser() async {
    try {
      final model = await remoteDataSource.getCurrentUser();
      if (model == null) {
        return null;
      }
      return model.toEntity(status: AuthStatus.authenticated);
    } on AppAuthException {
      rethrow;
    } catch (e, st) {
      logger.error('getCurrentUser error', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<AuthEntity> login({
    required String email,
    required String password,
  }) async {
    try {
      final model = await remoteDataSource.login(
        LoginRequestModel(email: email, password: password),
      );
      return model.toEntity(status: AuthStatus.authenticated);
    } on AppAuthException catch (e) {
      logger.error('login error', err: e);
      rethrow;
    } catch (e, st) {
      logger.error('login unexpected error', err: e, stackTrace: st);
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
      final model = await remoteDataSource.signup(
        SignupRequestModel(
          email: email,
          password: password,
          displayName: displayName,
        ),
      );
      return model.toEntity(
        status: AuthStatus.authenticated,
      );
    } on AppAuthException catch (e) {
      logger.error('signup error', err: e);
      rethrow;
    } catch (e, st) {
      logger.error('signup unexpected error', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    try {
      await remoteDataSource.logout();
    } on AppAuthException catch (e) {
      logger.error('logout error', err: e);
      rethrow;
    } catch (e, st) {
      logger.error('logout unexpected error', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<void> resetPassword(String email) async {
    try {
      await remoteDataSource.resetPassword(email);
    } on AppAuthException catch (e) {
      logger.error('resetPassword error', err: e);
      rethrow;
    } catch (e, st) {
      logger.error('resetPassword unexpected error', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<void> verifyEmail(String email, String code) async {
    try {
      await remoteDataSource.verifyEmail(email, code);
    } on AppAuthException catch (e) {
      logger.error('verifyEmail error', err: e);
      rethrow;
    } catch (e, st) {
      logger.error('verifyEmail unexpected error', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<AuthEntity> refreshToken() async {
    try {
      final model = await remoteDataSource.refreshToken();
      return model.toEntity(status: AuthStatus.authenticated);
    } on AppAuthException catch (e) {
      logger.error('refreshToken error', err: e);
      rethrow;
    } catch (e, st) {
      logger.error('refreshToken unexpected error', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    try {
      return await remoteDataSource.isAuthenticated();
    } catch (e, st) {
      logger.error('isAuthenticated error', err: e, stackTrace: st);
      return false;
    }
  }

  @override
  Stream<AuthEntity?> watchAuthState() {
    return remoteDataSource.watchAuthState().map((model) {
      if (model == null) {
        return null;
      }
      return model.toEntity(status: AuthStatus.authenticated);
    }).handleError((error, stackTrace) {
      logger.error('watchAuthState error', err: error, stackTrace: stackTrace);
    });
  }
}