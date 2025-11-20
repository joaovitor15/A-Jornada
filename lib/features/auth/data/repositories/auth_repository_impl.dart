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
    final model = await remoteDataSource.getCurrentUser();
    return model?.toEntity();
  }

  @override
  Future<AuthEntity> login({
    required String email,
    required String password,
  }) async {
    final model = await remoteDataSource.login(
      LoginRequestModel(email: email, password: password),
    );
    return model.toEntity();
  }

  @override
  Future<AuthEntity> signup({
    required String email,
    required String password,
    required String displayName,
  }) async {
    final model = await remoteDataSource.signup(
      SignupRequestModel(
        email: email,
        password: password,
        displayName: displayName,
      ),
    );
    return model.toEntity();
  }

  @override
  Future<void> logout() => remoteDataSource.logout();

  @override
  Future<void> resetPassword(String email) => remoteDataSource.resetPassword(email);

  @override
  Future<void> verifyEmail(String email, String code) =>
      remoteDataSource.verifyEmail(email, code);

  @override
  Future<AuthEntity> refreshToken() async {
    final model = await remoteDataSource.refreshToken();
    return model.toEntity();
  }

  @override
  Future<bool> isAuthenticated() => remoteDataSource.isAuthenticated();

  @override
  Stream<AuthEntity?> watchAuthState() =>
      remoteDataSource.watchAuthState().map((model) => model?.toEntity());
}