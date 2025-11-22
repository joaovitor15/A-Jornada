import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import '../models/user_profile_model.dart';
import 'user_profile_remote_datasource.dart';

class UserProfileRemoteDataSourceImpl implements UserProfileRemoteDataSource {
  final SupabaseClient _supabaseClient;
  final Logger _logger = Logger();

  static const String _tableName = 'user_profiles';

  UserProfileRemoteDataSourceImpl({required SupabaseClient supabaseClient})
      : _supabaseClient = supabaseClient;

  /// ============ HELPERS PRIVADOS ============

  /// Converte para DateTime de forma segura
  DateTime _parseDateTime(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }

  /// Centraliza criação de UserProfileModel
  UserProfileModel _createModel(dynamic json) {
    final data = json as Map<String, dynamic>;
    return UserProfileModel(
      id: data['id'] as String,
      userId: data['user_id'] as String,
      name: data['name'] as String,
      type: data['type'] as String,
      icon: data['icon'] as String?,
      color: data['color'] as String?,
      active: data['active'] as bool? ?? true,
      createdAt: _parseDateTime(data['created_at']),
      updatedAt: _parseDateTime(data['updated_at']),
      sortOrder: data['sort_order'] as int? ?? 0,
    );
  }

  /// ============ MÉTODOS PÚBLICOS ============

  @override
  Future<List<UserProfileModel>> getAll(String userId) async {
    try {
      _logger.info(
        'UserProfileRemoteDataSourceImpl: Buscando perfis do usuário $userId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('user_id', userId)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        _logger.info(
          'UserProfileRemoteDataSourceImpl: Nenhum perfil encontrado',
        );
        return [];
      }

      final models = (response as List)
          .map<UserProfileModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'UserProfileRemoteDataSourceImpl: ${models.length} perfis encontrados',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'UserProfileRemoteDataSourceImpl: Erro ao buscar perfis',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar perfis',
        code: 'GET_PROFILES_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<UserProfileModel?> getById(String profileId) async {
    try {
      _logger.info(
        'UserProfileRemoteDataSourceImpl: Buscando perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('id', profileId)
          .maybeSingle();

      if (response == null) {
        _logger.info(
          'UserProfileRemoteDataSourceImpl: Perfil não encontrado',
        );
        return null;
      }

      final model = _createModel(response);

      _logger.info(
        'UserProfileRemoteDataSourceImpl: Perfil encontrado: ${model.name}',
      );

      return model;
    } catch (e, st) {
      _logger.error(
        'UserProfileRemoteDataSourceImpl: Erro ao buscar perfil',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar perfil',
        code: 'GET_PROFILE_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<UserProfileModel>> getActive(String userId) async {
    try {
      _logger.info(
        'UserProfileRemoteDataSourceImpl: Buscando perfis ativos de $userId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('user_id', userId)
          .eq('active', true)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        _logger.info(
          'UserProfileRemoteDataSourceImpl: Nenhum perfil ativo encontrado',
        );
        return [];
      }

      final models = (response as List)
          .map<UserProfileModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'UserProfileRemoteDataSourceImpl: ${models.length} perfis ativos encontrados',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'UserProfileRemoteDataSourceImpl: Erro ao buscar perfis ativos',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar perfis',
        code: 'GET_ACTIVE_PROFILES_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<UserProfileModel> create(UserProfileModel model) async {
    try {
      _logger.info(
        'UserProfileRemoteDataSourceImpl: Criando perfil "${model.name}"',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .insert({
            'id': model.id,
            'user_id': model.userId,
            'name': model.name,
            'type': model.type,
            'icon': model.icon,
            'color': model.color,
            'active': model.active,
            'sort_order': model.sortOrder,
          })
          .select()
          .single();

      final created = _createModel(response);

      _logger.info(
        'UserProfileRemoteDataSourceImpl: Perfil criado com sucesso: ${created.id}',
      );

      return created;
    } catch (e, st) {
      _logger.error(
        'UserProfileRemoteDataSourceImpl: Erro ao criar perfil',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao criar perfil',
        code: 'CREATE_PROFILE_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<UserProfileModel> update(UserProfileModel model) async {
    try {
      _logger.info(
        'UserProfileRemoteDataSourceImpl: Atualizando perfil ${model.id}',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .update({
            'name': model.name,
            'type': model.type,
            'icon': model.icon,
            'color': model.color,
            'active': model.active,
            'sort_order': model.sortOrder,
            'updated_at': DateTime.now().toIso8601String(),
          })
          .eq('id', model.id)
          .select()
          .single();

      final updated = _createModel(response);

      _logger.info(
        'UserProfileRemoteDataSourceImpl: Perfil atualizado com sucesso',
      );

      return updated;
    } catch (e, st) {
      _logger.error(
        'UserProfileRemoteDataSourceImpl: Erro ao atualizar perfil',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao atualizar perfil',
        code: 'UPDATE_PROFILE_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> delete(String profileId) async {
    try {
      _logger.info(
        'UserProfileRemoteDataSourceImpl: Deletando perfil $profileId',
      );

      await _supabaseClient.from(_tableName).delete().eq('id', profileId);

      _logger.info(
        'UserProfileRemoteDataSourceImpl: Perfil deletado com sucesso',
      );
    } catch (e, st) {
      _logger.error(
        'UserProfileRemoteDataSourceImpl: Erro ao deletar perfil',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao deletar perfil',
        code: 'DELETE_PROFILE_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> setActive(String userId, String profileId) async {
    try {
      _logger.info(
        'UserProfileRemoteDataSourceImpl: Definindo perfil $profileId como ativo',
      );

      // 1. Desativar todos os outros perfis do usuário
      await _supabaseClient
          .from(_tableName)
          .update({'active': false})
          .eq('user_id', userId);

      // 2. Ativar o perfil selecionado
      await _supabaseClient
          .from(_tableName)
          .update({'active': true})
          .eq('id', profileId);

      _logger.info(
        'UserProfileRemoteDataSourceImpl: Perfil ativo alterado com sucesso',
      );
    } catch (e, st) {
      _logger.error(
        'UserProfileRemoteDataSourceImpl: Erro ao definir perfil ativo',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao ativar perfil',
        code: 'SET_ACTIVE_PROFILE_ERROR',
        stackTrace: st,
      );
    }
  }
}