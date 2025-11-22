import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/tag_entity.dart';

part 'tag_model.freezed.dart';
part 'tag_model.g.dart';

@freezed
class TagModel with _$TagModel {
  const factory TagModel({
    required String id,
    required String profileId,
    required String name,
    String? color,
    @Default(0) int sortOrder,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _TagModel;

  const TagModel._();

  factory TagModel.fromJson(Map<String, dynamic> json) =>
      _$TagModelFromJson(json);

  /// Converte Model → Entity
  TagEntity toEntity() => TagEntity(
    id: id,
    profileId: profileId,
    name: name,
    color: color,
    sortOrder: sortOrder,
    createdAt: createdAt,
    updatedAt: updatedAt,
  );

  /// Converte Entity → Model (para requisições)
  factory TagModel.fromEntity(TagEntity entity) =>
      TagModel(
        id: entity.id,
        profileId: entity.profileId,
        name: entity.name,
        color: entity.color,
        sortOrder: entity.sortOrder,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      );
}