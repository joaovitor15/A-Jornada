import '../models/transaction_model.dart';

abstract class TransactionRemoteDataSource {
  /// Buscar todas as transações de um perfil
  /// Retorna lista vazia se nenhuma transação encontrada
  Future<List<TransactionModel>> getByProfile(String profileId);

  /// Buscar transação por ID
  /// Retorna null se não encontrado
  Future<TransactionModel?> getById(String transactionId);

  /// Buscar transações de um perfil por período (data início e fim)
  /// Usa: date BETWEEN startDate AND endDate
  Future<List<TransactionModel>> getByPeriod(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  );

  /// Buscar transações de uma categoria
  /// Retorna todas as transações de uma categoria específica
  Future<List<TransactionModel>> getByCategory(String categoryId);

  /// Buscar transações com filtros complexos
  /// Suporta: profileId, categoryId, type, dateRange, tags, search
  Future<List<TransactionModel>> getFiltered({
    required String profileId,
    String? categoryId,
    String? type, // 'income', 'expense', 'transfer'
    DateTime? startDate,
    DateTime? endDate,
    List<String>? tagIds,
    String? searchText,
    int? limit,
    int? offset,
  });

  /// Criar nova transação
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<TransactionModel> create(TransactionModel model);

  /// Atualizar transação existente
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<TransactionModel> update(TransactionModel model);

  /// Deletar transação
  /// Lança [NetworkException] se erro de conexão
  Future<void> delete(String transactionId);

  /// Adicionar tag a uma transação
  /// Cria registro em transaction_tags
  Future<void> addTag(String transactionId, String tagId);

  /// Remover tag de uma transação
  /// Deleta registro em transaction_tags
  Future<void> removeTag(String transactionId, String tagId);

  /// Obter tags de uma transação
  /// Retorna lista de IDs de tags
  Future<List<String>> getTags(String transactionId);

  /// Contar transações de um perfil
  Future<int> countByProfile(String profileId);

  /// Obter total de despesas de um período
  Future<double> getTotalExpenses(String profileId, DateTime startDate, DateTime endDate);

  /// Obter total de receitas de um período
  Future<double> getTotalIncome(String profileId, DateTime startDate, DateTime endDate);
}