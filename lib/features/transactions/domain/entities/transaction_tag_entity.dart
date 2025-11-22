import 'package:freezed_annotation/freezed_annotation.dart';

part 'transaction_tag_entity.freezed.dart';

@freezed
class TransactionTagEntity with _$TransactionTagEntity {
  const factory TransactionTagEntity({
    required String transactionId,
    required String tagId,
    required String profileId,
    required DateTime createdAt,
  }) = _TransactionTagEntity;

  const TransactionTagEntity._();

  // ============ GETTERS ============

  /// ✅ Tempo desde associação (em dias)
  int get daysSinceCreation {
    final now = DateTime.now();
    return now.difference(createdAt).inDays;
  }

  /// Factory para deserialização
  factory TransactionTagEntity.fromJson(Map<String, dynamic> json) {
    return TransactionTagEntity(
      transactionId: json['transaction_id'] as String,
      tagId: json['tag_id'] as String,
      profileId: json['profile_id'] as String,
      createdAt: json['created_at'] is String
          ? DateTime.parse(json['created_at'] as String)
          : json['created_at'] as DateTime,
    );
  }
}