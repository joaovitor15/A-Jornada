import '../entities/tag_entity.dart';

abstract class TagRepository {
  /// Buscar todas as tags de um perfil
  Future<List<TagEntity>> getByProfile(String profileId);

  /// Buscar tag por ID
  Future<TagEntity?> getById(String tagId);

  /// Buscar tags por nome (busca parcial)
  Future<List<TagEntity>> searchByName(String profileId, String searchText);

  /// Criar tag
  Future<TagEntity> create({
    required String profileId,
    required String name,
    String? color,
    int sortOrder,
  });

  /// Atualizar tag
  Future<TagEntity> update({
    required String id,
    String? name,
    String? color,
    int? sortOrder,
  });

  /// Deletar tag
  Future<void> delete(String tagId);

  /// Contar tags de um perfil
  Future<int> countByProfile(String profileId);

  /// Obter tags mais usadas
  Future<List<TagEntity>> getMostUsed(String profileId);
}