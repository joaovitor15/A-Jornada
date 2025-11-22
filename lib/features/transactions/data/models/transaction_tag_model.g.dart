// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction_tag_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TransactionTagModelImpl _$$TransactionTagModelImplFromJson(
        Map<String, dynamic> json) =>
    _$TransactionTagModelImpl(
      transactionId: json['transactionId'] as String,
      tagId: json['tagId'] as String,
      profileId: json['profileId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$TransactionTagModelImplToJson(
        _$TransactionTagModelImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
      'tagId': instance.tagId,
      'profileId': instance.profileId,
      'createdAt': instance.createdAt.toIso8601String(),
    };
