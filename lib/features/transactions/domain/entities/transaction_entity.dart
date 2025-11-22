import 'package:freezed_annotation/freezed_annotation.dart';

part 'transaction_entity.freezed.dart';

enum TransactionType {
  income('Income'),
  expense('Expense'),
  transfer('Transfer');

  final String dbValue;
  const TransactionType(this.dbValue);

  /// Converte string do banco para enum
  static TransactionType fromString(String value) {
    try {
      return TransactionType.values.firstWhere(
        (type) => type.dbValue == value,
        orElse: () => TransactionType.expense,
      );
    } catch (e) {
      return TransactionType.expense;
    }
  }

  /// Converte enum para string do banco
  String toDbString() => dbValue;

  /// Label para exibição em português
  String get label {
    switch (this) {
      case TransactionType.income:
        return 'Renda';
      case TransactionType.expense:
        return 'Despesa';
      case TransactionType.transfer:
        return 'Transferência';
    }
  }

  /// Ícone para exibição
  String get icon {
    switch (this) {
      case TransactionType.income:
        return '📥';
      case TransactionType.expense:
        return '📤';
      case TransactionType.transfer:
        return '🔄';
    }
  }

  /// Cor para exibição (hex)
  String get color {
    switch (this) {
      case TransactionType.income:
        return '#22C55E'; // Green
      case TransactionType.expense:
        return '#EF4444'; // Red
      case TransactionType.transfer:
        return '#3B82F6'; // Blue
    }
  }
}

@freezed
class TransactionEntity with _$TransactionEntity {
  const factory TransactionEntity({
    required String id,
    required String profileId,
    required String categoryId,
    required TransactionType type,
    required double amount,
    String? description,
    required DateTime date,
    required DateTime createdAt,
    required DateTime updatedAt,
    List<String>? tagIds, // IDs das tags associadas
  }) = _TransactionEntity;

  const TransactionEntity._();

  // ============ GETTERS & VALIDAÇÕES ============

  /// ✅ Validar se valor é positivo e <= 999999.99
  bool isAmountValid() {
    return amount > 0 && amount <= 999999.99;
  }

  /// ✅ Validar se data não é futura
  bool isDateValid() {
    return date.isBefore(DateTime.now().add(const Duration(days: 1)));
  }

  /// ✅ Validar se descrição não tem mais de 500 chars
  bool isDescriptionValid() {
    if (description == null) return true;
    return description!.length <= 500;
  }

  /// ✅ Validação completa da transação
  bool isValid() {
    return isAmountValid() && isDateValid() && isDescriptionValid();
  }

  /// ✅ Formatar valor com símbolo de tipo
  String get formattedAmount {
    final prefix = type == TransactionType.income ? '+' : '-';
    return '$prefix\$${amount.toStringAsFixed(2)}';
  }

  /// ✅ Formatar data para exibição
  String get formattedDate {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    final year = date.year;
    return '$day/$month/$year';
  }

  /// ✅ Verificar se é receita
  bool get isIncome => type == TransactionType.income;

  /// ✅ Verificar se é despesa
  bool get isExpense => type == TransactionType.expense;

  /// ✅ Verificar se é transferência
  bool get isTransfer => type == TransactionType.transfer;

  /// ✅ Verificar se tem tags
  bool get hasTags => tagIds != null && tagIds!.isNotEmpty;

  /// ✅ Tempo desde criação (em dias)
  int get daysSinceCreation {
    final now = DateTime.now();
    return now.difference(createdAt).inDays;
  }

  /// ✅ Verificar se foi atualizada após criação
  bool get wasModified {
    return updatedAt.difference(createdAt).inSeconds > 0;
  }

  /// Factory para deserialização
  factory TransactionEntity.fromJson(Map<String, dynamic> json) {
    return TransactionEntity(
      id: json['id'] as String,
      profileId: json['profile_id'] as String,
      categoryId: json['category_id'] as String,
      type: TransactionType.fromString(json['type'] as String? ?? 'Expense'),
      amount: (json['amount'] is int)
          ? (json['amount'] as int).toDouble()
          : json['amount'] as double,
      description: json['description'] as String?,
      date: json['date'] is String
          ? DateTime.parse(json['date'] as String)
          : json['date'] as DateTime,
      createdAt: json['created_at'] is String
          ? DateTime.parse(json['created_at'] as String)
          : json['created_at'] as DateTime,
      updatedAt: json['updated_at'] is String
          ? DateTime.parse(json['updated_at'] as String)
          : json['updated_at'] as DateTime,
      tagIds: json['tag_ids'] is List
          ? List<String>.from(json['tag_ids'] as List)
          : null,
    );
  }
}