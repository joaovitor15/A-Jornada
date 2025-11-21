import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthFormState {
  final String email;
  final String password;
  final String displayName;
  final bool isPasswordVisible;
  final bool isLoading;
  final String? error;

  AuthFormState({
    this.email = '',
    this.password = '',
    this.displayName = '',
    this.isPasswordVisible = false,
    this.isLoading = false,
    this.error,
  });

  AuthFormState copyWith({
    String? email,
    String? password,
    String? displayName,
    bool? isPasswordVisible,
    bool? isLoading,
    String? error,
  }) {
    return AuthFormState(
      email: email ?? this.email,
      password: password ?? this.password,
      displayName: displayName ?? this.displayName,
      isPasswordVisible: isPasswordVisible ?? this.isPasswordVisible,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class AuthFormNotifier extends StateNotifier<AuthFormState> {
  AuthFormNotifier() : super(AuthFormState());

  void setEmail(String email) {
    state = state.copyWith(email: email, error: null);
  }

  void setPassword(String password) {
    state = state.copyWith(password: password, error: null);
  }

  void setDisplayName(String displayName) {
    state = state.copyWith(displayName: displayName, error: null);
  }

  void togglePasswordVisibility() {
    state = state.copyWith(isPasswordVisible: !state.isPasswordVisible);
  }

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String? error) {
    state = state.copyWith(error: error);
  }

  void reset() {
    state = AuthFormState();
  }
}

final authFormProvider =
    StateNotifierProvider<AuthFormNotifier, AuthFormState>((ref) {
  return AuthFormNotifier();
});
