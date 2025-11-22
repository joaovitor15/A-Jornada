import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/user_profile_entity.dart';

part 'user_profile_model.freezed.dart';
part 'user_profile_model.g.dart';

@freezed
class UserProfileModel with _$UserProfileModel {
  const factory UserProfileModel({
    required String id,
    required String userId,
    required String name,
    required String type, // String do banco: 'Farmácia', 'Casa', etc
    String? icon,
    String? color,
    @Default(true) bool active,
    required DateTime createdAt,
    required DateTime updatedAt,
    @Default(0) int sortOrder,
  }) = _UserProfileModel;

  const UserProfileModel._();

  factory UserProfileModel.fromJson(Map<String, dynamic> json) =>
      _$UserProfileModelFromJson(json);

  /// Converte Model → Entity (conversão de tipos)
  UserProfileEntity toEntity() => UserProfileEntity(
    id: id,
    userId: userId,
    name: name,
    type: ProfileType.fromString(type),
    icon: icon,
    color: color,
    active: active,
    createdAt: createdAt,
    updatedAt: updatedAt,
    sortOrder: sortOrder,
  );

  /// Converte Entity → Model (para requisições)
  factory UserProfileModel.fromEntity(UserProfileEntity entity) =>
      UserProfileModel(
        id: entity.id,
        userId: entity.userId,
        name: entity.name,
        type: entity.type.toDbString(), // Converte enum → string
        icon: entity.icon,
        color: entity.color,
        active: entity.active,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        sortOrder: entity.sortOrder,
      );
}