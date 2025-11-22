import 'package:freezed_annotation/freezed_annotation.dart';

part 'tag_request_model.freezed.dart';
part 'tag_request_model.g.dart';

@freezed
class GetTagsByProfileRequestModel with _$GetTagsByProfileRequestModel {
  const factory GetTagsByProfileRequestModel({
    required String profileId,
  }) = _GetTagsByProfileRequestModel;

  factory GetTagsByProfileRequestModel.fromJson(Map<String, dynamic> json) =>
      _$GetTagsByProfileRequestModelFromJson(json);
}

@freezed
class GetTagByIdRequestModel with _$GetTagByIdRequestModel {
  const factory GetTagByIdRequestModel({
    required String tagId,
  }) = _GetTagByIdRequestModel;

  factory GetTagByIdRequestModel.fromJson(Map<String, dynamic> json) =>
      _$GetTagByIdRequestModelFromJson(json);
}

@freezed
class SearchTagsByNameRequestModel with _$SearchTagsByNameRequestModel {
  const factory SearchTagsByNameRequestModel({
    required String profileId,
    required String searchText,
  }) = _SearchTagsByNameRequestModel;

  factory SearchTagsByNameRequestModel.fromJson(Map<String, dynamic> json) =>
      _$SearchTagsByNameRequestModelFromJson(json);
}

@freezed
class CreateTagRequestModel with _$CreateTagRequestModel {
  const factory CreateTagRequestModel({
    required String profileId,
    required String name,
    String? color,
    @Default(0) int sortOrder,
  }) = _CreateTagRequestModel;

  factory CreateTagRequestModel.fromJson(Map<String, dynamic> json) =>
      _$CreateTagRequestModelFromJson(json);
}

@freezed
class UpdateTagRequestModel with _$UpdateTagRequestModel {
  const factory UpdateTagRequestModel({
    required String id,
    String? name,
    String? color,
    int? sortOrder,
  }) = _UpdateTagRequestModel;

  factory UpdateTagRequestModel.fromJson(Map<String, dynamic> json) =>
      _$UpdateTagRequestModelFromJson(json);
}

@freezed
class DeleteTagRequestModel with _$DeleteTagRequestModel {
  const factory DeleteTagRequestModel({
    required String tagId,
  }) = _DeleteTagRequestModel;

  factory DeleteTagRequestModel.fromJson(Map<String, dynamic> json) =>
      _$DeleteTagRequestModelFromJson(json);
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
class GetMostUsedRequestModel with _$GetMostUsedRequestModel {
  const factory GetMostUsedRequestModel({
    required String profileId,
  }) = _GetMostUsedRequestModel;

  factory GetMostUsedRequestModel.fromJson(Map<String, dynamic> json) =>
      _$GetMostUsedRequestModelFromJson(json);
}