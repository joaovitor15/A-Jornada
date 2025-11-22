import '../entities/category_entity.dart';

abstract class CategoryRepository {
  /// Buscar todas as categorias de um perfil
  Future<List<CategoryEntity>> getByProfile(String profileId);

  /// Buscar categoria por ID
  Future<CategoryEntity?> getById(String categoryId);

  /// Buscar categorias raiz (sem parent)
  Future<List<CategoryEntity>> getRootCategories(String profileId);

  /// Buscar subcategorias de uma categoria pai
  Future<List<CategoryEntity>> getSubcategories(String parentCategoryId);

  /// Buscar hierarquia completa (árvore)
  Future<List<CategoryEntity>> getHierarchy(String profileId);

  /// Criar categoria
  Future<CategoryEntity> create({
    required String profileId,
    required String name,
    String? parentId,
    String? icon,
    String? color,
    int sortOrder,
  });

  /// Atualizar categoria
  Future<CategoryEntity> update({
    required String id,
    String? name,
    String? parentId,
    String? icon,
    String? color,
    int? sortOrder,
  });

  /// Deletar categoria
  Future<void> delete(String categoryId);

  /// Validar profundidade
  Future<bool> validateDepth(String profileId, String? parentId);

  /// Contar categorias
  Future<int> countByProfile(String profileId);
}