// lib/features/user_profiles/domain/repositories/user_profile_repository.dart
import '../entities/user_profile_entity.dart';

abstract class UserProfileRepository {
  /// ✅ Obter todos os perfis do usuário logado
  Future<List<UserProfileEntity>> getAllByUser(String userId);

  /// ✅ Obter um perfil por ID
  Future<UserProfileEntity?> getById(String profileId);

  /// ✅ Criar novo perfil
  Future<UserProfileEntity> create({
    required String userId,
    required String name,
    required String type,
    String? icon,
    String? color,
    int sortOrder = 0,
  });

  /// ✅ Atualizar perfil
  Future<UserProfileEntity> update({
    required String id,
    String? name,
    String? type,
    String? icon,
    String? color,
    bool? active,
    int? sortOrder,
  });

  /// ✅ Deletar perfil
  Future<void> delete(String profileId);

  /// ✅ Contar perfis do usuário
  Future<int> countByUser(String userId);

  /// ✅ Ativar/desativar perfil
  Future<UserProfileEntity> toggleActive(String profileId);
}