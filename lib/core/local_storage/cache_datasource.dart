/// Interface para Cache (abstração)
abstract class CacheDataSource {
  /// Salvar dados em cache
  Future<void> saveData<T>(String key, T value);

  /// Recuperar dados do cache
  Future<T?> getData<T>(String key);

  /// Deletar dados do cache
  Future<void> deleteData(String key);

  /// Limpar todo o cache
  Future<void> clearAll();

  /// Verificar se existe chave
  Future<bool> hasKey(String key);
}
