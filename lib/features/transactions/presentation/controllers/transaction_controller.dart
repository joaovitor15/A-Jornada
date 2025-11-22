// lib/features/transactions/presentation/controllers/transaction_controller.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/features/transactions/domain/entities/transaction_entity.dart';
import 'package:myapp/features/transactions/domain/repositories/transaction_repository.dart';
import 'package:myapp/shared/providers/repository_providers.dart';

/// ============ TRANSAÇÃO STATE NOTIFIER ============

/// ✅ AsyncNotifier para gerenciar estado de transações
class TransactionNotifier extends AsyncNotifier<List<TransactionEntity>> {
  final Logger _logger = Logger();

  late TransactionRepository _repository;

  @override
  Future<List<TransactionEntity>> build() async {
    // Inicializa com lista vazia
    _repository = ref.watch(transactionRepositoryProvider);
    return [];
  }

  /// ✅ Buscar transações por perfil
  Future<void> getByProfile(String profileId) async {
    state = const AsyncValue.loading();

    state = await AsyncValue.guard(() async {
      _logger.info('TransactionNotifier: Buscando transações do perfil $profileId');

      final transactions = await _repository.getByProfile(profileId);

      _logger.info('TransactionNotifier: ${transactions.length} transações encontradas');

      return transactions;
    });
  }

