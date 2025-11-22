import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import '../models/category_model.dart';
import 'category_remote_datasource.dart';

class CategoryRemoteDataSourceImpl implements CategoryRemoteDataSource {
  final SupabaseClient _supabaseClient;
  final Logger _logger = Logger();

  static const String _tableName = 'categories';
  static const int _maxDepth = 5; // Profundidade máxima da hierarquia

  CategoryRemoteDataSourceImpl({required SupabaseClient supabaseClient})
      : _supabaseClient = supabaseClient;

  /// ============ HELPERS PRIVADOS ============

  /// Converte para DateTime de forma segura
  DateTime _parseDateTime(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }

  /// Centraliza criação de CategoryModel
  CategoryModel _createModel(dynamic json) {
    final data = json as Map<String, dynamic>;
    return CategoryModel(
      id: data['id'] as String,
      profileId: data['profile_id'] as String,
      name: data['name'] as String,
      parentId: data['parent_id'] as String?,
      icon: data['icon'] as String?,
      color: data['color'] as String?,
      createdAt: _parseDateTime(data['created_at']),
      updatedAt: _parseDateTime(data['updated_at']),
      sortOrder: data['sort_order'] as int? ?? 0,
    );
  }

  /// Calcula a profundidade de uma categoria na hierarquia
  Future<int> _getDepth(String? categoryId) async {
    if (categoryId == null) return 0;

    try {
      final response = await _supabaseClient
          .from(_tableName)
          .select('parent_id')
          .eq('id', categoryId)
          .maybeSingle();

      if (response == null) return 0;

      final parentId = response['parent_id'] as String?;
      if (parentId == null) return 1;

      return 1 + await _getDepth(parentId);
    } catch (e) {
      _logger.error('CategoryRemoteDataSourceImpl: Erro ao calcular profundidade', err: e);
      return 0;
    }
  }

  /// ============ MÉTODOS PÚBLICOS ============

  @override
  Future<List<CategoryModel>> getByProfile(String profileId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Buscando categorias do perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        _logger.info(
          'CategoryRemoteDataSourceImpl: Nenhuma categoria encontrada',
        );
        return [];
      }

      final models = (response as List)
          .map<CategoryModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'CategoryRemoteDataSourceImpl: ${models.length} categorias encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao buscar categorias',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar categorias',
        code: 'GET_CATEGORIES_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<CategoryModel?> getById(String categoryId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Buscando categoria $categoryId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('id', categoryId)
          .maybeSingle();

      if (response == null) {
        _logger.info(
          'CategoryRemoteDataSourceImpl: Categoria não encontrada',
        );
        return null;
      }

      final model = _createModel(response);

      _logger.info(
        'CategoryRemoteDataSourceImpl: Categoria encontrada: ${model.name}',
      );

      return model;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao buscar categoria',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar categoria',
        code: 'GET_CATEGORY_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<CategoryModel>> getRootCategories(String profileId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Buscando categorias raiz do perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .filter('parent_id', 'is', null)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        _logger.info(
          'CategoryRemoteDataSourceImpl: Nenhuma categoria raiz encontrada',
        );
        return [];
      }

      final models = (response as List)
          .map<CategoryModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'CategoryRemoteDataSourceImpl: ${models.length} categorias raiz encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao buscar categorias raiz',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar categorias',
        code: 'GET_ROOT_CATEGORIES_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<CategoryModel>> getSubcategories(String parentCategoryId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Buscando subcategorias de $parentCategoryId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('parent_id', parentCategoryId)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        _logger.info(
          'CategoryRemoteDataSourceImpl: Nenhuma subcategoria encontrada',
        );
        return [];
      }

      final models = (response as List)
          .map<CategoryModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'CategoryRemoteDataSourceImpl: ${models.length} subcategorias encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao buscar subcategorias',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar subcategorias',
        code: 'GET_SUBCATEGORIES_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<CategoryModel>> getHierarchy(String profileId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Buscando hierarquia do perfil $profileId',
      );

      // Busca todas as categorias do perfil
      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .order('sort_order', ascending: true);

      if (response.isEmpty) {
        return [];
      }

      // Converte para models
      final allModels = (response as List)
          .map<CategoryModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'CategoryRemoteDataSourceImpl: Hierarquia carregada com ${allModels.length} categorias',
      );

      // Retorna todas (o frontend monta a árvore se necessário)
      return allModels;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao buscar hierarquia',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar hierarquia de categorias',
        code: 'GET_HIERARCHY_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<CategoryModel> create(CategoryModel model) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Criando categoria "${model.name}"',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .insert({
            'id': model.id,
            'profile_id': model.profileId,
            'name': model.name,
            'parent_id': model.parentId,
            'icon': model.icon,
            'color': model.color,
            'sort_order': model.sortOrder,
          })
          .select()
          .single();

      final created = _createModel(response);

      _logger.info(
        'CategoryRemoteDataSourceImpl: Categoria criada com sucesso: ${created.id}',
      );

      return created;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao criar categoria',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao criar categoria',
        code: 'CREATE_CATEGORY_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<CategoryModel> update(CategoryModel model) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Atualizando categoria ${model.id}',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .update({
            'name': model.name,
            'parent_id': model.parentId,
            'icon': model.icon,
            'color': model.color,
            'sort_order': model.sortOrder,
            'updated_at': DateTime.now().toIso8601String(),
          })
          .eq('id', model.id)
          .select()
          .single();

      final updated = _createModel(response);

      _logger.info(
        'CategoryRemoteDataSourceImpl: Categoria atualizada com sucesso',
      );

      return updated;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao atualizar categoria',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao atualizar categoria',
        code: 'UPDATE_CATEGORY_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> delete(String categoryId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Deletando categoria $categoryId',
      );

      // Nota: Supabase com RLS + Cascata automática vai deletar subcategorias
      await _supabaseClient.from(_tableName).delete().eq('id', categoryId);

      _logger.info(
        'CategoryRemoteDataSourceImpl: Categoria deletada com sucesso',
      );
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao deletar categoria',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao deletar categoria',
        code: 'DELETE_CATEGORY_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<bool> validateDepth(String profileId, String? parentId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Validando profundidade para parentId=$parentId',
      );

      final depth = await _getDepth(parentId);

      if (depth >= _maxDepth) {
        _logger.warning(
          'CategoryRemoteDataSourceImpl: Profundidade máxima atingida ($depth >= $_maxDepth)',
        );
        return false;
      }

      _logger.info(
        'CategoryRemoteDataSourceImpl: Profundidade validada: $depth < $_maxDepth',
      );

      return true;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao validar profundidade',
        err: e,
        stackTrace: st,
      );
      return false;
    }
  }

  @override
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info(
        'CategoryRemoteDataSourceImpl: Contando categorias do perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select('id')
          .eq('profile_id', profileId)
          .count();

      final count = response.count;

      _logger.info(
        'CategoryRemoteDataSourceImpl: $count categorias encontradas',
      );

      return count;
    } catch (e, st) {
      _logger.error(
        'CategoryRemoteDataSourceImpl: Erro ao contar categorias',
        err: e,
        stackTrace: st,
      );
      return 0;
    }
  }
}