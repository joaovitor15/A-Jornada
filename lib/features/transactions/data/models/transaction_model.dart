import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/transaction_entity.dart';

part 'transaction_model.freezed.dart';
part 'transaction_model.g.dart';

@freezed
class TransactionModel with _$TransactionModel {
  const factory TransactionModel({
    required String id,
    required String profileId,
    required String categoryId,
    required String type, // String do banco: 'Income', 'Expense', 'Transfer'
    required double amount,
    String? description,
    required DateTime date,
    required DateTime createdAt,
    required DateTime updatedAt,
    List<String>? tagIds,
  }) = _TransactionModel;

  const TransactionModel._();

  factory TransactionModel.fromJson(Map<String, dynamic> json) =>
      _$TransactionModelFromJson(json);

  /// Converte Model → Entity (conversão de tipos)
  TransactionEntity toEntity() => TransactionEntity(
    id: id,
    profileId: profileId,
    categoryId: categoryId,
    type: TransactionType.fromString(type),
    amount: amount,
    description: description,
    date: date,
    createdAt: createdAt,
    updatedAt: updatedAt,
    tagIds: tagIds,
  );

  /// Converte Entity → Model (para requisições)
  factory TransactionModel.fromEntity(TransactionEntity entity) =>
      TransactionModel(
        id: entity.id,
        profileId: entity.profileId,
        categoryId: entity.categoryId,
        type: entity.type.toDbString(),
        amount: entity.amount,
        description: entity.description,
        date: entity.date,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        tagIds: entity.tagIds,
      );
}