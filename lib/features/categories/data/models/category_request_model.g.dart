// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CreateCategoryRequestModelImpl _$$CreateCategoryRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CreateCategoryRequestModelImpl(
      profileId: json['profileId'] as String,
      name: json['name'] as String,
      parentId: json['parentId'] as String?,
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$CreateCategoryRequestModelImplToJson(
        _$CreateCategoryRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'name': instance.name,
      'parentId': instance.parentId,
      'icon': instance.icon,
      'color': instance.color,
      'sortOrder': instance.sortOrder,
    };

_$UpdateCategoryRequestModelImpl _$$UpdateCategoryRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$UpdateCategoryRequestModelImpl(
      id: json['id'] as String,
      name: json['name'] as String?,
      parentId: json['parentId'] as String?,
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$UpdateCategoryRequestModelImplToJson(
        _$UpdateCategoryRequestModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'parentId': instance.parentId,
      'icon': instance.icon,
      'color': instance.color,
      'sortOrder': instance.sortOrder,
    };
