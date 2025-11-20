import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/features/auth/domain/entities/auth_entity.dart';
import 'package:myapp/features/auth/presentation/providers/auth_providers.dart';
import 'package:myapp/features/auth/data/datasources/auth_secure_storage.dart';
import 'package:myapp/core/utils/logger.dart';

class AuthNotifier extends AsyncNotifier<AuthEntity?> {
  late AuthSecureStorage _secureStorage;

  @override
  Future<AuthEntity?> build() async {
    _secureStorage = ref.watch(authSecureStorageProvider);
    
    try {
      // Verifica se tem token salvo
      final hasToken = await _secureStorage.hasValidToken();
      if (!hasToken) {
        return null;
      }

      // Recupera usuário atual
      final getCurrentUserUseCase = ref.watch(getCurrentUserUseCaseProvider);
      final user = await getCurrentUserUseCase();
      
      if (user != null) {
        logger.info('User loaded from Secure Storage: ${user.id}');
      }
      
      return user;
    } catch (e, st) {
      logger.error('AuthNotifier.build error', err: e, stackTrace: st);
      return null;
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final loginUseCase = ref.read(loginUseCaseProvider);
      final user = await loginUseCase(email: email, password: password);

      // Salva token no Secure Storage
      await _secureStorage.saveTokens(
        jwtToken: user.id, // ⚠️ Supabase não retorna JWT, usar session
        refreshToken: null,
        userId: user.id,
      );

      logger.info('Login successful: ${user.email}');
      return user;
    });
  }

  Future<void> signup({
    required String email,
    required String password,
    required String displayName,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final signupUseCase = ref.read(signupUseCaseProvider);
      final user = await signupUseCase(
        email: email,
        password: password,
        displayName: displayName,
      );

      // Salva token no Secure Storage
      await _secureStorage.saveTokens(
        jwtToken: user.id,
        refreshToken: null,
        userId: user.id,
      );

      logger.info('Signup successful: ${user.email}');
      return user;
    });
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final logoutUseCase = ref.read(logoutUseCaseProvider);
      await logoutUseCase();

      // Deleta tokens do Secure Storage
      await _secureStorage.deleteAllTokens();

      logger.info('Logout successful');
      return null;
    });
  }

  Future<void> resetPassword(String email) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final resetPasswordUseCase = ref.read(resetPasswordUseCaseProvider);
      await resetPasswordUseCase(email: email);
      
      logger.info('Password reset email sent to: $email');
      
      return state.maybeWhen(
        data: (user) => user,
        orElse: () => null,
      );
    });
  }

  Future<void> verifyEmail({
    required String email,
    required String code,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final verifyEmailUseCase = ref.read(verifyEmailUseCaseProvider);
      await verifyEmailUseCase(email: email, code: code);

      logger.info('Email verified: $email');
      
      return state.maybeWhen(
        data: (user) => user,
        orElse: () => null,
      );
    });
  }

  Future<void> refreshToken() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final refreshTokenUseCase = ref.read(refreshTokenUseCaseProvider);
      final user = await refreshTokenUseCase();

      // Atualiza token no Secure Storage
      await _secureStorage.saveTokens(
        jwtToken: user.id,
        refreshToken: null,
        userId: user.id,
      );

      logger.info('Token refreshed');
      return user;
    });
  }

  bool get isAuthenticated => state.maybeWhen(
    data: (user) => user != null && user.isAuthenticated,
    orElse: () => false,
  );

  bool get isLoading => state is AsyncLoading;

  bool get hasError => state is AsyncError;

  String? get errorMessage => state.maybeWhen(
    error: (error, _) => error.toString(),
    orElse: () => null,
  );
}

final authProvider = AsyncNotifierProvider<AuthNotifier, AuthEntity?>(
  () => AuthNotifier(),
);

/// Provider computado: verifica se está autenticado
final isAuthenticatedProvider = Provider<bool>((ref) {
  final authState = ref.watch(authProvider);
  return authState.maybeWhen(
    data: (user) => user != null && user.isAuthenticated,
    orElse: () => false,
  );
});

/// Provider para stream de auth state (listener)
final authStateStreamProvider = StreamProvider<AuthEntity?>((ref) {
  final watchAuthStateUseCase = ref.watch(watchAuthStateUseCaseProvider);
  return watchAuthStateUseCase().handleError((error, stackTrace) {
    logger.error('authStateStreamProvider error', err: error, stackTrace: stackTrace);
    return null;
  });
});