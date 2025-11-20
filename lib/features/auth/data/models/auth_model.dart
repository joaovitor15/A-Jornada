import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/auth_entity.dart';

part 'auth_model.freezed.dart';
part 'auth_model.g.dart';

@freezed
class AuthModel with _$AuthModel {
  const factory AuthModel({
    required String id,
    required String email,
    String? displayName,
    @Default(false) bool isEmailVerified,
    required DateTime createdAt,
    DateTime? lastSignInAt,
  }) = _AuthModel;

  const AuthModel._();

  factory AuthModel.fromJson(Map<String, dynamic> json) =>
      _$AuthModelFromJson(json);

  /// Converte Model → Entity (adiciona status depois no Controller)
  AuthEntity toEntity({AuthStatus status = AuthStatus.authenticated}) => AuthEntity(
    id: id,
    email: email,
    displayName: displayName,
    isEmailVerified: isEmailVerified,
    createdAt: createdAt,
    lastSignInAt: lastSignInAt,
    status: status,
    errorMessage: null,
  );
}