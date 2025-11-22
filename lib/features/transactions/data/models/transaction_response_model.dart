import 'package:freezed_annotation/freezed_annotation.dart';

part 'transaction_response_model.freezed.dart';
part 'transaction_response_model.g.dart';

@freezed
class GetTransactionsResponseModel with _$GetTransactionsResponseModel {
  const factory GetTransactionsResponseModel({
    required List<TransactionResponseData> data,
    required PaginationModel pagination,
    required ResponseMetadata metadata,
  }) = _GetTransactionsResponseModel;

  factory GetTransactionsResponseModel.fromJson(Map<String, dynamic> json) =>
      _$GetTransactionsResponseModelFromJson(json);
}

@freezed
class GetTransactionResponseModel with _$GetTransactionResponseModel {
  const factory GetTransactionResponseModel({
    required TransactionResponseData? data,
    required ResponseMetadata metadata,
  }) = _GetTransactionResponseModel;

  factory GetTransactionResponseModel.fromJson(Map<String, dynamic> json) =>
      _$GetTransactionResponseModelFromJson(json);
}

@freezed
class TransactionResponseData with _$TransactionResponseData {
  const factory TransactionResponseData({
    required String id,
    required String profileId,
    required String categoryId,
    required String type,
    required double amount,
    String? description,
    required DateTime date,
    required DateTime createdAt,
    required DateTime updatedAt,
    List<String>? tagIds,
  }) = _TransactionResponseData;

  factory TransactionResponseData.fromJson(Map<String, dynamic> json) =>
      _$TransactionResponseDataFromJson(json);
}

@freezed
class PaginationModel with _$PaginationModel {
  const factory PaginationModel({
    required int total,
    required int page,
    required int pageSize,
    required int totalPages,
    required bool hasMore,
    @Default([]) List<int> availablePageSizes,
  }) = _PaginationModel;

  factory PaginationModel.fromJson(Map<String, dynamic> json) =>
      _$PaginationModelFromJson(json);
}

@freezed
class ResponseMetadata with _$ResponseMetadata {
  const factory ResponseMetadata({
    required DateTime timestamp,
    String? message,
    @Default(false) bool cached,
    String? version,
  }) = _ResponseMetadata;

  factory ResponseMetadata.fromJson(Map<String, dynamic> json) =>
      _$ResponseMetadataFromJson(json);
}

@freezed
class CountResponseModel with _$CountResponseModel {
  const factory CountResponseModel({
    required int count,
    required ResponseMetadata metadata,
  }) = _CountResponseModel;

  factory CountResponseModel.fromJson(Map<String, dynamic> json) =>
      _$CountResponseModelFromJson(json);
}

@freezed
class TotalAmountResponseModel with _$TotalAmountResponseModel {
  const factory TotalAmountResponseModel({
    required double total,
    required String currency,
    required ResponseMetadata metadata,
  }) = _TotalAmountResponseModel;

  factory TotalAmountResponseModel.fromJson(Map<String, dynamic> json) =>
      _$TotalAmountResponseModelFromJson(json);
}

@freezed
class TagsResponseModel with _$TagsResponseModel {
  const factory TagsResponseModel({
    required List<String> tagIds,
    required ResponseMetadata metadata,
  }) = _TagsResponseModel;

  factory TagsResponseModel.fromJson(Map<String, dynamic> json) =>
      _$TagsResponseModelFromJson(json);
}