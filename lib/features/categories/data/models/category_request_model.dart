import 'package:freezed_annotation/freezed_annotation.dart';

part 'category_request_model.freezed.dart';
part 'category_request_model.g.dart';

@freezed
class CreateCategoryRequestModel with _$CreateCategoryRequestModel {
  const factory CreateCategoryRequestModel({
    required String profileId,
    required String name,
    String? parentId,
    String? icon,
    String? color,
    @Default(0) int sortOrder,
  }) = _CreateCategoryRequestModel;

  factory CreateCategoryRequestModel.fromJson(Map<String, dynamic> json) =>
      _$CreateCategoryRequestModelFromJson(json);
}

@freezed
class UpdateCategoryRequestModel with _$UpdateCategoryRequestModel {
  const factory UpdateCategoryRequestModel({
    required String id,
    String? name,
    String? parentId,
    String? icon,
    String? color,
    int? sortOrder,
  }) = _UpdateCategoryRequestModel;

  factory UpdateCategoryRequestModel.fromJson(Map<String, dynamic> json) =>
      _$UpdateCategoryRequestModelFromJson(json);
}