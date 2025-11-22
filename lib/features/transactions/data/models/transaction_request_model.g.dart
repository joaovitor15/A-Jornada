// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GetTransactionsByProfileRequestModelImpl
    _$$GetTransactionsByProfileRequestModelImplFromJson(
            Map<String, dynamic> json) =>
        _$GetTransactionsByProfileRequestModelImpl(
          profileId: json['profileId'] as String,
          page: (json['page'] as num?)?.toInt() ?? 1,
          pageSize: (json['pageSize'] as num?)?.toInt() ?? 20,
        );

Map<String, dynamic> _$$GetTransactionsByProfileRequestModelImplToJson(
        _$GetTransactionsByProfileRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'page': instance.page,
      'pageSize': instance.pageSize,
    };

_$GetTransactionByIdRequestModelImpl
    _$$GetTransactionByIdRequestModelImplFromJson(Map<String, dynamic> json) =>
        _$GetTransactionByIdRequestModelImpl(
          transactionId: json['transactionId'] as String,
        );

Map<String, dynamic> _$$GetTransactionByIdRequestModelImplToJson(
        _$GetTransactionByIdRequestModelImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
    };

_$GetTransactionsByPeriodRequestModelImpl
    _$$GetTransactionsByPeriodRequestModelImplFromJson(
            Map<String, dynamic> json) =>
        _$GetTransactionsByPeriodRequestModelImpl(
          profileId: json['profileId'] as String,
          startDate: DateTime.parse(json['startDate'] as String),
          endDate: DateTime.parse(json['endDate'] as String),
          page: (json['page'] as num?)?.toInt() ?? 1,
          pageSize: (json['pageSize'] as num?)?.toInt() ?? 20,
        );

Map<String, dynamic> _$$GetTransactionsByPeriodRequestModelImplToJson(
        _$GetTransactionsByPeriodRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'page': instance.page,
      'pageSize': instance.pageSize,
    };

_$GetTransactionsByCategoryRequestModelImpl
    _$$GetTransactionsByCategoryRequestModelImplFromJson(
            Map<String, dynamic> json) =>
        _$GetTransactionsByCategoryRequestModelImpl(
          categoryId: json['categoryId'] as String,
          page: (json['page'] as num?)?.toInt() ?? 1,
          pageSize: (json['pageSize'] as num?)?.toInt() ?? 20,
        );

Map<String, dynamic> _$$GetTransactionsByCategoryRequestModelImplToJson(
        _$GetTransactionsByCategoryRequestModelImpl instance) =>
    <String, dynamic>{
      'categoryId': instance.categoryId,
      'page': instance.page,
      'pageSize': instance.pageSize,
    };

_$GetFilteredTransactionsRequestModelImpl
    _$$GetFilteredTransactionsRequestModelImplFromJson(
            Map<String, dynamic> json) =>
        _$GetFilteredTransactionsRequestModelImpl(
          profileId: json['profileId'] as String,
          categoryId: json['categoryId'] as String?,
          type: json['type'] as String?,
          startDate: json['startDate'] == null
              ? null
              : DateTime.parse(json['startDate'] as String),
          endDate: json['endDate'] == null
              ? null
              : DateTime.parse(json['endDate'] as String),
          tagIds: (json['tagIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList(),
          searchText: json['searchText'] as String?,
          page: (json['page'] as num?)?.toInt() ?? 1,
          pageSize: (json['pageSize'] as num?)?.toInt() ?? 20,
        );

Map<String, dynamic> _$$GetFilteredTransactionsRequestModelImplToJson(
        _$GetFilteredTransactionsRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'categoryId': instance.categoryId,
      'type': instance.type,
      'startDate': instance.startDate?.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'tagIds': instance.tagIds,
      'searchText': instance.searchText,
      'page': instance.page,
      'pageSize': instance.pageSize,
    };

_$CreateTransactionRequestModelImpl
    _$$CreateTransactionRequestModelImplFromJson(Map<String, dynamic> json) =>
        _$CreateTransactionRequestModelImpl(
          profileId: json['profileId'] as String,
          categoryId: json['categoryId'] as String,
          type: json['type'] as String,
          amount: (json['amount'] as num).toDouble(),
          description: json['description'] as String?,
          date: DateTime.parse(json['date'] as String),
          tagIds: (json['tagIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList(),
        );

Map<String, dynamic> _$$CreateTransactionRequestModelImplToJson(
        _$CreateTransactionRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'categoryId': instance.categoryId,
      'type': instance.type,
      'amount': instance.amount,
      'description': instance.description,
      'date': instance.date.toIso8601String(),
      'tagIds': instance.tagIds,
    };

_$UpdateTransactionRequestModelImpl
    _$$UpdateTransactionRequestModelImplFromJson(Map<String, dynamic> json) =>
        _$UpdateTransactionRequestModelImpl(
          id: json['id'] as String,
          categoryId: json['categoryId'] as String?,
          type: json['type'] as String?,
          amount: (json['amount'] as num?)?.toDouble(),
          description: json['description'] as String?,
          date: json['date'] == null
              ? null
              : DateTime.parse(json['date'] as String),
          tagIds: (json['tagIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList(),
        );

Map<String, dynamic> _$$UpdateTransactionRequestModelImplToJson(
        _$UpdateTransactionRequestModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'categoryId': instance.categoryId,
      'type': instance.type,
      'amount': instance.amount,
      'description': instance.description,
      'date': instance.date?.toIso8601String(),
      'tagIds': instance.tagIds,
    };

_$DeleteTransactionRequestModelImpl
    _$$DeleteTransactionRequestModelImplFromJson(Map<String, dynamic> json) =>
        _$DeleteTransactionRequestModelImpl(
          transactionId: json['transactionId'] as String,
        );

Map<String, dynamic> _$$DeleteTransactionRequestModelImplToJson(
        _$DeleteTransactionRequestModelImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
    };

_$AddTagRequestModelImpl _$$AddTagRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$AddTagRequestModelImpl(
      transactionId: json['transactionId'] as String,
      tagId: json['tagId'] as String,
    );

Map<String, dynamic> _$$AddTagRequestModelImplToJson(
        _$AddTagRequestModelImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
      'tagId': instance.tagId,
    };

_$RemoveTagRequestModelImpl _$$RemoveTagRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$RemoveTagRequestModelImpl(
      transactionId: json['transactionId'] as String,
      tagId: json['tagId'] as String,
    );

Map<String, dynamic> _$$RemoveTagRequestModelImplToJson(
        _$RemoveTagRequestModelImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
      'tagId': instance.tagId,
    };

_$GetTagsRequestModelImpl _$$GetTagsRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTagsRequestModelImpl(
      transactionId: json['transactionId'] as String,
    );

Map<String, dynamic> _$$GetTagsRequestModelImplToJson(
        _$GetTagsRequestModelImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
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

_$GetTotalExpensesRequestModelImpl _$$GetTotalExpensesRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTotalExpensesRequestModelImpl(
      profileId: json['profileId'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
    );

Map<String, dynamic> _$$GetTotalExpensesRequestModelImplToJson(
        _$GetTotalExpensesRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
    };

_$GetTotalIncomeRequestModelImpl _$$GetTotalIncomeRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GetTotalIncomeRequestModelImpl(
      profileId: json['profileId'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
    );

Map<String, dynamic> _$$GetTotalIncomeRequestModelImplToJson(
        _$GetTotalIncomeRequestModelImpl instance) =>
    <String, dynamic>{
      'profileId': instance.profileId,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
    };
