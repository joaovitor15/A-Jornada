import '../entities/transaction_entity.dart';

abstract class TransactionRepository {
  /// Buscar todas as transações de um perfil com paginação
  Future<List<TransactionEntity>> getByProfile(
    String profileId, {
    int page = 1,
    int pageSize = 20,
  });

  /// Buscar transação por ID
  Future<TransactionEntity?> getById(String transactionId);

  /// Buscar transações por período
  Future<List<TransactionEntity>> getByPeriod(
    String profileId,
    DateTime startDate,
    DateTime endDate, {
    int page = 1,
    int pageSize = 20,
  });

  /// Buscar transações de uma categoria
  Future<List<TransactionEntity>> getByCategory(
    String categoryId, {
    int page = 1,
    int pageSize = 20,
  });

  /// Buscar transações com filtros complexos
  Future<List<TransactionEntity>> getFiltered({
    required String profileId,
    String? categoryId,
    String? type,
    DateTime? startDate,
    DateTime? endDate,
    List<String>? tagIds,
    String? searchText,
    int page = 1,
    int pageSize = 20,
  });

  /// Criar transação
  Future<TransactionEntity> create({
    required String profileId,
    required String categoryId,
    required String type,
    required double amount,
    String? description,
    required DateTime date,
    List<String>? tagIds,
  });

  /// Atualizar transação
  Future<TransactionEntity> update({
    required String id,
    String? categoryId,
    String? type,
    double? amount,
    String? description,
    DateTime? date,
    List<String>? tagIds,
  });

  /// Deletar transação
  Future<void> delete(String transactionId);

  /// Adicionar tag a transação
  Future<void> addTag(String transactionId, String tagId);

  /// Remover tag de transação
  Future<void> removeTag(String transactionId, String tagId);

  /// Obter tags de uma transação
  Future<List<String>> getTags(String transactionId);

  /// Contar transações de um perfil
  Future<int> countByProfile(String profileId);

  /// Obter total de despesas em um período
  Future<double> getTotalExpenses(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  );

  /// Obter total de receitas em um período
  Future<double> getTotalIncome(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  );
}