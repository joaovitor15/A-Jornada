import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/category_entity.dart';

part 'category_model.freezed.dart';
part 'category_model.g.dart';

@freezed
class CategoryModel with _$CategoryModel {
  const factory CategoryModel({
    required String id,
    required String profileId,
    required String name,
    String? parentId,
    String? icon,
    String? color,
    required DateTime createdAt,
    required DateTime updatedAt,
    @Default(0) int sortOrder,
  }) = _CategoryModel;

  const CategoryModel._();

  factory CategoryModel.fromJson(Map<String, dynamic> json) =>
      _$CategoryModelFromJson(json);

  /// Converte Model → Entity
  CategoryEntity toEntity() => CategoryEntity(
    id: id,
    profileId: profileId,
    name: name,
    parentId: parentId,
    icon: icon,
    color: color,
    createdAt: createdAt,
    updatedAt: updatedAt,
    sortOrder: sortOrder,
  );

  /// Converte Entity → Model (para requisições)
  factory CategoryModel.fromEntity(CategoryEntity entity) =>
      CategoryModel(
        id: entity.id,
        profileId: entity.profileId,
        name: entity.name,
        parentId: entity.parentId,
        icon: entity.icon,
        color: entity.color,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        sortOrder: entity.sortOrder,
      );
}