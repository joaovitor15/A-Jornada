import 'package:myapp/core/utils/logger.dart';
import '../../domain/entities/category_entity.dart';
import '../../domain/repositories/category_repository.dart';
import '../datasources/category_remote_datasource.dart';
import '../models/category_model.dart';

class CategoryRepositoryImpl implements CategoryRepository {
  final CategoryRemoteDataSource _remoteDataSource;
  final Logger _logger = Logger();

  CategoryRepositoryImpl({required CategoryRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  @override
  Future<List<CategoryEntity>> getByProfile(String profileId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Buscando categorias do perfil $profileId');

      final models = await _remoteDataSource.getByProfile(profileId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('CategoryRepositoryImpl: ${entities.length} categorias encontradas');

      return entities;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao buscar categorias do perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<CategoryEntity?> getById(String categoryId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Buscando categoria $categoryId');

      final model = await _remoteDataSource.getById(categoryId);

      if (model == null) {
        _logger.info('CategoryRepositoryImpl: Categoria $categoryId não encontrada');
        return null;
      }

      final entity = model.toEntity();

      _logger.info('CategoryRepositoryImpl: Categoria encontrada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao buscar categoria por ID',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<CategoryEntity>> getRootCategories(String profileId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Buscando categorias raiz do perfil $profileId');

      final models = await _remoteDataSource.getRootCategories(profileId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('CategoryRepositoryImpl: ${entities.length} categorias raiz encontradas');

      return entities;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao buscar categorias raiz',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<CategoryEntity>> getSubcategories(String parentCategoryId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Buscando subcategorias de $parentCategoryId');

      final models = await _remoteDataSource.getSubcategories(parentCategoryId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('CategoryRepositoryImpl: ${entities.length} subcategorias encontradas');

      return entities;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao buscar subcategorias',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<CategoryEntity>> getHierarchy(String profileId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Buscando hierarquia completa do perfil $profileId');

      final models = await _remoteDataSource.getHierarchy(profileId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('CategoryRepositoryImpl: Hierarquia obtida com ${entities.length} categorias');

      return entities;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao buscar hierarquia',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<CategoryEntity> create({
    required String profileId,
    required String name,
    String? parentId,
    String? icon,
    String? color,
    int sortOrder = 0,
  }) async {
    try {
      _logger.info('CategoryRepositoryImpl: Criando categoria "$name" no perfil $profileId');

      final model = CategoryModel(
        id: '', // Será gerado pelo servidor
        profileId: profileId,
        name: name,
        parentId: parentId,
        icon: icon,
        color: color,
        sortOrder: sortOrder,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final createdModel = await _remoteDataSource.create(model);
      final entity = createdModel.toEntity();

      _logger.info('CategoryRepositoryImpl: Categoria criada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao criar categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<CategoryEntity> update({
    required String id,
    String? name,
    String? parentId,
    String? icon,
    String? color,
    int? sortOrder,
  }) async {
    try {
      _logger.info('CategoryRepositoryImpl: Atualizando categoria $id');

      // Buscar categoria atual
      final currentModel = await _remoteDataSource.getById(id);

      if (currentModel == null) {
        throw Exception('Categoria não encontrada');
      }

      final updatedModel = CategoryModel(
        id: currentModel.id,
        profileId: currentModel.profileId,
        name: name ?? currentModel.name,
        parentId: parentId ?? currentModel.parentId,
        icon: icon ?? currentModel.icon,
        color: color ?? currentModel.color,
        sortOrder: sortOrder ?? currentModel.sortOrder,
        createdAt: currentModel.createdAt,
        updatedAt: DateTime.now(),
      );

      final resultModel = await _remoteDataSource.update(updatedModel);
      final entity = resultModel.toEntity();

      _logger.info('CategoryRepositoryImpl: Categoria atualizada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao atualizar categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> delete(String categoryId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Deletando categoria $categoryId');

      await _remoteDataSource.delete(categoryId);

      _logger.info('CategoryRepositoryImpl: Categoria deletada: $categoryId');
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao deletar categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<bool> validateDepth(String profileId, String? parentId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Validando profundidade para perfil $profileId');

      final isValid = await _remoteDataSource.validateDepth(profileId, parentId);

      _logger.info('CategoryRepositoryImpl: Profundidade válida: $isValid');

      return isValid;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao validar profundidade',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info('CategoryRepositoryImpl: Contando categorias do perfil $profileId');

      final count = await _remoteDataSource.countByProfile(profileId);

      _logger.info('CategoryRepositoryImpl: Total de categorias: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'CategoryRepositoryImpl: Erro ao contar categorias',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}