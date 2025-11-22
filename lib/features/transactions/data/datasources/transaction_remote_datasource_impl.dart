import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/core/exceptions/app_auth_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import '../models/transaction_model.dart';
import 'transaction_remote_datasource.dart';

class TransactionRemoteDataSourceImpl implements TransactionRemoteDataSource {
  final SupabaseClient _supabaseClient;
  final Logger _logger = Logger();

  static const String _tableName = 'transactions';
  static const String _tagsTableName = 'transaction_tags';

  TransactionRemoteDataSourceImpl({required SupabaseClient supabaseClient})
      : _supabaseClient = supabaseClient;

  /// ============ HELPERS PRIVADOS ============

  /// Converte para DateTime de forma segura
  DateTime _parseDateTime(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }

  /// Centraliza criação de TransactionModel
  TransactionModel _createModel(dynamic json) {
    final data = json as Map<String, dynamic>;
    return TransactionModel(
      id: data['id'] as String,
      profileId: data['profile_id'] as String,
      categoryId: data['category_id'] as String,
      type: data['type'] as String,
      amount: (data['amount'] as num).toDouble(),
      description: data['description'] as String?,
      date: _parseDateTime(data['date']),
      createdAt: _parseDateTime(data['created_at']),
      updatedAt: _parseDateTime(data['updated_at']),
      tagIds: data['tag_ids'] != null ? List<String>.from(data['tag_ids'] as List) : null,
    );
  }

  /// ============ MÉTODOS PÚBLICOS ============

  @override
  Future<List<TransactionModel>> getByProfile(String profileId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Buscando transações do perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .order('date', ascending: false);

      if (response.isEmpty) {
        _logger.info(
          'TransactionRemoteDataSourceImpl: Nenhuma transação encontrada',
        );
        return [];
      }

      final models = (response as List)
          .map<TransactionModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'TransactionRemoteDataSourceImpl: ${models.length} transações encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao buscar transações',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar transações',
        code: 'GET_TRANSACTIONS_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<TransactionModel?> getById(String transactionId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Buscando transação $transactionId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('id', transactionId)
          .maybeSingle();

      if (response == null) {
        _logger.info(
          'TransactionRemoteDataSourceImpl: Transação não encontrada',
        );
        return null;
      }

      final model = _createModel(response);

      _logger.info(
        'TransactionRemoteDataSourceImpl: Transação encontrada: ${model.id}',
      );

      return model;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao buscar transação',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar transação',
        code: 'GET_TRANSACTION_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<TransactionModel>> getByPeriod(
    String profileId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Buscando transações de $startDate a $endDate',
      );

