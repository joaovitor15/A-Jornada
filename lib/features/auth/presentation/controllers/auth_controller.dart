import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/features/auth/domain/entities/auth_entity.dart';
import 'package:myapp/features/auth/domain/usecases/login_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/signup_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/logout_usecase.dart';
import 'package:myapp/features/auth/domain/usecases/get_current_user_usecase.dart';
import 'package:myapp/core/config/get_it_config.dart';

class AuthNotifier extends AsyncNotifier<AuthEntity?> {
  late LoginUseCase _loginUseCase;
  late SignupUseCase _signupUseCase;
  late LogoutUseCase _logoutUseCase;
  late GetCurrentUserUseCase _getCurrentUserUseCase;

  @override
  Future<AuthEntity?> build() async {
    _loginUseCase = ref.watch(loginUseCaseProvider);
    _signupUseCase = ref.watch(signupUseCaseProvider);
    _logoutUseCase = ref.watch(logoutUseCaseProvider);
    _getCurrentUserUseCase = ref.watch(getCurrentUserUseCaseProvider);

    return await _getCurrentUserUseCase();
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return await _loginUseCase(email: email, password: password);
    });
  }

  Future<void> signup(String email, String password, String displayName) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return await _signupUseCase(
        email: email,
        password: password,
        displayName: displayName,
      );
    });
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await _logoutUseCase();
      return null;
    });
  }

  bool get isAuthenticated => state.maybeWhen(
    data: (user) => user != null,
    orElse: () => false,
  );

  bool get isLoading => state is AsyncLoading;
}

final authProvider =
    AsyncNotifierProvider<AuthNotifier, AuthEntity?>(() => AuthNotifier());