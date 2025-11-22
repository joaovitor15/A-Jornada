import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_profile_entity.freezed.dart';


enum ProfileType {
  farmacia('Farmácia'),
  casa('Casa'),
  pessoal('Pessoal'),
  negocio('Negócio'),
  outro('Outro');

  final String displayName;
  const ProfileType(this.displayName);

  /// Converte string do banco para enum
  static ProfileType fromString(String value) {
    try {
      return ProfileType.values.firstWhere(
        (type) => type.displayName == value,
        orElse: () => ProfileType.outro,
      );
    } catch (e) {
      return ProfileType.outro;
    }
  }

  /// Converte enum para string do banco
  String toDbString() => displayName;
}

@freezed
class UserProfileEntity with _$UserProfileEntity {
  const factory UserProfileEntity({
    required String id,
    required String userId,
    required String name,
    required ProfileType type,
    String? icon,
    String? color,
    required bool active,
    required DateTime createdAt,
    required DateTime updatedAt,
    required int sortOrder,
  }) = _UserProfileEntity;

  /// Constructor privado para custom getters
  const UserProfileEntity._();

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

  /// ✅ Verificar se perfil é ativo
  bool get isActive => active;

  /// ✅ Verificar se perfil precisa atualização
  bool get needsUpdate {
    final now = DateTime.now();
    final daysSinceUpdate = now.difference(updatedAt).inDays;
    return daysSinceUpdate > 7;
  }

  /// ✅ Tempo desde última atualização (em dias)
  int get daysSinceUpdate {
    final now = DateTime.now();
    return now.difference(updatedAt).inDays;
  }

  /// ✅ Formatar tipo de perfil para exibição
  String get typeLabel => type.displayName;

  /// ✅ Validação completa do perfil
  bool isValid() {
    return isNameValid() && isColorValid();
  }

  /// Factory para deserialização com conversão de tipo
  factory UserProfileEntity.fromJson(Map<String, dynamic> json) {
    return UserProfileEntity(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      name: json['name'] as String,
      type: ProfileType.fromString(json['type'] as String? ?? 'Outro'),
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      active: json['active'] as bool? ?? true,
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