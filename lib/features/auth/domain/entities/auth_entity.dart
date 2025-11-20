import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth_entity.freezed.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

@freezed
class AuthEntity with _$AuthEntity {
  const factory AuthEntity({
    required String id,
    required String email,
    required String? displayName,
    required bool isEmailVerified,
    required DateTime createdAt,
    required DateTime? lastSignInAt,
    required AuthStatus status,
    String? errorMessage,
  }) = _AuthEntity;

  const AuthEntity._();

  bool get isAuthenticated => status == AuthStatus.authenticated;
  bool get isLoading => status == AuthStatus.loading;
  bool get hasError => status == AuthStatus.error;
}