import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import '../models/tag_model.dart';
import 'tag_remote_datasource.dart';

class TagRemoteDataSourceImpl implements TagRemoteDataSource {
  final SupabaseClient _supabaseClient;
  final Logger _logger = Logger();

  static const String _tableName = 'tags';
  static const String _tagsTableName = 'transaction_tags';

  TagRemoteDataSourceImpl({required SupabaseClient supabaseClient})
      : _supabaseClient = supabaseClient;

  /// ============ HELPERS PRIVADOS ============

  /// Converte para DateTime de forma segura
  DateTime _parseDateTime(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }

  /// Centraliza criação de TagModel
  TagModel _createModel(dynamic json) {
    final data = json as Map<String, dynamic>;
    return TagModel(
      id: data['id'] as String,
      profileId: data['profile_id'] as String,
      name: data['name'] as String,
      color: data['color'] as String?,
      createdAt: _parseDateTime(data['created_at']),
      updatedAt: _parseDateTime(data['updated_at']),
      sortOrder: data['sort_order'] as int? ?? 0,
    );
  }

  /// ============ MÉTODOS PÚBLICOS ============

  @override
  Future<List<TagModel>> getByProfile(String profileId) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Buscando tags do perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        _logger.info(
          'TagRemoteDataSourceImpl: Nenhuma tag encontrada',
        );
        return [];
      }

      final models = (response as List)
          .map<TagModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'TagRemoteDataSourceImpl: ${models.length} tags encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao buscar tags',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar tags',
        code: 'GET_TAGS_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<TagModel?> getById(String tagId) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Buscando tag $tagId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('id', tagId)
          .maybeSingle();

      if (response == null) {
        _logger.info(
          'TagRemoteDataSourceImpl: Tag não encontrada',
        );
        return null;
      }

      final model = _createModel(response);

      _logger.info(
        'TagRemoteDataSourceImpl: Tag encontrada: ${model.name}',
      );

      return model;
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao buscar tag',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar tag',
        code: 'GET_TAG_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<TagModel>> searchByName(String profileId, String searchText) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Buscando tags com nome contendo "$searchText"',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .filter('name', 'ilike', '%$searchText%')
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        _logger.info(
          'TagRemoteDataSourceImpl: Nenhuma tag encontrada com busca',
        );
        return [];
      }

      final models = (response as List)
          .map<TagModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'TagRemoteDataSourceImpl: ${models.length} tags encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao buscar tags por nome',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao buscar tags',
        code: 'SEARCH_TAGS_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<TagModel> create(TagModel model) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Criando tag "${model.name}"',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .insert({
            'id': model.id,
            'profile_id': model.profileId,
            'name': model.name,
            'color': model.color,
            'sort_order': model.sortOrder,
          })
          .select()
          .single();

      final created = _createModel(response);

      _logger.info(
        'TagRemoteDataSourceImpl: Tag criada com sucesso: ${created.id}',
      );

      return created;
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao criar tag',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao criar tag',
        code: 'CREATE_TAG_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<TagModel> update(TagModel model) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Atualizando tag ${model.id}',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .update({
            'name': model.name,
            'color': model.color,
            'sort_order': model.sortOrder,
            'updated_at': DateTime.now().toIso8601String(),
          })
          .eq('id', model.id)
          .select()
          .single();

      final updated = _createModel(response);

      _logger.info(
        'TagRemoteDataSourceImpl: Tag atualizada com sucesso',
      );

      return updated;
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao atualizar tag',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao atualizar tag',
        code: 'UPDATE_TAG_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> delete(String tagId) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Deletando tag $tagId',
      );

      // Deleta associações em transaction_tags (cascata automática via RLS)
      await _supabaseClient
          .from(_tagsTableName)
          .delete()
          .eq('tag_id', tagId);

      // Deleta tag
      await _supabaseClient.from(_tableName).delete().eq('id', tagId);

      _logger.info(
        'TagRemoteDataSourceImpl: Tag deletada com sucesso',
      );
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao deletar tag',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao deletar tag',
        code: 'DELETE_TAG_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Contando tags do perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select('id')
          .eq('profile_id', profileId)
          .count();

      final count = response.count;

      _logger.info(
        'TagRemoteDataSourceImpl: $count tags encontradas',
      );

      return count;
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao contar tags',
        err: e,
        stackTrace: st,
      );
      return 0;
    }
  }

  @override
  Future<List<TagModel>> getMostUsed(String profileId, {int limit = 10}) async {
    try {
      _logger.info(
        'TagRemoteDataSourceImpl: Buscando $limit tags mais usadas do perfil $profileId',
      );

      // Busca todas as tags do perfil
      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        return [];
      }

      final allTags = (response as List)
          .map<TagModel>((json) => _createModel(json))
          .toList();

      // Nota: A ordenação por frequência de uso deveria ser feita
      // com um JOIN na tabela transaction_tags e GROUP BY com COUNT
      // Por enquanto, retornamos as tags ordenadas por sort_order
      // TODO: Otimizar com SQL direto no Supabase

      final mostUsed = allTags.take(limit).toList();

      _logger.info(
        'TagRemoteDataSourceImpl: ${mostUsed.length} tags mais usadas encontradas',
      );

      return mostUsed;
    } catch (e, st) {
      _logger.error(
        'TagRemoteDataSourceImpl: Erro ao buscar tags mais usadas',
        err: e,
        stackTrace: st,
      );
      return [];
    }
  }
}