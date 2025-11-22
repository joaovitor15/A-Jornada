// lib/features/categories/presentation/controllers/category_controller.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/features/categories/domain/entities/category_entity.dart';
import 'package:myapp/features/categories/domain/repositories/category_repository.dart';
import 'package:myapp/shared/providers/repository_providers.dart';

/// ============ CATEGORIA STATE NOTIFIER ============

/// ✅ AsyncNotifier para gerenciar estado de categorias
class CategoryNotifier extends AsyncNotifier<List<CategoryEntity>> {
  final Logger _logger = Logger();

  late CategoryRepository _repository;

  @override
  Future<List<CategoryEntity>> build() async {
    // Inicializa com lista vazia
    _repository = ref.watch(categoryRepositoryProvider);
    return [];
  }

  /// ✅ Buscar categorias por perfil
  Future<void> getByProfile(String profileId) async {
    state = const AsyncValue.loading();

    state = await AsyncValue.guard(() async {
      _logger.info('CategoryNotifier: Buscando categorias do perfil $profileId');

      final categories = await _repository.getByProfile(profileId);

      _logger.info('CategoryNotifier: ${categories.length} categorias encontradas');

      return categories;
    });
  }

  /// ✅ Buscar hierarquia completa de um perfil
  Future<List<CategoryEntity>> getHierarchy(String profileId) async {
    try {
      _logger.info('CategoryNotifier: Buscando hierarquia do perfil $profileId');

      final hierarchy = await _repository.getHierarchy(profileId);

      _logger.info('CategoryNotifier: Hierarquia obtida com ${hierarchy.length} categorias');

      return hierarchy;
    } catch (e, st) {
      _logger.error(
        'CategoryNotifier: Erro ao buscar hierarquia',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Buscar categorias raiz (sem parent)
  Future<List<CategoryEntity>> getRootCategories(String profileId) async {
    try {
      _logger.info('CategoryNotifier: Buscando categorias raiz do perfil $profileId');

      final rootCategories = await _repository.getRootCategories(profileId);

      _logger.info('CategoryNotifier: ${rootCategories.length} categorias raiz encontradas');

      return rootCategories;
    } catch (e, st) {
      _logger.error(
        'CategoryNotifier: Erro ao buscar categorias raiz',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Buscar subcategorias de uma categoria pai
  Future<List<CategoryEntity>> getSubcategories(String parentCategoryId) async {
    try {
      _logger.info('CategoryNotifier: Buscando subcategorias de $parentCategoryId');

      final subcategories = await _repository.getSubcategories(parentCategoryId);

      _logger.info('CategoryNotifier: ${subcategories.length} subcategorias encontradas');

      return subcategories;
    } catch (e, st) {
      _logger.error(
        'CategoryNotifier: Erro ao buscar subcategorias',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Criar nova categoria
  Future<CategoryEntity> createCategory({
    required String profileId,
    required String name,
    String? parentId,
    String? icon,
    String? color,
    int sortOrder = 0,
  }) async {
    try {
      _logger.info('CategoryNotifier: Criando categoria "$name"');

      // Validar profundidade antes de criar
      final isValidDepth = await _repository.validateDepth(profileId, parentId);

      if (!isValidDepth) {
        throw Exception('Profundidade máxima de categorias atingida');
      }

      final created = await _repository.create(
        profileId: profileId,
        name: name,
        parentId: parentId,
        icon: icon,
        color: color,
        sortOrder: sortOrder,
      );

      _logger.info('CategoryNotifier: Categoria criada com sucesso: ${created.id}');

      // ✅ Atualizar estado adicionando a nova categoria
      state = AsyncValue.data([...state.value ?? [], created]);

      return created;
    } catch (e, st) {
      _logger.error(
        'CategoryNotifier: Erro ao criar categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Atualizar categoria (renomeado para evitar conflito)
  Future<CategoryEntity> updateCategory({
    required String id,
    String? name,
    String? parentId,
    String? icon,
    String? color,
    int? sortOrder,
  }) async {
    try {
      _logger.info('CategoryNotifier: Atualizando categoria $id');

      final updated = await _repository.update(
        id: id,
        name: name,
        parentId: parentId,
        icon: icon,
        color: color,
        sortOrder: sortOrder,
      );

      _logger.info('CategoryNotifier: Categoria atualizada com sucesso: ${updated.id}');

      // ✅ Atualizar estado substituindo a categoria
      final currentCategories = state.value ?? [];
      final updatedList = currentCategories.map((cat) {
        return cat.id == id ? updated : cat;
      }).toList();

      state = AsyncValue.data(updatedList);

      return updated;
    } catch (e, st) {
      _logger.error(
        'CategoryNotifier: Erro ao atualizar categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Deletar categoria
  Future<void> deleteCategory(String categoryId) async {
    try {
      _logger.info('CategoryNotifier: Deletando categoria $categoryId');

      await _repository.delete(categoryId);

      _logger.info('CategoryNotifier: Categoria deletada com sucesso: $categoryId');

      // ✅ Atualizar estado removendo a categoria
      final currentCategories = state.value ?? [];
      final updatedList = currentCategories
          .where((cat) => cat.id != categoryId)
          .toList();

      state = AsyncValue.data(updatedList);
    } catch (e, st) {
      _logger.error(
        'CategoryNotifier: Erro ao deletar categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Contar categorias de um perfil
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info('CategoryNotifier: Contando categorias do perfil $profileId');

      final count = await _repository.countByProfile(profileId);

      _logger.info('CategoryNotifier: Total de categorias: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'CategoryNotifier: Erro ao contar categorias',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}

/// ============ PROVIDERS ============

/// ✅ CategoryProvider (AsyncNotifierProvider)
/// Expõe List<CategoryEntity> com estado e métodos
final categoryProvider =
    AsyncNotifierProvider<CategoryNotifier, List<CategoryEntity>>(
  () => CategoryNotifier(),
);

/// ✅ Provider para buscar categorias por perfil (com parâmetro)
/// Uso: `ref.watch(categoriesByProfileProvider('profile-123'))`
final categoriesByProfileProvider =
    FutureProvider.family<List<CategoryEntity>, String>((ref, profileId) async {
  final repository = ref.watch(categoryRepositoryProvider);
  return await repository.getByProfile(profileId);
});

/// ✅ Provider para buscar hierarquia (com parâmetro)
/// Uso: `ref.watch(categoryHierarchyProvider('profile-123'))`
final categoryHierarchyProvider =
    FutureProvider.family<List<CategoryEntity>, String>((ref, profileId) async {
  final repository = ref.watch(categoryRepositoryProvider);
  return await repository.getHierarchy(profileId);
});

/// ✅ Provider para buscar categorias raiz (com parâmetro)
/// Uso: `ref.watch(rootCategoriesProvider('profile-123'))`
final rootCategoriesProvider =
    FutureProvider.family<List<CategoryEntity>, String>((ref, profileId) async {
  final repository = ref.watch(categoryRepositoryProvider);
  return await repository.getRootCategories(profileId);
});

/// ✅ Provider para buscar subcategorias (com parâmetro)
/// Uso: `ref.watch(subcategoriesProvider('category-456'))`
final subcategoriesProvider =
    FutureProvider.family<List<CategoryEntity>, String>((ref, parentId) async {
  final repository = ref.watch(categoryRepositoryProvider);
  return await repository.getSubcategories(parentId);
});

/// ✅ Provider para contar categorias (com parâmetro)
/// Uso: `ref.watch(categoryCountProvider('profile-123'))`
final categoryCountProvider =
    FutureProvider.family<int, String>((ref, profileId) async {
  final repository = ref.watch(categoryRepositoryProvider);
  return await repository.countByProfile(profileId);
});