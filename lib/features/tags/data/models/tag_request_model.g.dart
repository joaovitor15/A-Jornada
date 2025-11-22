// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tag_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GetTagsByProfileRequestModelImpl _$$GetTagsByProfileRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTagsByProfileRequestModelImpl(
      profileId: json['profileId'] as String,
    );

Map<String, dynamic> _$$GetTagsByProfileRequestModelImplToJson(
        _$GetTagsByProfileRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
    };

_$GetTagByIdRequestModelImpl _$$GetTagByIdRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTagByIdRequestModelImpl(
      tagId: json['tagId'] as String,
    );

Map<String, dynamic> _$$GetTagByIdRequestModelImplToJson(
        _$GetTagByIdRequestModelImpl instance) =>
    <String, dynamic>{
      'tagId': instance.tagId,
    };

_$SearchTagsByNameRequestModelImpl _$$SearchTagsByNameRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$SearchTagsByNameRequestModelImpl(
      profileId: json['profileId'] as String,
      searchText: json['searchText'] as String,
    );

Map<String, dynamic> _$$SearchTagsByNameRequestModelImplToJson(
        _$SearchTagsByNameRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'searchText': instance.searchText,
    };

_$CreateTagRequestModelImpl _$$CreateTagRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CreateTagRequestModelImpl(
      profileId: json['profileId'] as String,
      name: json['name'] as String,
      color: json['color'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$CreateTagRequestModelImplToJson(
        _$CreateTagRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'name': instance.name,
      'color': instance.color,
      'sortOrder': instance.sortOrder,
    };

_$UpdateTagRequestModelImpl _$$UpdateTagRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$UpdateTagRequestModelImpl(
      id: json['id'] as String,
      name: json['name'] as String?,
      color: json['color'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$UpdateTagRequestModelImplToJson(
        _$UpdateTagRequestModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'color': instance.color,
      'sortOrder': instance.sortOrder,
    };

_$DeleteTagRequestModelImpl _$$DeleteTagRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$DeleteTagRequestModelImpl(
      tagId: json['tagId'] as String,
    );

Map<String, dynamic> _$$DeleteTagRequestModelImplToJson(
        _$DeleteTagRequestModelImpl instance) =>
    <String, dynamic>{
      'tagId': instance.tagId,
    };

_$CountByProfileRequestModelImpl _$$CountByProfileRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CountByProfileRequestModelImpl(
      profileId: json['profileId'] as String,
    );

Map<String, dynamic> _$$CountByProfileRequestModelImplToJson(
        _$CountByProfileRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
    };

_$GetMostUsedRequestModelImpl _$$GetMostUsedRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetMostUsedRequestModelImpl(
      profileId: json['profileId'] as String,
    );

Map<String, dynamic> _$$GetMostUsedRequestModelImplToJson(
        _$GetMostUsedRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
    };
