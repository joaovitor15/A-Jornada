import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/auth_entity.dart';

part 'auth_model.freezed.dart';
part 'auth_model.g.dart';

@freezed
class AuthModel with _$AuthModel {
  const factory AuthModel({
    required String id,
    required String email,
    required String? displayName,
    required bool isEmailVerified,
  }) = _AuthModel;

  const AuthModel._();

  factory AuthModel.fromJson(Map<String, dynamic> json) =>
      _$AuthModelFromJson(json);

  AuthEntity toEntity() => AuthEntity(
    id: id,
    email: email,
    displayName: displayName,
    isEmailVerified: isEmailVerified,
    createdAt: DateTime.now(),
    lastSignInAt: null,
    status: AuthStatus.authenticated,
  );
}