      final startDateStr = startDate.toIso8601String();
      final endDateStr = endDate.toIso8601String();

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId)
          .gte('date', startDateStr)
          .lte('date', endDateStr)
          .order('date', ascending: false);

      if (response.isEmpty) {
        _logger.info(
          'TransactionRemoteDataSourceImpl: Nenhuma transação no período',
        );
        return [];
      }

      final models = (response as List)
          .map<TransactionModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'TransactionRemoteDataSourceImpl: ${models.length} transações no período',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao buscar transações por período',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar transações',
        code: 'GET_TRANSACTIONS_PERIOD_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<TransactionModel>> getByCategory(String categoryId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Buscando transações da categoria $categoryId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select()
          .eq('category_id', categoryId)
          .order('date', ascending: false);

      if (response.isEmpty) {
        _logger.info(
          'TransactionRemoteDataSourceImpl: Nenhuma transação encontrada',
        );
        return [];
      }

      final models = (response as List)
          .map<TransactionModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'TransactionRemoteDataSourceImpl: ${models.length} transações encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao buscar transações por categoria',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar transações',
        code: 'GET_TRANSACTIONS_CATEGORY_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<TransactionModel>> getFiltered({
    required String profileId,
    String? categoryId,
    String? type,
    DateTime? startDate,
    DateTime? endDate,
    List<String>? tagIds,
    String? searchText,
    int? limit,
    int? offset,
  }) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Buscando transações com filtros',
      );

      var baseQuery = _supabaseClient
          .from(_tableName)
          .select()
          .eq('profile_id', profileId);

      // Aplicar filtros
      if (categoryId != null) {
        baseQuery = baseQuery.eq('category_id', categoryId);
      }

      if (type != null) {
        baseQuery = baseQuery.eq('type', type);
      }

      if (startDate != null) {
        baseQuery = baseQuery.gte('date', startDate.toIso8601String());
      }

      if (endDate != null) {
        baseQuery = baseQuery.lte('date', endDate.toIso8601String());
      }

      if (searchText != null && searchText.isNotEmpty) {
        baseQuery = baseQuery.filter('description', 'ilike', '%$searchText%');
      }

      // Ordenar ANTES de paginar - usar dynamic para evitar erro de tipo
      dynamic query = baseQuery.order('date', ascending: false);

      // Paginação (aplicar por último)
      if (offset != null) {
        query = query.range(offset, offset + (limit ?? 50) - 1);
      } else if (limit != null) {
        query = query.limit(limit);
      }

      final response = await query;

      if (response.isEmpty) {
        _logger.info(
          'TransactionRemoteDataSourceImpl: Nenhuma transação com os filtros',
        );
        return [];
      }

      final models = (response as List)
          .map<TransactionModel>((json) => _createModel(json))
          .toList();

      _logger.info(
        'TransactionRemoteDataSourceImpl: ${models.length} transações encontradas',
      );

      return models;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao buscar transações filtradas',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao carregar transações',
        code: 'GET_TRANSACTIONS_FILTERED_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<TransactionModel> create(TransactionModel model) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Criando transação ${model.type}',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .insert({
            'id': model.id,
            'profile_id': model.profileId,
            'category_id': model.categoryId,
            'type': model.type,
            'amount': model.amount,
            'description': model.description,
            'date': model.date.toIso8601String(),
          })
          .select()
          .single();

      final created = _createModel(response);

      _logger.info(
        'TransactionRemoteDataSourceImpl: Transação criada com sucesso: ${created.id}',
      );

      return created;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao criar transação',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao criar transação',
        code: 'CREATE_TRANSACTION_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<TransactionModel> update(TransactionModel model) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Atualizando transação ${model.id}',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .update({
            'category_id': model.categoryId,
            'type': model.type,
            'amount': model.amount,
            'description': model.description,
            'date': model.date.toIso8601String(),
            'updated_at': DateTime.now().toIso8601String(),
          })
          .eq('id', model.id)
          .select()
          .single();

      final updated = _createModel(response);

      _logger.info(
        'TransactionRemoteDataSourceImpl: Transação atualizada com sucesso',
      );

      return updated;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao atualizar transação',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao atualizar transação',
        code: 'UPDATE_TRANSACTION_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> delete(String transactionId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Deletando transação $transactionId',
      );

      // Deleta tags associadas (cascata automática via RLS)
      await _supabaseClient
          .from(_tagsTableName)
          .delete()
          .eq('transaction_id', transactionId);

      // Deleta transação
      await _supabaseClient.from(_tableName).delete().eq('id', transactionId);

      _logger.info(
        'TransactionRemoteDataSourceImpl: Transação deletada com sucesso',
      );
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao deletar transação',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao deletar transação',
        code: 'DELETE_TRANSACTION_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> addTag(String transactionId, String tagId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Adicionando tag $tagId à transação $transactionId',
      );

      // Buscar a transação para obter profileId
      final transaction = await getById(transactionId);
      if (transaction == null) {
        throw AppAuthException(
          message: 'Transação não encontrada',
          code: 'TRANSACTION_NOT_FOUND',
        );
      }

      await _supabaseClient.from(_tagsTableName).insert({
        'transaction_id': transactionId,
        'tag_id': tagId,
        'profile_id': transaction.profileId,
      });

      _logger.info(
        'TransactionRemoteDataSourceImpl: Tag adicionada com sucesso',
      );
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao adicionar tag',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao adicionar tag',
        code: 'ADD_TAG_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<void> removeTag(String transactionId, String tagId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Removendo tag $tagId da transação $transactionId',
      );

      await _supabaseClient
          .from(_tagsTableName)
          .delete()
          .eq('transaction_id', transactionId)
          .eq('tag_id', tagId);

      _logger.info(
        'TransactionRemoteDataSourceImpl: Tag removida com sucesso',
      );
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao remover tag',
        err: e,
        stackTrace: st,
      );
      throw AppAuthException(
        message: 'Falha ao remover tag',
        code: 'REMOVE_TAG_ERROR',
        stackTrace: st,
      );
    }
  }

  @override
  Future<List<String>> getTags(String transactionId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Buscando tags da transação $transactionId',
      );

      final response = await _supabaseClient
          .from(_tagsTableName)
          .select('tag_id')
          .eq('transaction_id', transactionId);

      if (response.isEmpty) {
        return [];
      }

      final tagIds = (response as List)
          .map<String>((json) => (json as Map<String, dynamic>)['tag_id'] as String)
          .toList();

      _logger.info(
        'TransactionRemoteDataSourceImpl: ${tagIds.length} tags encontradas',
      );

      return tagIds;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao buscar tags',
        err: e,
        stackTrace: st,
      );
      return [];
    }
  }

  @override
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info(
        'TransactionRemoteDataSourceImpl: Contando transações do perfil $profileId',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select('id')
          .eq('profile_id', profileId)
          .count();

      final count = response.count;

      _logger.info(
        'TransactionRemoteDataSourceImpl: $count transações encontradas',
      );

      return count;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao contar transações',
        err: e,
        stackTrace: st,
      );
      return 0;
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
        'TransactionRemoteDataSourceImpl: Calculando despesas totais',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select('amount')
          .eq('profile_id', profileId)
          .eq('type', 'expense')
          .gte('date', startDate.toIso8601String())
          .lte('date', endDate.toIso8601String());

      if (response.isEmpty) {
        return 0.0;
      }

      final total = (response as List)
          .fold<double>(0.0, (sum, json) {
            final amount = (json as Map<String, dynamic>)['amount'] as num;
            return sum + amount.toDouble();
          });

      _logger.info(
        'TransactionRemoteDataSourceImpl: Total de despesas: $total',
      );

      return total;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao calcular despesas',
        err: e,
        stackTrace: st,
      );
      return 0.0;
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
        'TransactionRemoteDataSourceImpl: Calculando receitas totais',
      );

      final response = await _supabaseClient
          .from(_tableName)
          .select('amount')
          .eq('profile_id', profileId)
          .eq('type', 'income')
          .gte('date', startDate.toIso8601String())
          .lte('date', endDate.toIso8601String());

      if (response.isEmpty) {
        return 0.0;
      }

      final total = (response as List)
          .fold<double>(0.0, (sum, json) {
            final amount = (json as Map<String, dynamic>)['amount'] as num;
            return sum + amount.toDouble();
          });

      _logger.info(
        'TransactionRemoteDataSourceImpl: Total de receitas: $total',
      );

      return total;
    } catch (e, st) {
      _logger.error(
        'TransactionRemoteDataSourceImpl: Erro ao calcular receitas',
        err: e,
        stackTrace: st,
      );
      return 0.0;
    }
  }
}