// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_email_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$VerifyEmailRequestModelImpl _$$VerifyEmailRequestModelImplFromJson(
        Map<String, dynamic> json) =>
    _$VerifyEmailRequestModelImpl(
      email: json['email'] as String,
      code: json['code'] as String,
    );

Map<String, dynamic> _$$VerifyEmailRequestModelImplToJson(
        _$VerifyEmailRequestModelImpl instance) =>
    <String, dynamic>{
      'email': instance.email,
      'code': instance.code,
    };
