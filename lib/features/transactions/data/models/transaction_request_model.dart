import 'package:freezed_annotation/freezed_annotation.dart';

part 'transaction_request_model.freezed.dart';
part 'transaction_request_model.g.dart';

@freezed
class GetTransactionsByProfileRequestModel
    with _$GetTransactionsByProfileRequestModel {
  const factory GetTransactionsByProfileRequestModel({
    required String profileId,
    @Default(1) int page,
    @Default(20) int pageSize,
  }) = _GetTransactionsByProfileRequestModel;

  factory GetTransactionsByProfileRequestModel.fromJson(
      Map<String, dynamic> json) =>
      _$GetTransactionsByProfileRequestModelFromJson(json);
}

@freezed
class GetTransactionByIdRequestModel with _$GetTransactionByIdRequestModel {
  const factory GetTransactionByIdRequestModel({
    required String transactionId,
  }) = _GetTransactionByIdRequestModel;

  factory GetTransactionByIdRequestModel.fromJson(Map<String, dynamic> json) =>
      _$GetTransactionByIdRequestModelFromJson(json);
}

@freezed
class GetTransactionsByPeriodRequestModel
    with _$GetTransactionsByPeriodRequestModel {
  const factory GetTransactionsByPeriodRequestModel({
    required String profileId,
    required DateTime startDate,
    required DateTime endDate,
    @Default(1) int page,
    @Default(20) int pageSize,
  }) = _GetTransactionsByPeriodRequestModel;

  factory GetTransactionsByPeriodRequestModel.fromJson(
      Map<String, dynamic> json) =>
      _$GetTransactionsByPeriodRequestModelFromJson(json);
}

@freezed
class GetTransactionsByCategoryRequestModel
    with _$GetTransactionsByCategoryRequestModel {
  const factory GetTransactionsByCategoryRequestModel({
    required String categoryId,
    @Default(1) int page,
    @Default(20) int pageSize,
  }) = _GetTransactionsByCategoryRequestModel;

  factory GetTransactionsByCategoryRequestModel.fromJson(
      Map<String, dynamic> json) =>
      _$GetTransactionsByCategoryRequestModelFromJson(json);
}

@freezed
class GetFilteredTransactionsRequestModel
    with _$GetFilteredTransactionsRequestModel {
  const factory GetFilteredTransactionsRequestModel({
    required String profileId,
    String? categoryId,
    String? type,
    DateTime? startDate,
    DateTime? endDate,
    List<String>? tagIds,
    String? searchText,
    @Default(1) int page,
    @Default(20) int pageSize,
  }) = _GetFilteredTransactionsRequestModel;

  factory GetFilteredTransactionsRequestModel.fromJson(
      Map<String, dynamic> json) =>
      _$GetFilteredTransactionsRequestModelFromJson(json);
}

@freezed
class CreateTransactionRequestModel with _$CreateTransactionRequestModel {
  const factory CreateTransactionRequestModel({
    required String profileId,
    required String categoryId,
    required String type,
    required double amount,
    String? description,
    required DateTime date,
    List<String>? tagIds,
  }) = _CreateTransactionRequestModel;

  factory CreateTransactionRequestModel.fromJson(Map<String, dynamic> json) =>
      _$CreateTransactionRequestModelFromJson(json);
}

@freezed
class UpdateTransactionRequestModel with _$UpdateTransactionRequestModel {
  const factory UpdateTransactionRequestModel({
    required String id,
    String? categoryId,
    String? type,
    double? amount,
    String? description,
    DateTime? date,
    List<String>? tagIds,
  }) = _UpdateTransactionRequestModel;

  factory UpdateTransactionRequestModel.fromJson(Map<String, dynamic> json) =>
      _$UpdateTransactionRequestModelFromJson(json);
}

@freezed
class DeleteTransactionRequestModel with _$DeleteTransactionRequestModel {
  const factory DeleteTransactionRequestModel({
    required String transactionId,
  }) = _DeleteTransactionRequestModel;

  factory DeleteTransactionRequestModel.fromJson(Map<String, dynamic> json) =>
      _$DeleteTransactionRequestModelFromJson(json);
}

@freezed
class AddTagRequestModel with _$AddTagRequestModel {
  const factory AddTagRequestModel({
    required String transactionId,
    required String tagId,
  }) = _AddTagRequestModel;

  factory AddTagRequestModel.fromJson(Map<String, dynamic> json) =>
      _$AddTagRequestModelFromJson(json);
}

@freezed
class RemoveTagRequestModel with _$RemoveTagRequestModel {
  const factory RemoveTagRequestModel({
    required String transactionId,
    required String tagId,
  }) = _RemoveTagRequestModel;

  factory RemoveTagRequestModel.fromJson(Map<String, dynamic> json) =>
      _$RemoveTagRequestModelFromJson(json);
}

@freezed
class GetTagsRequestModel with _$GetTagsRequestModel {
  const factory GetTagsRequestModel({
    required String transactionId,
  }) = _GetTagsRequestModel;

  factory GetTagsRequestModel.fromJson(Map<String, dynamic> json) =>
      _$GetTagsRequestModelFromJson(json);
}

@freezed
class CountByProfileRequestModel with _$CountByProfileRequestModel {
  const factory CountByProfileRequestModel({
    required String profileId,
  }) = _CountByProfileRequestModel;

  factory CountByProfileRequestModel.fromJson(Map<String, dynamic> json) =>
      _$CountByProfileRequestModelFromJson(json);
}

@freezed
class GetTotalExpensesRequestModel with _$GetTotalExpensesRequestModel {
  const factory GetTotalExpensesRequestModel({
    required String profileId,
    required DateTime startDate,
    required DateTime endDate,
  }) = _GetTotalExpensesRequestModel;

  factory GetTotalExpensesRequestModel.fromJson(Map<String, dynamic> json) =>
      _$GetTotalExpensesRequestModelFromJson(json);
}

@freezed
class GetTotalIncomeRequestModel with _$GetTotalIncomeRequestModel {
  const factory GetTotalIncomeRequestModel({
    required String profileId,
    required DateTime startDate,
    required DateTime endDate,
  }) = _GetTotalIncomeRequestModel;

  factory GetTotalIncomeRequestModel.fromJson(Map<String, dynamic> json) =>
      _$GetTotalIncomeRequestModelFromJson(json);
}