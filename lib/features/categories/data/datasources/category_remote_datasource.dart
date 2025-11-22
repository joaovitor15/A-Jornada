import '../models/category_model.dart';

abstract class CategoryRemoteDataSource {
  /// Buscar todas as categorias de um perfil
  /// Retorna lista vazia se nenhuma categoria encontrada
  Future<List<CategoryModel>> getByProfile(String profileId);

  /// Buscar categoria por ID
  /// Retorna null se não encontrado
  Future<CategoryModel?> getById(String categoryId);

  /// Buscar categorias raiz (sem parent) de um perfil
  /// Usa: parentId IS NULL
  Future<List<CategoryModel>> getRootCategories(String profileId);

  /// Buscar subcategorias de uma categoria pai
  /// Usa: parentId = categoryId
  Future<List<CategoryModel>> getSubcategories(String parentCategoryId);

  /// Buscar hierarquia completa (árvore) de um perfil
  /// Retorna categorias pai com subcategorias aninhadas
  Future<List<CategoryModel>> getHierarchy(String profileId);

  /// Criar nova categoria
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<CategoryModel> create(CategoryModel model);

  /// Atualizar categoria existente
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<CategoryModel> update(CategoryModel model);

  /// Deletar categoria (e suas subcategorias)
  /// Lança [NetworkException] se erro de conexão
  Future<void> delete(String categoryId);

  /// Validar profundidade máxima da hierarquia
  /// Retorna true se pode adicionar mais níveis
  Future<bool> validateDepth(String profileId, String? parentId);

  /// Contar categorias diretas de um perfil
  Future<int> countByProfile(String profileId);
}