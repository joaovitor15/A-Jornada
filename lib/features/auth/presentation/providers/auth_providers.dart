import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/features/auth/domain/usecases/login_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/signup_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/logout_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/get_current_user_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/reset_password_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/verify_email_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/refresh_token_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/watch_auth_state_usecase.dart';
import 'package:myapp/features/auth/domain/repositories/auth_repository.dart';
import 'package:myapp/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:myapp/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:myapp/features/auth/data/datasources/auth_remote_datasource_impl.dart';
import 'package:myapp/features/auth/data/datasources/auth_secure_storage.dart';
import 'package:myapp/features/auth/data/datasources/auth_secure_storage_impl.dart';
import 'package:myapp/features/auth/domain/entities/auth_entity.dart';
import 'package:myapp/core/utils/logger.dart';

// ============ DATA SOURCES ============

final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  final supabaseClient = Supabase.instance.client;
  return AuthRemoteDataSourceImpl(supabaseClient: supabaseClient);
});

final authSecureStorageProvider = Provider<AuthSecureStorage>((ref) {
  return AuthSecureStorageImpl();
});

// ============ REPOSITORIES ============

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final remoteDataSource = ref.watch(authRemoteDataSourceProvider);
  return AuthRepositoryImpl(remoteDataSource: remoteDataSource);
});

// ============ USE CASES ============

final loginUseCaseProvider = Provider<LoginUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return LoginUseCase(repository: repository);
});

final signupUseCaseProvider = Provider<SignupUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return SignupUseCase(repository: repository);
});

final logoutUseCaseProvider = Provider<LogoutUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return LogoutUseCase(repository: repository);
});

final getCurrentUserUseCaseProvider = Provider<GetCurrentUserUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return GetCurrentUserUseCase(repository: repository);
});

final resetPasswordUseCaseProvider = Provider<ResetPasswordUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return ResetPasswordUseCase(repository: repository);
});

final verifyEmailUseCaseProvider = Provider<VerifyEmailUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return VerifyEmailUseCase(repository: repository);
});

final refreshTokenUseCaseProvider = Provider<RefreshTokenUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return RefreshTokenUseCase(repository: repository);
});

final watchAuthStateUseCaseProvider = Provider<WatchAuthStateUseCase>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return WatchAuthStateUseCase(repository: repository);
});

// ============ AUTH TOKEN PROVIDER ============

/// ✅ CORRIGIDO: Fornece o JWT token atual
/// Usado pelo AuthInterceptor para adicionar ao header
/// Retorna `Future<String?>` com o token salvo
final currentJwtTokenProvider = FutureProvider<String?>((ref) async {
  final secureStorage = ref.watch(authSecureStorageProvider);
  try {
    final token = await secureStorage.getJwtToken();
    return token;
  } catch (e) {
    Logger().error('currentJwtTokenProvider: Erro ao buscar token', err: e);
    return null;
  }
});

// ============ AUTH USER PROVIDER ============

/// ✅ CORRIGIDO: Fornece o usuário autenticado atual
/// Reutiliza authProvider (já carregado)
/// Usado pelo GoRouter para redirecionar baseado em autenticação
final currentAuthUserProvider = FutureProvider<AuthEntity?>((ref) async {
  try {
    final logger = Logger();
    
    // 1️⃣ Verifica se tem token salvo
    final secureStorage = ref.watch(authSecureStorageProvider);
    final token = await secureStorage.getJwtToken();

    if (token == null || token.isEmpty) {
      logger.info('currentAuthUserProvider: Nenhum token - usuário deslogado');
      return null;
    }

    // 2️⃣ Se tem token, tenta buscar user do Supabase
    logger.info('currentAuthUserProvider: Token encontrado, buscando usuário');
    
    final getCurrentUserUseCase = ref.watch(getCurrentUserUseCaseProvider);
    final user = await getCurrentUserUseCase();

    if (user != null) {
      logger.info('currentAuthUserProvider: Usuário encontrado: ${user.id}');
      return user;
    } else {
      logger.warning('currentAuthUserProvider: Usuário não encontrado');
      return null;
    }
  } catch (e) {
    Logger().error(
      'currentAuthUserProvider: Erro ao buscar usuário',
      err: e,
    );
    return null;
  }
});

// ============ AUTH STATE STREAM PROVIDER ============

/// Provider que observa mudanças de estado de autenticação
/// Emite eventos quando usuário faz login/logout
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

// ============ IS AUTHENTICATED PROVIDER ============

/// ✅ NOVO: Provider computado para verificar se está autenticado
/// Mais eficiente que ler authEntity inteiro
final isAuthenticatedProvider = FutureProvider<bool>((ref) async {
  final secureStorage = ref.watch(authSecureStorageProvider);
  try {
    return await secureStorage.hasValidToken();
  } catch (e) {
    return false;
  }
});