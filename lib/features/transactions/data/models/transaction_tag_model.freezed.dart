// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'transaction_tag_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

TransactionTagModel _$TransactionTagModelFromJson(Map<String, dynamic> json) {
  return _TransactionTagModel.fromJson(json);
}

/// @nodoc
mixin _$TransactionTagModel {
  String get transactionId => throw _privateConstructorUsedError;
  String get tagId => throw _privateConstructorUsedError;
  String get profileId => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this TransactionTagModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TransactionTagModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TransactionTagModelCopyWith<TransactionTagModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TransactionTagModelCopyWith<$Res> {
  factory $TransactionTagModelCopyWith(
          TransactionTagModel value, $Res Function(TransactionTagModel) then) =
      _$TransactionTagModelCopyWithImpl<$Res, TransactionTagModel>;
  @useResult
  $Res call(
      {String transactionId,
      String tagId,
      String profileId,
      DateTime createdAt});
}

/// @nodoc
class _$TransactionTagModelCopyWithImpl<$Res, $Val extends TransactionTagModel>
    implements $TransactionTagModelCopyWith<$Res> {
  _$TransactionTagModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TransactionTagModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? tagId = null,
    Object? profileId = null,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$TransactionTagModelImplCopyWith<$Res>
    implements $TransactionTagModelCopyWith<$Res> {
  factory _$$TransactionTagModelImplCopyWith(_$TransactionTagModelImpl value,
          $Res Function(_$TransactionTagModelImpl) then) =
      __$$TransactionTagModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String transactionId,
      String tagId,
      String profileId,
      DateTime createdAt});
}

/// @nodoc
class __$$TransactionTagModelImplCopyWithImpl<$Res>
    extends _$TransactionTagModelCopyWithImpl<$Res, _$TransactionTagModelImpl>
    implements _$$TransactionTagModelImplCopyWith<$Res> {
  __$$TransactionTagModelImplCopyWithImpl(_$TransactionTagModelImpl _value,
      $Res Function(_$TransactionTagModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of TransactionTagModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? tagId = null,
    Object? profileId = null,
    Object? createdAt = null,
  }) {
    return _then(_$TransactionTagModelImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TransactionTagModelImpl extends _TransactionTagModel {
  const _$TransactionTagModelImpl(
      {required this.transactionId,
      required this.tagId,
      required this.profileId,
      required this.createdAt})
      : super._();

  factory _$TransactionTagModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$TransactionTagModelImplFromJson(json);

  @override
  final String transactionId;
  @override
  final String tagId;
  @override
  final String profileId;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'TransactionTagModel(transactionId: $transactionId, tagId: $tagId, profileId: $profileId, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TransactionTagModelImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId) &&
            (identical(other.tagId, tagId) || other.tagId == tagId) &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, transactionId, tagId, profileId, createdAt);

  /// Create a copy of TransactionTagModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TransactionTagModelImplCopyWith<_$TransactionTagModelImpl> get copyWith =>
      __$$TransactionTagModelImplCopyWithImpl<_$TransactionTagModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TransactionTagModelImplToJson(
      this,
    );
  }
}

abstract class _TransactionTagModel extends TransactionTagModel {
  const factory _TransactionTagModel(
      {required final String transactionId,
      required final String tagId,
      required final String profileId,
      required final DateTime createdAt}) = _$TransactionTagModelImpl;
  const _TransactionTagModel._() : super._();

  factory _TransactionTagModel.fromJson(Map<String, dynamic> json) =
      _$TransactionTagModelImpl.fromJson;

  @override
  String get transactionId;
  @override
  String get tagId;
  @override
  String get profileId;
  @override
  DateTime get createdAt;

  /// Create a copy of TransactionTagModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TransactionTagModelImplCopyWith<_$TransactionTagModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
