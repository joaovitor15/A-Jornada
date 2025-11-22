import 'package:freezed_annotation/freezed_annotation.dart';

part 'category_response_model.freezed.dart';
part 'category_response_model.g.dart';

@freezed
class GetCategoriesResponseModel with _$GetCategoriesResponseModel {
  const factory GetCategoriesResponseModel({
    required List<CategoryResponseData> data,
    required ResponseMetadata metadata,
  }) = _GetCategoriesResponseModel;

  factory GetCategoriesResponseModel.fromJson(Map<String, dynamic> json) =>
      _$GetCategoriesResponseModelFromJson(json);
}

@freezed
class GetCategoryResponseModel with _$GetCategoryResponseModel {
  const factory GetCategoryResponseModel({
    required CategoryResponseData? data,
    required ResponseMetadata metadata,
  }) = _GetCategoryResponseModel;

  factory GetCategoryResponseModel.fromJson(Map<String, dynamic> json) =>
      _$GetCategoryResponseModelFromJson(json);
}

@freezed
class GetHierarchyResponseModel with _$GetHierarchyResponseModel {
  const factory GetHierarchyResponseModel({
    required List<CategoryHierarchyData> data,
    required ResponseMetadata metadata,
  }) = _GetHierarchyResponseModel;

  factory GetHierarchyResponseModel.fromJson(Map<String, dynamic> json) =>
      _$GetHierarchyResponseModelFromJson(json);
}

@freezed
class CategoryResponseData with _$CategoryResponseData {
  const factory CategoryResponseData({
    required String id,
    required String profileId,
    required String name,
    String? color,
    String? icon,
    String? parentId,
    required int sortOrder,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _CategoryResponseData;

  factory CategoryResponseData.fromJson(Map<String, dynamic> json) =>
      _$CategoryResponseDataFromJson(json);
}

@freezed
class CategoryHierarchyData with _$CategoryHierarchyData {
  const factory CategoryHierarchyData({
    required String id,
    required String profileId,
    required String name,
    String? color,
    String? icon,
    String? parentId,
    required int sortOrder,
    required DateTime createdAt,
    required DateTime updatedAt,
    @Default([]) List<CategoryHierarchyData> subcategories,
  }) = _CategoryHierarchyData;

  factory CategoryHierarchyData.fromJson(Map<String, dynamic> json) =>
      _$CategoryHierarchyDataFromJson(json);
}

@freezed
class ValidateDepthResponseModel with _$ValidateDepthResponseModel {
  const factory ValidateDepthResponseModel({
    required bool isValid,
    required int currentDepth,
    required int maxDepth,
    String? message,
    required ResponseMetadata metadata,
  }) = _ValidateDepthResponseModel;

  factory ValidateDepthResponseModel.fromJson(Map<String, dynamic> json) =>
      _$ValidateDepthResponseModelFromJson(json);
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