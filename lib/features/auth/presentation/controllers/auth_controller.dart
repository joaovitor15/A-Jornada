import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/features/auth/domain/entities/auth_entity.dart';
import 'package:myapp/features/auth/presentation/providers/auth_providers.dart';
import 'package:myapp/features/auth/data/datasources/auth_secure_storage.dart';
import 'package:myapp/features/auth/data/datasources/auth_remote_datasource.dart';

class AuthNotifier extends AsyncNotifier<AuthEntity?> {
  late AuthSecureStorage _secureStorage;
  late AuthRemoteDataSource _remoteDataSource;
  final Logger _logger = Logger();

  // ✅ Retry logic com exponential backoff
  Future<T> _retryWithBackoff<T>(
    Future<T> Function() operation, {
    int maxRetries = 3,
    int initialDelayMs = 1000,
  }) async {
    int retryCount = 0;
    int delayMs = initialDelayMs;

    while (true) {
      try {
        return await operation();
      } catch (e) {
        retryCount++;
        if (retryCount >= maxRetries) {
          _logger.warning(
            'AuthNotifier: Max retries reached ($maxRetries), failing',
          );
          rethrow;
        }

        _logger.info(
          'AuthNotifier: Retry attempt $retryCount/$maxRetries após ${delayMs}ms',
        );
        await Future.delayed(Duration(milliseconds: delayMs));
        delayMs *= 2;
      }
    }
  }

  @override
  Future<AuthEntity?> build() async {
    try {
      _logger.info('AuthNotifier.build: Inicializando');

      _secureStorage = ref.watch(authSecureStorageProvider);
      _remoteDataSource = ref.watch(authRemoteDataSourceProvider);

      // ✅ CORRIGIDO: Verifica se tem token salvo
      final hasToken = await _secureStorage.hasValidToken();
      if (!hasToken) {
        _logger.info('AuthNotifier.build: Nenhum token salvo');
        return null;
      }

      _logger.info('AuthNotifier.build: Token encontrado, recuperando usuário');

      // ✅ CORRIGIDO: Recupera usuário atual do Supabase e converte
      try {
        final userModel = await _remoteDataSource.getCurrentUser();

        if (userModel != null) {
          final user = userModel.toEntity();
          _logger.info('AuthNotifier.build: Usuário carregado: ${user.id}');
          return user;
        } else {
          _logger.info('AuthNotifier.build: Usuário não encontrado');
          return null;
        }
      } catch (e) {
        _logger.warning('AuthNotifier.build: Erro ao buscar usuário: $e');
        return null;
      }
    } catch (e, st) {
      _logger.error(
        'AuthNotifier.build: Erro na inicialização',
        err: e,
        stackTrace: st,
      );
      return null;
    }
  }

