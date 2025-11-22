import 'package:myapp/core/utils/logger.dart';
import '../../domain/entities/transaction_entity.dart';
import '../../domain/repositories/transaction_repository.dart';
import '../datasources/transaction_remote_datasource.dart';
import '../models/transaction_model.dart';

class TransactionRepositoryImpl implements TransactionRepository {
  final TransactionRemoteDataSource _remoteDataSource;
  final Logger _logger = Logger();

  TransactionRepositoryImpl({required TransactionRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  @override
  Future<List<TransactionEntity>> getByProfile(
    String profileId, {
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      _logger.info(
        'TransactionRepositoryImpl: Buscando transações do perfil $profileId (página $page)',
      );

      final models = await _remoteDataSource.getByProfile(profileId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info(
        'TransactionRepositoryImpl: ${entities.length} transações encontradas',
      );

      return entities;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao buscar transações do perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<TransactionEntity?> getById(String transactionId) async {
    try {
      _logger.info('TransactionRepositoryImpl: Buscando transação $transactionId');

      final model = await _remoteDataSource.getById(transactionId);

      if (model == null) {
        _logger.info('TransactionRepositoryImpl: Transação $transactionId não encontrada');
        return null;
      }

      final entity = model.toEntity();

      _logger.info('TransactionRepositoryImpl: Transação encontrada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao buscar transação por ID',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<TransactionEntity>> getByPeriod(
    String profileId,
    DateTime startDate,
    DateTime endDate, {
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      _logger.info(
        'TransactionRepositoryImpl: Buscando transações do período '
        '${startDate.toIso8601String()} a ${endDate.toIso8601String()}',
      );

      final models = await _remoteDataSource.getByPeriod(profileId, startDate, endDate);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info(
        'TransactionRepositoryImpl: ${entities.length} transações encontradas no período',
      );

      return entities;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao buscar transações por período',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<TransactionEntity>> getByCategory(
    String categoryId, {
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      _logger.info(
        'TransactionRepositoryImpl: Buscando transações da categoria $categoryId',
      );

      final models = await _remoteDataSource.getByCategory(categoryId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info(
        'TransactionRepositoryImpl: ${entities.length} transações encontradas na categoria',
      );

      return entities;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao buscar transações por categoria',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
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
      _logger.info(
        'TransactionRepositoryImpl: Buscando transações com filtros complexos',
      );

      final models = await _remoteDataSource.getFiltered(
        profileId: profileId,
        categoryId: categoryId,
        type: type,
        startDate: startDate,
        endDate: endDate,
        tagIds: tagIds,
        searchText: searchText,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      );

      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info(
        'TransactionRepositoryImpl: ${entities.length} transações encontradas com filtros',
      );

      return entities;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao buscar transações com filtros',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<TransactionEntity> create({
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
        'TransactionRepositoryImpl: Criando transação de $amount no perfil $profileId',
      );

      final model = TransactionModel(
        id: '', // Será gerado pelo servidor
        profileId: profileId,
        categoryId: categoryId,
        type: type,
        amount: amount,
        description: description,
        date: date,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        tagIds: tagIds,
      );

      final createdModel = await _remoteDataSource.create(model);
      final entity = createdModel.toEntity();

      _logger.info('TransactionRepositoryImpl: Transação criada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao criar transação',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<TransactionEntity> update({
    required String id,
    String? categoryId,
    String? type,
    double? amount,
    String? description,
    DateTime? date,
    List<String>? tagIds,
  }) async {
    try {
      _logger.info('TransactionRepositoryImpl: Atualizando transação $id');

      // Buscar transação atual
      final currentModel = await _remoteDataSource.getById(id);

      if (currentModel == null) {
        throw Exception('Transação não encontrada');
      }

      final updatedModel = TransactionModel(
        id: currentModel.id,
        profileId: currentModel.profileId,
        categoryId: categoryId ?? currentModel.categoryId,
        type: type ?? currentModel.type,
        amount: amount ?? currentModel.amount,
        description: description ?? currentModel.description,
        date: date ?? currentModel.date,
        createdAt: currentModel.createdAt,
        updatedAt: DateTime.now(),
        tagIds: tagIds ?? currentModel.tagIds,
      );

      final resultModel = await _remoteDataSource.update(updatedModel);
      final entity = resultModel.toEntity();

      _logger.info('TransactionRepositoryImpl: Transação atualizada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao atualizar transação',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> delete(String transactionId) async {
    try {
      _logger.info('TransactionRepositoryImpl: Deletando transação $transactionId');

      await _remoteDataSource.delete(transactionId);

      _logger.info('TransactionRepositoryImpl: Transação deletada: $transactionId');
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao deletar transação',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> addTag(String transactionId, String tagId) async {
    try {
      _logger.info(
        'TransactionRepositoryImpl: Adicionando tag $tagId à transação $transactionId',
      );

      await _remoteDataSource.addTag(transactionId, tagId);

      _logger.info('TransactionRepositoryImpl: Tag adicionada com sucesso');
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao adicionar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> removeTag(String transactionId, String tagId) async {
    try {
      _logger.info(
        'TransactionRepositoryImpl: Removendo tag $tagId da transação $transactionId',
      );

      await _remoteDataSource.removeTag(transactionId, tagId);

      _logger.info('TransactionRepositoryImpl: Tag removida com sucesso');
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao remover tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<String>> getTags(String transactionId) async {
    try {
      _logger.info('TransactionRepositoryImpl: Buscando tags da transação $transactionId');

      final tagIds = await _remoteDataSource.getTags(transactionId);

      _logger.info('TransactionRepositoryImpl: ${tagIds.length} tags encontradas');

      return tagIds;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao buscar tags',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info('TransactionRepositoryImpl: Contando transações do perfil $profileId');

      final count = await _remoteDataSource.countByProfile(profileId);

      _logger.info('TransactionRepositoryImpl: Total de transações: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao contar transações',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<double> getTotalExpenses(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      _logger.info(
        'TransactionRepositoryImpl: Calculando despesas totais do período',
      );

      final total = await _remoteDataSource.getTotalExpenses(profileId, startDate, endDate);

      _logger.info('TransactionRepositoryImpl: Total de despesas: $total');

      return total;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao calcular despesas totais',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<double> getTotalIncome(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      _logger.info(
        'TransactionRepositoryImpl: Calculando receitas totais do período',
      );

      final total = await _remoteDataSource.getTotalIncome(profileId, startDate, endDate);

      _logger.info('TransactionRepositoryImpl: Total de receitas: $total');

      return total;
    } catch (e, st) {
      _logger.error(
        'TransactionRepositoryImpl: Erro ao calcular receitas totais',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}