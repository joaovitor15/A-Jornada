// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction_response_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GetTransactionsResponseModelImpl _$$GetTransactionsResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTransactionsResponseModelImpl(
      data: (json['data'] as List<dynamic>)
          .map((e) =>
              TransactionResponseData.fromJson(e as Map<String, dynamic>))
          .toList(),
      pagination:
          PaginationModel.fromJson(json['pagination'] as Map<String, dynamic>),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GetTransactionsResponseModelImplToJson(
        _$GetTransactionsResponseModelImpl instance) =>
    <String, dynamic>{
      'data': instance.data,
      'pagination': instance.pagination,
      'metadata': instance.metadata,
    };

_$GetTransactionResponseModelImpl _$$GetTransactionResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTransactionResponseModelImpl(
      data: json['data'] == null
          ? null
          : TransactionResponseData.fromJson(
              json['data'] as Map<String, dynamic>),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GetTransactionResponseModelImplToJson(
        _$GetTransactionResponseModelImpl instance) =>
    <String, dynamic>{
      'data': instance.data,
      'metadata': instance.metadata,
    };

_$TransactionResponseDataImpl _$$TransactionResponseDataImplFromJson(
        Map<String, dynamic> json) =>
    _$TransactionResponseDataImpl(
      id: json['id'] as String,
      profileId: json['profileId'] as String,
      categoryId: json['categoryId'] as String,
      type: json['type'] as String,
      amount: (json['amount'] as num).toDouble(),
      description: json['description'] as String?,
      date: DateTime.parse(json['date'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      tagIds:
          (json['tagIds'] as List<dynamic>?)?.map((e) => e as String).toList(),
    );

Map<String, dynamic> _$$TransactionResponseDataImplToJson(
        _$TransactionResponseDataImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'profileId': instance.profileId,
      'categoryId': instance.categoryId,
      'type': instance.type,
      'amount': instance.amount,
      'description': instance.description,
      'date': instance.date.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'tagIds': instance.tagIds,
    };

_$PaginationModelImpl _$$PaginationModelImplFromJson(
        Map<String, dynamic> json) =>
    _$PaginationModelImpl(
      total: (json['total'] as num).toInt(),
      page: (json['page'] as num).toInt(),
      pageSize: (json['pageSize'] as num).toInt(),
      totalPages: (json['totalPages'] as num).toInt(),
      hasMore: json['hasMore'] as bool,
      availablePageSizes: (json['availablePageSizes'] as List<dynamic>?)
              ?.map((e) => (e as num).toInt())
              .toList() ??
          const [],
    );

Map<String, dynamic> _$$PaginationModelImplToJson(
        _$PaginationModelImpl instance) =>
    <String, dynamic>{
      'total': instance.total,
      'page': instance.page,
      'pageSize': instance.pageSize,
      'totalPages': instance.totalPages,
      'hasMore': instance.hasMore,
      'availablePageSizes': instance.availablePageSizes,
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

_$TotalAmountResponseModelImpl _$$TotalAmountResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$TotalAmountResponseModelImpl(
      total: (json['total'] as num).toDouble(),
      currency: json['currency'] as String,
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$TotalAmountResponseModelImplToJson(
        _$TotalAmountResponseModelImpl instance) =>
    <String, dynamic>{
      'total': instance.total,
      'currency': instance.currency,
      'metadata': instance.metadata,
    };

_$TagsResponseModelImpl _$$TagsResponseModelImplFromJson(
        Map<String, dynamic> json) =>
    _$TagsResponseModelImpl(
      tagIds:
          (json['tagIds'] as List<dynamic>).map((e) => e as String).toList(),
      metadata:
          ResponseMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$TagsResponseModelImplToJson(
        _$TagsResponseModelImpl instance) =>
    <String, dynamic>{
      'tagIds': instance.tagIds,
      'metadata': instance.metadata,
    };
