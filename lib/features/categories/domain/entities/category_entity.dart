import 'package:freezed_annotation/freezed_annotation.dart';

part 'category_entity.freezed.dart';

@freezed
class CategoryEntity with _$CategoryEntity {
  const factory CategoryEntity({
    required String id,
    required String profileId,
    required String name,
    String? parentId, // null = categoria raiz
    String? icon,
    String? color,
    required DateTime createdAt,
    required DateTime updatedAt,
    required int sortOrder,
  }) = _CategoryEntity;

  const CategoryEntity._();

  // ============ GETTERS & VALIDAÇÕES ============

  /// ✅ Validar se cor é hexadecimal válida (#RRGGBB)
  bool isColorValid() {
    if (color == null) return true;
    return RegExp(r'^#[0-9A-Fa-f]{6}$').hasMatch(color!);
  }

  /// ✅ Validar se nome não está vazio e <= 255 chars
  bool isNameValid() {
    return name.trim().isNotEmpty && name.length <= 255;
  }

  /// ✅ Verificar se é categoria raiz (sem parent)
  bool get isRootCategory => parentId == null;

  /// ✅ Verificar se é subcategoria
  bool get isSubcategory => parentId != null;

  /// ✅ Tempo desde última atualização (em dias)
  int get daysSinceUpdate {
    final now = DateTime.now();
    return now.difference(updatedAt).inDays;
  }

  /// ✅ Validação completa da categoria
  bool isValid() {
    return isNameValid() && isColorValid();
  }

  /// Factory para deserialização
  factory CategoryEntity.fromJson(Map<String, dynamic> json) {
    return CategoryEntity(
      id: json['id'] as String,
      profileId: json['profile_id'] as String,
      name: json['name'] as String,
      parentId: json['parent_id'] as String?,
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      createdAt: json['created_at'] is String
          ? DateTime.parse(json['created_at'] as String)
          : json['created_at'] as DateTime,
      updatedAt: json['updated_at'] is String
          ? DateTime.parse(json['updated_at'] as String)
          : json['updated_at'] as DateTime,
      sortOrder: json['sort_order'] as int? ?? 0,
    );
  }
}