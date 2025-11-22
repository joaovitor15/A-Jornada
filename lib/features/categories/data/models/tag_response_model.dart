import 'package:freezed_annotation/freezed_annotation.dart';

part 'tag_response_model.freezed.dart';
part 'tag_response_model.g.dart';

@freezed
class GetTagsResponseModel with _$GetTagsResponseModel {
  const factory GetTagsResponseModel({
    required List<TagResponseData> data,
    required ResponseMetadata metadata,
  }) = _GetTagsResponseModel;

  factory GetTagsResponseModel.fromJson(Map<String, dynamic> json) =>
      _$GetTagsResponseModelFromJson(json);
}

@freezed
class GetTagResponseModel with _$GetTagResponseModel {
  const factory GetTagResponseModel({
    required TagResponseData? data,
    required ResponseMetadata metadata,
  }) = _GetTagResponseModel;

  factory GetTagResponseModel.fromJson(Map<String, dynamic> json) =>
      _$GetTagResponseModelFromJson(json);
}

@freezed
class TagResponseData with _$TagResponseData {
  const factory TagResponseData({
    required String id,
    required String profileId,
    required String name,
    String? color,
    required int sortOrder,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _TagResponseData;

  factory TagResponseData.fromJson(Map<String, dynamic> json) =>
      _$TagResponseDataFromJson(json);
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