// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_response_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GetCategoriesResponseModelImpl _$$GetCategoriesResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetCategoriesResponseModelImpl(
      data: (json['data'] as List<dynamic>)
          .map((e) => CategoryResponseData.fromJson(e as Map<String, dynamic>))
          .toList(),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GetCategoriesResponseModelImplToJson(
        _$GetCategoriesResponseModelImpl instance) =>
    <String, dynamic>{
      'data': instance.data,
      'metadata': instance.metadata,
    };

_$GetCategoryResponseModelImpl _$$GetCategoryResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetCategoryResponseModelImpl(
      data: json['data'] == null
          ? null
          : CategoryResponseData.fromJson(json['data'] as Map<String, dynamic>),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GetCategoryResponseModelImplToJson(
        _$GetCategoryResponseModelImpl instance) =>
    <String, dynamic>{
      'data': instance.data,
      'metadata': instance.metadata,
    };

_$GetHierarchyResponseModelImpl _$$GetHierarchyResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetHierarchyResponseModelImpl(
      data: (json['data'] as List<dynamic>)
          .map((e) => CategoryHierarchyData.fromJson(e as Map<String, dynamic>))
          .toList(),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GetHierarchyResponseModelImplToJson(
        _$GetHierarchyResponseModelImpl instance) =>
    <String, dynamic>{
      'data': instance.data,
      'metadata': instance.metadata,
    };

_$CategoryResponseDataImpl _$$CategoryResponseDataImplFromJson(
        Map<String, dynamic> json) =>
    _$CategoryResponseDataImpl(
      id: json['id'] as String,
      profileId: json['profileId'] as String,
      name: json['name'] as String,
      color: json['color'] as String?,
      icon: json['icon'] as String?,
      parentId: json['parentId'] as String?,
      sortOrder: (json['sortOrder'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$CategoryResponseDataImplToJson(
        _$CategoryResponseDataImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'profileId': instance.profileId,
      'name': instance.name,
      'color': instance.color,
      'icon': instance.icon,
      'parentId': instance.parentId,
      'sortOrder': instance.sortOrder,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

_$CategoryHierarchyDataImpl _$$CategoryHierarchyDataImplFromJson(
        Map<String, dynamic> json) =>
    _$CategoryHierarchyDataImpl(
      id: json['id'] as String,
      profileId: json['profileId'] as String,
      name: json['name'] as String,
      color: json['color'] as String?,
      icon: json['icon'] as String?,
      parentId: json['parentId'] as String?,
      sortOrder: (json['sortOrder'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      subcategories: (json['subcategories'] as List<dynamic>?)
              ?.map((e) =>
                  CategoryHierarchyData.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$$CategoryHierarchyDataImplToJson(
        _$CategoryHierarchyDataImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'profileId': instance.profileId,
      'name': instance.name,
      'color': instance.color,
      'icon': instance.icon,
      'parentId': instance.parentId,
      'sortOrder': instance.sortOrder,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'subcategories': instance.subcategories,
    };

_$ValidateDepthResponseModelImpl _$$ValidateDepthResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$ValidateDepthResponseModelImpl(
      isValid: json['isValid'] as bool,
      currentDepth: (json['currentDepth'] as num).toInt(),
      maxDepth: (json['maxDepth'] as num).toInt(),
      message: json['message'] as String?,
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$ValidateDepthResponseModelImplToJson(
        _$ValidateDepthResponseModelImpl instance) =>
    <String, dynamic>{
      'isValid': instance.isValid,
      'currentDepth': instance.currentDepth,
      'maxDepth': instance.maxDepth,
      'message': instance.message,
      'metadata': instance.metadata,
    };

_$CountResponseModelImpl _$$CountResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CountResponseModelImpl(
      count: (json['count'] as num).toInt(),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$CountResponseModelImplToJson(
        _$CountResponseModelImpl instance) =>
    <String, dynamic>{
      'count': instance.count,
      'metadata': instance.metadata,
    };

_$ResponseMetadataImpl _$$ResponseMetadataImplFromJson(
        Map<String, dynamic> json) =>
    _$ResponseMetadataImpl(
      timestamp: DateTime.parse(json['timestamp'] as String),
      message: json['message'] as String?,
      cached: json['cached'] as bool? ?? false,
      version: json['version'] as String?,
    );

Map<String, dynamic> _$$ResponseMetadataImplToJson(
        _$ResponseMetadataImpl instance) =>
    <String, dynamic>{
      'timestamp': instance.timestamp.toIso8601String(),
      'message': instance.message,
      'cached': instance.cached,
      'version': instance.version,
    };