  Future<void> login(String email, String password) async {
    try {
      _logger.info('AuthNotifier.login: Iniciando login para $email');

      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() async {
        return await _retryWithBackoff(() async {
          final loginUseCase = ref.read(loginUseCaseProvider);
          final user = await loginUseCase(email: email, password: password);

          final accessToken = await _remoteDataSource.getAccessToken();

          if (accessToken == null) {
            _logger.warning('AuthNotifier.login: Access token é nulo');
            throw AppAuthException(
              message: 'Falha ao obter token de sessão',
              code: 'NULL_ACCESS_TOKEN',
            );
          }

          await _secureStorage.saveTokens(
            jwtToken: accessToken,
            refreshToken: null,
            userId: user.id,
          );

          _logger.info(
              'AuthNotifier.login: Login bem-sucedido para ${user.email}');
          return user;
        });
      });
    } catch (e, st) {
      _logger.error(
        'AuthNotifier.login: Erro no login',
        err: e,
        stackTrace: st,
      );
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signup({
    required String email,
    required String password,
    required String displayName,
  }) async {
    try {
      _logger.info('AuthNotifier.signup: Iniciando signup para $email');

      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() async {
        return await _retryWithBackoff(() async {
          final signupUseCase = ref.read(signupUseCaseProvider);
          final user = await signupUseCase(
            email: email,
            password: password,
            displayName: displayName,
          );

          final accessToken = await _remoteDataSource.getAccessToken();

          if (accessToken == null) {
            _logger.warning('AuthNotifier.signup: Access token é nulo');
            throw AppAuthException(
              message: 'Falha ao obter token de sessão',
              code: 'NULL_ACCESS_TOKEN',
            );
          }

          await _secureStorage.saveTokens(
            jwtToken: accessToken,
            refreshToken: null,
            userId: user.id,
          );

          _logger.info(
              'AuthNotifier.signup: Signup bem-sucedido para ${user.email}');
          return user;
        });
      });
    } catch (e, st) {
      _logger.error(
        'AuthNotifier.signup: Erro no signup',
        err: e,
        stackTrace: st,
      );
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> logout() async {
    try {
      _logger.info('AuthNotifier.logout: Iniciando logout');

      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() async {
        final logoutUseCase = ref.read(logoutUseCaseProvider);
        await logoutUseCase();

        await _secureStorage.deleteAllTokens();

        _logger.info('AuthNotifier.logout: Logout bem-sucedido');
        return null;
      });
    } catch (e, st) {
      _logger.error(
        'AuthNotifier.logout: Erro no logout',
        err: e,
        stackTrace: st,
      );
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> resetPassword(String email) async {
    try {
      _logger.info('AuthNotifier.resetPassword: Solicitando reset para $email');

      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() async {
        return await _retryWithBackoff(() async {
          final resetPasswordUseCase = ref.read(resetPasswordUseCaseProvider);
          await resetPasswordUseCase(email: email);

          _logger.info('AuthNotifier.resetPassword: Email enviado para $email');

          return state.maybeWhen(
            data: (user) => user,
            orElse: () => null,
          );
        });
      });
    } catch (e, st) {
      _logger.error(
        'AuthNotifier.resetPassword: Erro ao resetar senha',
        err: e,
        stackTrace: st,
      );
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> verifyEmail({
    required String email,
    required String code,
  }) async {
    try {
      _logger.info('AuthNotifier.verifyEmail: Verificando email $email');

      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() async {
        return await _retryWithBackoff(() async {
          final verifyEmailUseCase = ref.read(verifyEmailUseCaseProvider);
          await verifyEmailUseCase(email: email, code: code);

          _logger
              .info('AuthNotifier.verifyEmail: Email verificado com sucesso');

          return state.maybeWhen(
            data: (user) => user,
            orElse: () => null,
          );
        });
      });
    } catch (e, st) {
      _logger.error(
        'AuthNotifier.verifyEmail: Erro ao verificar email',
        err: e,
        stackTrace: st,
      );
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> refreshToken() async {
    try {
      _logger.info('AuthNotifier.refreshToken: Renovando token');

      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() async {
        return await _retryWithBackoff(() async {
          final refreshTokenUseCase = ref.read(refreshTokenUseCaseProvider);
          final user = await refreshTokenUseCase();

          final accessToken = await _remoteDataSource.getAccessToken();

          if (accessToken == null) {
            _logger.warning('AuthNotifier.refreshToken: Access token é nulo');
            throw AppAuthException(
              message: 'Falha ao obter token renovado',
              code: 'NULL_ACCESS_TOKEN',
            );
          }

          await _secureStorage.saveTokens(
            jwtToken: accessToken,
            refreshToken: null,
            userId: user.id,
          );

          _logger.info('AuthNotifier.refreshToken: Token renovado com sucesso');
          return user;
        });
      });
    } catch (e, st) {
      _logger.error(
        'AuthNotifier.refreshToken: Erro ao renovar token',
        err: e,
        stackTrace: st,
      );
      state = AsyncValue.error(e, st);
    }
  }

  bool get isAuthenticated => state.maybeWhen(
        data: (user) => user != null && user.isAuthenticated,
        orElse: () => false,
      );

  bool get isLoading => state is AsyncLoading;

  bool get hasError => state is AsyncError;

  String? get errorMessage => state.maybeWhen(
        error: (error, _) => _mapErrorToMessage(error),
        orElse: () => null,
      );

  String _mapErrorToMessage(dynamic error) {
    if (error is AppAuthException) {
      switch (error.code) {
        case 'INVALID_EMAIL':
          return 'Email inválido';
        case 'INVALID_PASSWORD':
          return 'Senha inválida (mínimo 6 caracteres)';
        case 'USER_NOT_FOUND':
          return 'Usuário não encontrado';
        case 'NULL_ACCESS_TOKEN':
          return 'Falha ao obter token de sessão';
        default:
          return error.message;
      }
    }
    return 'Erro desconhecido';
  }
}

final authProvider = AsyncNotifierProvider<AuthNotifier, AuthEntity?>(
  () => AuthNotifier(),
);

final isAuthenticatedProvider = Provider<bool>((ref) {
  final authState = ref.watch(authProvider);
  return authState.maybeWhen(
    data: (user) => user != null && user.isAuthenticated,
    orElse: () => false,
  );
});

final authStateStreamProvider = StreamProvider<AuthEntity?>((ref) {
  final logger = Logger();
  final watchAuthStateUseCase = ref.watch(watchAuthStateUseCaseProvider);
  return watchAuthStateUseCase().handleError((error, stackTrace) {
    logger.error(
      'authStateStreamProvider: Erro no stream',
      err: error,
      stackTrace: stackTrace,
    );
    return null;
  });
});
