import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/transaction_tag_entity.dart';

part 'transaction_tag_model.freezed.dart';
part 'transaction_tag_model.g.dart';

@freezed
class TransactionTagModel with _$TransactionTagModel {
  const factory TransactionTagModel({
    required String transactionId,
    required String tagId,
    required String profileId,
    required DateTime createdAt,
  }) = _TransactionTagModel;

  const TransactionTagModel._();

  factory TransactionTagModel.fromJson(Map<String, dynamic> json) =>
      _$TransactionTagModelFromJson(json);

  /// Converte Model → Entity
  TransactionTagEntity toEntity() => TransactionTagEntity(
    transactionId: transactionId,
    tagId: tagId,
    profileId: profileId,
    createdAt: createdAt,
  );

  /// Converte Entity → Model (para requisições)
  factory TransactionTagModel.fromEntity(TransactionTagEntity entity) =>
      TransactionTagModel(
        transactionId: entity.transactionId,
        tagId: entity.tagId,
        profileId: entity.profileId,
        createdAt: entity.createdAt,
      );
}