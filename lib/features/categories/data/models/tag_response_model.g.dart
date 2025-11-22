// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tag_response_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GetTagsResponseModelImpl _$$GetTagsResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTagsResponseModelImpl(
      data: (json['data'] as List<dynamic>)
          .map((e) => TagResponseData.fromJson(e as Map<String, dynamic>))
          .toList(),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GetTagsResponseModelImplToJson(
        _$GetTagsResponseModelImpl instance) =>
    <String, dynamic>{
      'data': instance.data,
      'metadata': instance.metadata,
    };

_$GetTagResponseModelImpl _$$GetTagResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTagResponseModelImpl(
      data: json['data'] == null
          ? null
          : TagResponseData.fromJson(json['data'] as Map<String, dynamic>),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GetTagResponseModelImplToJson(
        _$GetTagResponseModelImpl instance) =>
    <String, dynamic>{
      'data': instance.data,
      'metadata': instance.metadata,
    };

_$TagResponseDataImpl _$$TagResponseDataImplFromJson(
        Map<String, dynamic> json) =>
    _$TagResponseDataImpl(
      id: json['id'] as String,
      profileId: json['profileId'] as String,
      name: json['name'] as String,
      color: json['color'] as String?,
      sortOrder: (json['sortOrder'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$TagResponseDataImplToJson(
        _$TagResponseDataImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'profileId': instance.profileId,
      'name': instance.name,
      'color': instance.color,
      'sortOrder': instance.sortOrder,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
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