  /// ✅ Buscar transações por período
  Future<List<TransactionEntity>> getByPeriod(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      _logger.info(
        'TransactionNotifier: Buscando transações de ${startDate.toIso8601String()} a ${endDate.toIso8601String()}',
      );

      final transactions = await _repository.getByPeriod(
        profileId,
        startDate,
        endDate,
      );

      _logger.info('TransactionNotifier: ${transactions.length} transações no período');

      return transactions;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao buscar transações por período',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Buscar transações por categoria
  Future<List<TransactionEntity>> getByCategory(String categoryId) async {
    try {
      _logger.info('TransactionNotifier: Buscando transações da categoria $categoryId');

      final transactions = await _repository.getByCategory(categoryId);

      _logger.info('TransactionNotifier: ${transactions.length} transações na categoria');

      return transactions;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao buscar transações por categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Buscar transações com filtros complexos
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
  }) async {
    try {
      _logger.info('TransactionNotifier: Buscando transações com filtros');

      final transactions = await _repository.getFiltered(
        profileId: profileId,
        categoryId: categoryId,
        type: type,
        startDate: startDate,
        endDate: endDate,
        tagIds: tagIds,
        searchText: searchText,
        page: page,
        pageSize: pageSize,
      );

      _logger.info('TransactionNotifier: ${transactions.length} transações encontradas com filtros');

      return transactions;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao buscar transações com filtros',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Criar nova transação
  Future<TransactionEntity> createTransaction({
    required String profileId,
    required String categoryId,
    required String type,
    required double amount,
    String? description,
    required DateTime date,
    List<String>? tagIds,
  }) async {
    try {
      _logger.info(
        'TransactionNotifier: Criando transação de $amount no perfil $profileId',
      );

      final created = await _repository.create(
        profileId: profileId,
        categoryId: categoryId,
        type: type,
        amount: amount,
        description: description,
        date: date,
        tagIds: tagIds,
      );

      _logger.info('TransactionNotifier: Transação criada com sucesso: ${created.id}');

      // ✅ Atualizar estado adicionando a nova transação
      state = AsyncValue.data([...state.value ?? [], created]);

      return created;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao criar transação',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Atualizar transação (renomeado para evitar conflito)
  Future<TransactionEntity> updateTransaction({
    required String id,
    String? categoryId,
    String? type,
    double? amount,
    String? description,
    DateTime? date,
    List<String>? tagIds,
  }) async {
    try {
      _logger.info('TransactionNotifier: Atualizando transação $id');

      final updated = await _repository.update(
        id: id,
        categoryId: categoryId,
        type: type,
        amount: amount,
        description: description,
        date: date,
        tagIds: tagIds,
      );

      _logger.info('TransactionNotifier: Transação atualizada com sucesso: ${updated.id}');

      // ✅ Atualizar estado substituindo a transação
      final currentTransactions = state.value ?? [];
      final updatedList = currentTransactions.map((txn) {
        return txn.id == id ? updated : txn;
      }).toList();

      state = AsyncValue.data(updatedList);

      return updated;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao atualizar transação',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Deletar transação
  Future<void> deleteTransaction(String transactionId) async {
    try {
      _logger.info('TransactionNotifier: Deletando transação $transactionId');

      await _repository.delete(transactionId);

      _logger.info('TransactionNotifier: Transação deletada com sucesso: $transactionId');

      // ✅ Atualizar estado removendo a transação
      final currentTransactions = state.value ?? [];
      final updatedList = currentTransactions
          .where((txn) => txn.id != transactionId)
          .toList();

      state = AsyncValue.data(updatedList);
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao deletar transação',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Adicionar tag a transação
  Future<void> addTag(String transactionId, String tagId) async {
    try {
      _logger.info('TransactionNotifier: Adicionando tag $tagId à transação $transactionId');

      await _repository.addTag(transactionId, tagId);

      _logger.info('TransactionNotifier: Tag adicionada com sucesso');
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao adicionar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Remover tag de transação
  Future<void> removeTag(String transactionId, String tagId) async {
    try {
      _logger.info('TransactionNotifier: Removendo tag $tagId da transação $transactionId');

      await _repository.removeTag(transactionId, tagId);

      _logger.info('TransactionNotifier: Tag removida com sucesso');
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao remover tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Obter tags de uma transação
  Future<List<String>> getTags(String transactionId) async {
    try {
      _logger.info('TransactionNotifier: Buscando tags da transação $transactionId');

      final tagIds = await _repository.getTags(transactionId);

      _logger.info('TransactionNotifier: ${tagIds.length} tags encontradas');

      return tagIds;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao buscar tags',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Contar transações de um perfil
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info('TransactionNotifier: Contando transações do perfil $profileId');

      final count = await _repository.countByProfile(profileId);

      _logger.info('TransactionNotifier: Total de transações: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao contar transações',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Obter total de despesas no período
  Future<double> getTotalExpenses(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      _logger.info('TransactionNotifier: Calculando despesas totais do período');

      final total = await _repository.getTotalExpenses(profileId, startDate, endDate);

      _logger.info('TransactionNotifier: Total de despesas: $total');

      return total;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao calcular despesas',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Obter total de receitas no período
  Future<double> getTotalIncome(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      _logger.info('TransactionNotifier: Calculando receitas totais do período');

      final total = await _repository.getTotalIncome(profileId, startDate, endDate);

      _logger.info('TransactionNotifier: Total de receitas: $total');

      return total;
    } catch (e, st) {
      _logger.error(
        'TransactionNotifier: Erro ao calcular receitas',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}

/// ============ PROVIDERS ============

/// ✅ TransactionProvider (AsyncNotifierProvider)
/// Expõe List<TransactionEntity> com estado e métodos
final transactionProvider =
    AsyncNotifierProvider<TransactionNotifier, List<TransactionEntity>>(
  () => TransactionNotifier(),
);

/// ✅ Provider para buscar transações por perfil (com parâmetro)
/// Uso: `ref.watch(transactionsByProfileProvider('profile-123'))`
final transactionsByProfileProvider =
    FutureProvider.family<List<TransactionEntity>, String>((ref, profileId) async {
  final repository = ref.watch(transactionRepositoryProvider);
  return await repository.getByProfile(profileId);
});

/// ✅ Provider para buscar transações por período (com parâmetros)
/// Uso: `ref.watch(transactionsByPeriodProvider(('profile-123', startDate, endDate)))`
final transactionsByPeriodProvider = FutureProvider.family<
    List<TransactionEntity>,
    (String, DateTime, DateTime)>((ref, params) async {
  final repository = ref.watch(transactionRepositoryProvider);
  final (profileId, startDate, endDate) = params;
  return await repository.getByPeriod(profileId, startDate, endDate);
});

/// ✅ Provider para buscar transações por categoria (com parâmetro)
/// Uso: `ref.watch(transactionsByCategoryProvider('category-456'))`
final transactionsByCategoryProvider =
    FutureProvider.family<List<TransactionEntity>, String>((ref, categoryId) async {
  final repository = ref.watch(transactionRepositoryProvider);
  return await repository.getByCategory(categoryId);
});

/// ✅ Provider para contar transações (com parâmetro)
/// Uso: `ref.watch(transactionCountProvider('profile-123'))`
final transactionCountProvider =
    FutureProvider.family<int, String>((ref, profileId) async {
  final repository = ref.watch(transactionRepositoryProvider);
  return await repository.countByProfile(profileId);
});

/// ✅ Provider para calcular total de despesas (com parâmetros)
/// Uso: `ref.watch(totalExpensesProvider(('profile-123', startDate, endDate)))`
final totalExpensesProvider = FutureProvider.family<double, (String, DateTime, DateTime)>(
  (ref, params) async {
    final repository = ref.watch(transactionRepositoryProvider);
    final (profileId, startDate, endDate) = params;
    return await repository.getTotalExpenses(profileId, startDate, endDate);
  },
);

/// ✅ Provider para calcular total de receitas (com parâmetros)
/// Uso: `ref.watch(totalIncomeProvider(('profile-123', startDate, endDate)))`
final totalIncomeProvider = FutureProvider.family<double, (String, DateTime, DateTime)>(
  (ref, params) async {
    final repository = ref.watch(transactionRepositoryProvider);
    final (profileId, startDate, endDate) = params;
    return await repository.getTotalIncome(profileId, startDate, endDate);
  },
);