import '../models/tag_model.dart';

abstract class TagRemoteDataSource {
  /// Buscar todas as tags de um perfil
  /// Retorna lista vazia se nenhuma tag encontrada
  Future<List<TagModel>> getByProfile(String profileId);

  /// Buscar tag por ID
  /// Retorna null se não encontrado
  Future<TagModel?> getById(String tagId);

  /// Buscar tags por nome (busca parcial)
  /// Usa: ILIKE para case-insensitive
  Future<List<TagModel>> searchByName(String profileId, String searchText);

  /// Criar nova tag
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<TagModel> create(TagModel model);

  /// Atualizar tag existente
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<TagModel> update(TagModel model);

  /// Deletar tag
  /// Remove associações em transaction_tags automaticamente (cascata)
  /// Lança [NetworkException] se erro de conexão
  Future<void> delete(String tagId);

  /// Contar tags de um perfil
  Future<int> countByProfile(String profileId);

  /// Obter tags mais usadas de um perfil
  /// Retorna tags ordenadas por frequência de uso
  Future<List<TagModel>> getMostUsed(String profileId, {int limit = 10});
}