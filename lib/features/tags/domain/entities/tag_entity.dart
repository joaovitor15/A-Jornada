import 'package:freezed_annotation/freezed_annotation.dart';

part 'tag_entity.freezed.dart';

@freezed
class TagEntity with _$TagEntity {
  const factory TagEntity({
    required String id,
    required String profileId,
    required String name,
    String? color,
    required int sortOrder,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _TagEntity;

  const TagEntity._();

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

  /// ✅ Validação completa da tag
  bool isValid() {
    return isNameValid() && isColorValid();
  }

  /// ✅ Tempo desde última atualização (em dias)
  int get daysSinceUpdate {
    final now = DateTime.now();
    return now.difference(updatedAt).inDays;
  }

  /// ✅ Formatar nome da tag (trim)
  String get formattedName => name.trim();

  /// ✅ Verificar se precisa sincronização
  bool get needsSync {
    final now = DateTime.now();
    final daysSinceUpdate = now.difference(updatedAt).inDays;
    return daysSinceUpdate > 7;
  }

  /// Factory para deserialização
  factory TagEntity.fromJson(Map<String, dynamic> json) {
    return TagEntity(
      id: json['id'] as String,
      profileId: json['profile_id'] as String,
      name: json['name'] as String,
      color: json['color'] as String?,
      sortOrder: json['sort_order'] as int? ?? 0,
      createdAt: json['created_at'] is String
          ? DateTime.parse(json['created_at'] as String)
          : json['created_at'] as DateTime,
      updatedAt: json['updated_at'] is String
          ? DateTime.parse(json['updated_at'] as String)
          : json['updated_at'] as DateTime,
    );
  }
}