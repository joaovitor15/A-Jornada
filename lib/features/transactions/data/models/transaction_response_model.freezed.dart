// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'transaction_response_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GetTransactionsResponseModel _$GetTransactionsResponseModelFromJson(
    Map<String, dynamic> json) {
  return _GetTransactionsResponseModel.fromJson(json);
}

/// @nodoc
mixin _$GetTransactionsResponseModel {
  List<TransactionResponseData> get data => throw _privateConstructorUsedError;
  PaginationModel get pagination => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this GetTransactionsResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTransactionsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTransactionsResponseModelCopyWith<GetTransactionsResponseModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTransactionsResponseModelCopyWith<$Res> {
  factory $GetTransactionsResponseModelCopyWith(
          GetTransactionsResponseModel value,
          $Res Function(GetTransactionsResponseModel) then) =
      _$GetTransactionsResponseModelCopyWithImpl<$Res,
          GetTransactionsResponseModel>;
  @useResult
  $Res call(
      {List<TransactionResponseData> data,
      PaginationModel pagination,
      ResponseMetadata metadata});

  $PaginationModelCopyWith<$Res> get pagination;
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$GetTransactionsResponseModelCopyWithImpl<$Res,
        $Val extends GetTransactionsResponseModel>
    implements $GetTransactionsResponseModelCopyWith<$Res> {
  _$GetTransactionsResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTransactionsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = null,
    Object? pagination = null,
    Object? metadata = null,
  }) {
    return _then(_value.copyWith(
      data: null == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as List<TransactionResponseData>,
      pagination: null == pagination
          ? _value.pagination
          : pagination // ignore: cast_nullable_to_non_nullable
              as PaginationModel,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of GetTransactionsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PaginationModelCopyWith<$Res> get pagination {
    return $PaginationModelCopyWith<$Res>(_value.pagination, (value) {
      return _then(_value.copyWith(pagination: value) as $Val);
    });
  }

  /// Create a copy of GetTransactionsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ResponseMetadataCopyWith<$Res> get metadata {
    return $ResponseMetadataCopyWith<$Res>(_value.metadata, (value) {
      return _then(_value.copyWith(metadata: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$GetTransactionsResponseModelImplCopyWith<$Res>
    implements $GetTransactionsResponseModelCopyWith<$Res> {
  factory _$$GetTransactionsResponseModelImplCopyWith(
          _$GetTransactionsResponseModelImpl value,
          $Res Function(_$GetTransactionsResponseModelImpl) then) =
      __$$GetTransactionsResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {List<TransactionResponseData> data,
      PaginationModel pagination,
      ResponseMetadata metadata});

  @override
  $PaginationModelCopyWith<$Res> get pagination;
  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$GetTransactionsResponseModelImplCopyWithImpl<$Res>
    extends _$GetTransactionsResponseModelCopyWithImpl<$Res,
        _$GetTransactionsResponseModelImpl>
    implements _$$GetTransactionsResponseModelImplCopyWith<$Res> {
  __$$GetTransactionsResponseModelImplCopyWithImpl(
      _$GetTransactionsResponseModelImpl _value,
      $Res Function(_$GetTransactionsResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTransactionsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = null,
    Object? pagination = null,
    Object? metadata = null,
  }) {
    return _then(_$GetTransactionsResponseModelImpl(
      data: null == data
          ? _value._data
          : data // ignore: cast_nullable_to_non_nullable
              as List<TransactionResponseData>,
      pagination: null == pagination
          ? _value.pagination
          : pagination // ignore: cast_nullable_to_non_nullable
              as PaginationModel,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTransactionsResponseModelImpl
    implements _GetTransactionsResponseModel {
  const _$GetTransactionsResponseModelImpl(
      {required final List<TransactionResponseData> data,
      required this.pagination,
      required this.metadata})
      : _data = data;

  factory _$GetTransactionsResponseModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTransactionsResponseModelImplFromJson(json);

  final List<TransactionResponseData> _data;
  @override
  List<TransactionResponseData> get data {
    if (_data is EqualUnmodifiableListView) return _data;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_data);
  }

  @override
  final PaginationModel pagination;
  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'GetTransactionsResponseModel(data: $data, pagination: $pagination, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTransactionsResponseModelImpl &&
            const DeepCollectionEquality().equals(other._data, _data) &&
            (identical(other.pagination, pagination) ||
                other.pagination == pagination) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType,
      const DeepCollectionEquality().hash(_data), pagination, metadata);

  /// Create a copy of GetTransactionsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTransactionsResponseModelImplCopyWith<
          _$GetTransactionsResponseModelImpl>
      get copyWith => __$$GetTransactionsResponseModelImplCopyWithImpl<
          _$GetTransactionsResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTransactionsResponseModelImplToJson(
      this,
    );
  }
}

abstract class _GetTransactionsResponseModel
    implements GetTransactionsResponseModel {
  const factory _GetTransactionsResponseModel(
          {required final List<TransactionResponseData> data,
          required final PaginationModel pagination,
          required final ResponseMetadata metadata}) =
      _$GetTransactionsResponseModelImpl;

  factory _GetTransactionsResponseModel.fromJson(Map<String, dynamic> json) =
      _$GetTransactionsResponseModelImpl.fromJson;

  @override
  List<TransactionResponseData> get data;
  @override
  PaginationModel get pagination;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of GetTransactionsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTransactionsResponseModelImplCopyWith<
          _$GetTransactionsResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTransactionResponseModel _$GetTransactionResponseModelFromJson(
    Map<String, dynamic> json) {
  return _GetTransactionResponseModel.fromJson(json);
}

/// @nodoc
mixin _$GetTransactionResponseModel {
  TransactionResponseData? get data => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this GetTransactionResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTransactionResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTransactionResponseModelCopyWith<GetTransactionResponseModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTransactionResponseModelCopyWith<$Res> {
  factory $GetTransactionResponseModelCopyWith(
          GetTransactionResponseModel value,
          $Res Function(GetTransactionResponseModel) then) =
      _$GetTransactionResponseModelCopyWithImpl<$Res,
          GetTransactionResponseModel>;
  @useResult
  $Res call({TransactionResponseData? data, ResponseMetadata metadata});

  $TransactionResponseDataCopyWith<$Res>? get data;
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$GetTransactionResponseModelCopyWithImpl<$Res,
        $Val extends GetTransactionResponseModel>
    implements $GetTransactionResponseModelCopyWith<$Res> {
  _$GetTransactionResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTransactionResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = freezed,
    Object? metadata = null,
  }) {
    return _then(_value.copyWith(
      data: freezed == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as TransactionResponseData?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of GetTransactionResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $TransactionResponseDataCopyWith<$Res>? get data {
    if (_value.data == null) {
      return null;
    }

    return $TransactionResponseDataCopyWith<$Res>(_value.data!, (value) {
      return _then(_value.copyWith(data: value) as $Val);
    });
  }

  /// Create a copy of GetTransactionResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ResponseMetadataCopyWith<$Res> get metadata {
    return $ResponseMetadataCopyWith<$Res>(_value.metadata, (value) {
      return _then(_value.copyWith(metadata: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$GetTransactionResponseModelImplCopyWith<$Res>
    implements $GetTransactionResponseModelCopyWith<$Res> {
  factory _$$GetTransactionResponseModelImplCopyWith(
          _$GetTransactionResponseModelImpl value,
          $Res Function(_$GetTransactionResponseModelImpl) then) =
      __$$GetTransactionResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({TransactionResponseData? data, ResponseMetadata metadata});

  @override
  $TransactionResponseDataCopyWith<$Res>? get data;
  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$GetTransactionResponseModelImplCopyWithImpl<$Res>
    extends _$GetTransactionResponseModelCopyWithImpl<$Res,
        _$GetTransactionResponseModelImpl>
    implements _$$GetTransactionResponseModelImplCopyWith<$Res> {
  __$$GetTransactionResponseModelImplCopyWithImpl(
      _$GetTransactionResponseModelImpl _value,
      $Res Function(_$GetTransactionResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTransactionResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = freezed,
    Object? metadata = null,
  }) {
    return _then(_$GetTransactionResponseModelImpl(
      data: freezed == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as TransactionResponseData?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTransactionResponseModelImpl
    implements _GetTransactionResponseModel {
  const _$GetTransactionResponseModelImpl(
      {required this.data, required this.metadata});

  factory _$GetTransactionResponseModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTransactionResponseModelImplFromJson(json);

  @override
  final TransactionResponseData? data;
  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'GetTransactionResponseModel(data: $data, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTransactionResponseModelImpl &&
            (identical(other.data, data) || other.data == data) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, data, metadata);

  /// Create a copy of GetTransactionResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTransactionResponseModelImplCopyWith<_$GetTransactionResponseModelImpl>
      get copyWith => __$$GetTransactionResponseModelImplCopyWithImpl<
          _$GetTransactionResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTransactionResponseModelImplToJson(
      this,
    );
  }
}

abstract class _GetTransactionResponseModel
    implements GetTransactionResponseModel {
  const factory _GetTransactionResponseModel(
          {required final TransactionResponseData? data,
          required final ResponseMetadata metadata}) =
      _$GetTransactionResponseModelImpl;

  factory _GetTransactionResponseModel.fromJson(Map<String, dynamic> json) =
      _$GetTransactionResponseModelImpl.fromJson;

  @override
  TransactionResponseData? get data;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of GetTransactionResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTransactionResponseModelImplCopyWith<_$GetTransactionResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

TransactionResponseData _$TransactionResponseDataFromJson(
    Map<String, dynamic> json) {
  return _TransactionResponseData.fromJson(json);
}

/// @nodoc
mixin _$TransactionResponseData {
  String get id => throw _privateConstructorUsedError;
  String get profileId => throw _privateConstructorUsedError;
  String get categoryId => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  double get amount => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;
  List<String>? get tagIds => throw _privateConstructorUsedError;

  /// Serializes this TransactionResponseData to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TransactionResponseData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TransactionResponseDataCopyWith<TransactionResponseData> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TransactionResponseDataCopyWith<$Res> {
  factory $TransactionResponseDataCopyWith(TransactionResponseData value,
          $Res Function(TransactionResponseData) then) =
      _$TransactionResponseDataCopyWithImpl<$Res, TransactionResponseData>;
  @useResult
  $Res call(
      {String id,
      String profileId,
      String categoryId,
      String type,
      double amount,
      String? description,
      DateTime date,
      DateTime createdAt,
      DateTime updatedAt,
      List<String>? tagIds});
}

/// @nodoc
class _$TransactionResponseDataCopyWithImpl<$Res,
        $Val extends TransactionResponseData>
    implements $TransactionResponseDataCopyWith<$Res> {
  _$TransactionResponseDataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TransactionResponseData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? categoryId = null,
    Object? type = null,
    Object? amount = null,
    Object? description = freezed,
    Object? date = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? tagIds = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as double,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      tagIds: freezed == tagIds
          ? _value.tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$TransactionResponseDataImplCopyWith<$Res>
    implements $TransactionResponseDataCopyWith<$Res> {
  factory _$$TransactionResponseDataImplCopyWith(
          _$TransactionResponseDataImpl value,
          $Res Function(_$TransactionResponseDataImpl) then) =
      __$$TransactionResponseDataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String profileId,
      String categoryId,
      String type,
      double amount,
      String? description,
      DateTime date,
      DateTime createdAt,
      DateTime updatedAt,
      List<String>? tagIds});
}

/// @nodoc
class __$$TransactionResponseDataImplCopyWithImpl<$Res>
    extends _$TransactionResponseDataCopyWithImpl<$Res,
        _$TransactionResponseDataImpl>
    implements _$$TransactionResponseDataImplCopyWith<$Res> {
  __$$TransactionResponseDataImplCopyWithImpl(
      _$TransactionResponseDataImpl _value,
      $Res Function(_$TransactionResponseDataImpl) _then)
      : super(_value, _then);

  /// Create a copy of TransactionResponseData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? categoryId = null,
    Object? type = null,
    Object? amount = null,
    Object? description = freezed,
    Object? date = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? tagIds = freezed,
  }) {
    return _then(_$TransactionResponseDataImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as double,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      tagIds: freezed == tagIds
          ? _value._tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TransactionResponseDataImpl implements _TransactionResponseData {
  const _$TransactionResponseDataImpl(
      {required this.id,
      required this.profileId,
      required this.categoryId,
      required this.type,
      required this.amount,
      this.description,
      required this.date,
      required this.createdAt,
      required this.updatedAt,
      final List<String>? tagIds})
      : _tagIds = tagIds;

  factory _$TransactionResponseDataImpl.fromJson(Map<String, dynamic> json) =>
      _$$TransactionResponseDataImplFromJson(json);

  @override
  final String id;
  @override
  final String profileId;
  @override
  final String categoryId;
  @override
  final String type;
  @override
  final double amount;
  @override
  final String? description;
  @override
  final DateTime date;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;
  final List<String>? _tagIds;
  @override
  List<String>? get tagIds {
    final value = _tagIds;
    if (value == null) return null;
    if (_tagIds is EqualUnmodifiableListView) return _tagIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  String toString() {
    return 'TransactionResponseData(id: $id, profileId: $profileId, categoryId: $categoryId, type: $type, amount: $amount, description: $description, date: $date, createdAt: $createdAt, updatedAt: $updatedAt, tagIds: $tagIds)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TransactionResponseDataImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            const DeepCollectionEquality().equals(other._tagIds, _tagIds));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      profileId,
      categoryId,
      type,
      amount,
      description,
      date,
      createdAt,
      updatedAt,
      const DeepCollectionEquality().hash(_tagIds));

  /// Create a copy of TransactionResponseData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TransactionResponseDataImplCopyWith<_$TransactionResponseDataImpl>
      get copyWith => __$$TransactionResponseDataImplCopyWithImpl<
          _$TransactionResponseDataImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TransactionResponseDataImplToJson(
      this,
    );
  }
}

abstract class _TransactionResponseData implements TransactionResponseData {
  const factory _TransactionResponseData(
      {required final String id,
      required final String profileId,
      required final String categoryId,
      required final String type,
      required final double amount,
      final String? description,
      required final DateTime date,
      required final DateTime createdAt,
      required final DateTime updatedAt,
      final List<String>? tagIds}) = _$TransactionResponseDataImpl;

  factory _TransactionResponseData.fromJson(Map<String, dynamic> json) =
      _$TransactionResponseDataImpl.fromJson;

  @override
  String get id;
  @override
  String get profileId;
  @override
  String get categoryId;
  @override
  String get type;
  @override
  double get amount;
  @override
  String? get description;
  @override
  DateTime get date;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  List<String>? get tagIds;

  /// Create a copy of TransactionResponseData
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TransactionResponseDataImplCopyWith<_$TransactionResponseDataImpl>
      get copyWith => throw _privateConstructorUsedError;
}

PaginationModel _$PaginationModelFromJson(Map<String, dynamic> json) {
  return _PaginationModel.fromJson(json);
}

/// @nodoc
mixin _$PaginationModel {
  int get total => throw _privateConstructorUsedError;
  int get page => throw _privateConstructorUsedError;
  int get pageSize => throw _privateConstructorUsedError;
  int get totalPages => throw _privateConstructorUsedError;
  bool get hasMore => throw _privateConstructorUsedError;
  List<int> get availablePageSizes => throw _privateConstructorUsedError;

  /// Serializes this PaginationModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PaginationModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PaginationModelCopyWith<PaginationModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PaginationModelCopyWith<$Res> {
  factory $PaginationModelCopyWith(
          PaginationModel value, $Res Function(PaginationModel) then) =
      _$PaginationModelCopyWithImpl<$Res, PaginationModel>;
  @useResult
  $Res call(
      {int total,
      int page,
      int pageSize,
      int totalPages,
      bool hasMore,
      List<int> availablePageSizes});
}

/// @nodoc
class _$PaginationModelCopyWithImpl<$Res, $Val extends PaginationModel>
    implements $PaginationModelCopyWith<$Res> {
  _$PaginationModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PaginationModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? total = null,
    Object? page = null,
    Object? pageSize = null,
    Object? totalPages = null,
    Object? hasMore = null,
    Object? availablePageSizes = null,
  }) {
    return _then(_value.copyWith(
      total: null == total
          ? _value.total
          : total // ignore: cast_nullable_to_non_nullable
              as int,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
      totalPages: null == totalPages
          ? _value.totalPages
          : totalPages // ignore: cast_nullable_to_non_nullable
              as int,
      hasMore: null == hasMore
          ? _value.hasMore
          : hasMore // ignore: cast_nullable_to_non_nullable
              as bool,
      availablePageSizes: null == availablePageSizes
          ? _value.availablePageSizes
          : availablePageSizes // ignore: cast_nullable_to_non_nullable
              as List<int>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PaginationModelImplCopyWith<$Res>
    implements $PaginationModelCopyWith<$Res> {
  factory _$$PaginationModelImplCopyWith(_$PaginationModelImpl value,
          $Res Function(_$PaginationModelImpl) then) =
      __$$PaginationModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int total,
      int page,
      int pageSize,
      int totalPages,
      bool hasMore,
      List<int> availablePageSizes});
}

/// @nodoc
class __$$PaginationModelImplCopyWithImpl<$Res>
    extends _$PaginationModelCopyWithImpl<$Res, _$PaginationModelImpl>
    implements _$$PaginationModelImplCopyWith<$Res> {
  __$$PaginationModelImplCopyWithImpl(
      _$PaginationModelImpl _value, $Res Function(_$PaginationModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of PaginationModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? total = null,
    Object? page = null,
    Object? pageSize = null,
    Object? totalPages = null,
    Object? hasMore = null,
    Object? availablePageSizes = null,
  }) {
    return _then(_$PaginationModelImpl(
      total: null == total
          ? _value.total
          : total // ignore: cast_nullable_to_non_nullable
              as int,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
      totalPages: null == totalPages
          ? _value.totalPages
          : totalPages // ignore: cast_nullable_to_non_nullable
              as int,
      hasMore: null == hasMore
          ? _value.hasMore
          : hasMore // ignore: cast_nullable_to_non_nullable
              as bool,
      availablePageSizes: null == availablePageSizes
          ? _value._availablePageSizes
          : availablePageSizes // ignore: cast_nullable_to_non_nullable
              as List<int>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PaginationModelImpl implements _PaginationModel {
  const _$PaginationModelImpl(
      {required this.total,
      required this.page,
      required this.pageSize,
      required this.totalPages,
      required this.hasMore,
      final List<int> availablePageSizes = const []})
      : _availablePageSizes = availablePageSizes;

  factory _$PaginationModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PaginationModelImplFromJson(json);

  @override
  final int total;
  @override
  final int page;
  @override
  final int pageSize;
  @override
  final int totalPages;
  @override
  final bool hasMore;
  final List<int> _availablePageSizes;
  @override
  @JsonKey()
  List<int> get availablePageSizes {
    if (_availablePageSizes is EqualUnmodifiableListView)
      return _availablePageSizes;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_availablePageSizes);
  }

  @override
  String toString() {
    return 'PaginationModel(total: $total, page: $page, pageSize: $pageSize, totalPages: $totalPages, hasMore: $hasMore, availablePageSizes: $availablePageSizes)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PaginationModelImpl &&
            (identical(other.total, total) || other.total == total) &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.pageSize, pageSize) ||
                other.pageSize == pageSize) &&
            (identical(other.totalPages, totalPages) ||
                other.totalPages == totalPages) &&
            (identical(other.hasMore, hasMore) || other.hasMore == hasMore) &&
            const DeepCollectionEquality()
                .equals(other._availablePageSizes, _availablePageSizes));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      total,
      page,
      pageSize,
      totalPages,
      hasMore,
      const DeepCollectionEquality().hash(_availablePageSizes));

  /// Create a copy of PaginationModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PaginationModelImplCopyWith<_$PaginationModelImpl> get copyWith =>
      __$$PaginationModelImplCopyWithImpl<_$PaginationModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PaginationModelImplToJson(
      this,
    );
  }
}

abstract class _PaginationModel implements PaginationModel {
  const factory _PaginationModel(
      {required final int total,
      required final int page,
      required final int pageSize,
      required final int totalPages,
      required final bool hasMore,
      final List<int> availablePageSizes}) = _$PaginationModelImpl;

  factory _PaginationModel.fromJson(Map<String, dynamic> json) =
      _$PaginationModelImpl.fromJson;

  @override
  int get total;
  @override
  int get page;
  @override
  int get pageSize;
  @override
  int get totalPages;
  @override
  bool get hasMore;
  @override
  List<int> get availablePageSizes;

  /// Create a copy of PaginationModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PaginationModelImplCopyWith<_$PaginationModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ResponseMetadata _$ResponseMetadataFromJson(Map<String, dynamic> json) {
  return _ResponseMetadata.fromJson(json);
}

/// @nodoc
mixin _$ResponseMetadata {
  DateTime get timestamp => throw _privateConstructorUsedError;
  String? get message => throw _privateConstructorUsedError;
  bool get cached => throw _privateConstructorUsedError;
  String? get version => throw _privateConstructorUsedError;

  /// Serializes this ResponseMetadata to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ResponseMetadata
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ResponseMetadataCopyWith<ResponseMetadata> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ResponseMetadataCopyWith<$Res> {
  factory $ResponseMetadataCopyWith(
          ResponseMetadata value, $Res Function(ResponseMetadata) then) =
      _$ResponseMetadataCopyWithImpl<$Res, ResponseMetadata>;
  @useResult
  $Res call(
      {DateTime timestamp, String? message, bool cached, String? version});
}

/// @nodoc
class _$ResponseMetadataCopyWithImpl<$Res, $Val extends ResponseMetadata>
    implements $ResponseMetadataCopyWith<$Res> {
  _$ResponseMetadataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ResponseMetadata
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? timestamp = null,
    Object? message = freezed,
    Object? cached = null,
    Object? version = freezed,
  }) {
    return _then(_value.copyWith(
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      cached: null == cached
          ? _value.cached
          : cached // ignore: cast_nullable_to_non_nullable
              as bool,
      version: freezed == version
          ? _value.version
          : version // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ResponseMetadataImplCopyWith<$Res>
    implements $ResponseMetadataCopyWith<$Res> {
  factory _$$ResponseMetadataImplCopyWith(_$ResponseMetadataImpl value,
          $Res Function(_$ResponseMetadataImpl) then) =
      __$$ResponseMetadataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {DateTime timestamp, String? message, bool cached, String? version});
}

/// @nodoc
class __$$ResponseMetadataImplCopyWithImpl<$Res>
    extends _$ResponseMetadataCopyWithImpl<$Res, _$ResponseMetadataImpl>
    implements _$$ResponseMetadataImplCopyWith<$Res> {
  __$$ResponseMetadataImplCopyWithImpl(_$ResponseMetadataImpl _value,
      $Res Function(_$ResponseMetadataImpl) _then)
      : super(_value, _then);

  /// Create a copy of ResponseMetadata
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? timestamp = null,
    Object? message = freezed,
    Object? cached = null,
    Object? version = freezed,
  }) {
    return _then(_$ResponseMetadataImpl(
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      cached: null == cached
          ? _value.cached
          : cached // ignore: cast_nullable_to_non_nullable
              as bool,
      version: freezed == version
          ? _value.version
          : version // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ResponseMetadataImpl implements _ResponseMetadata {
  const _$ResponseMetadataImpl(
      {required this.timestamp,
      this.message,
      this.cached = false,
      this.version});

  factory _$ResponseMetadataImpl.fromJson(Map<String, dynamic> json) =>
      _$$ResponseMetadataImplFromJson(json);

  @override
  final DateTime timestamp;
  @override
  final String? message;
  @override
  @JsonKey()
  final bool cached;
  @override
  final String? version;

  @override
  String toString() {
    return 'ResponseMetadata(timestamp: $timestamp, message: $message, cached: $cached, version: $version)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ResponseMetadataImpl &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.cached, cached) || other.cached == cached) &&
            (identical(other.version, version) || other.version == version));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, timestamp, message, cached, version);

  /// Create a copy of ResponseMetadata
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ResponseMetadataImplCopyWith<_$ResponseMetadataImpl> get copyWith =>
      __$$ResponseMetadataImplCopyWithImpl<_$ResponseMetadataImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ResponseMetadataImplToJson(
      this,
    );
  }
}

abstract class _ResponseMetadata implements ResponseMetadata {
  const factory _ResponseMetadata(
      {required final DateTime timestamp,
      final String? message,
      final bool cached,
      final String? version}) = _$ResponseMetadataImpl;

  factory _ResponseMetadata.fromJson(Map<String, dynamic> json) =
      _$ResponseMetadataImpl.fromJson;

  @override
  DateTime get timestamp;
  @override
  String? get message;
  @override
  bool get cached;
  @override
  String? get version;

  /// Create a copy of ResponseMetadata
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ResponseMetadataImplCopyWith<_$ResponseMetadataImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CountResponseModel _$CountResponseModelFromJson(Map<String, dynamic> json) {
  return _CountResponseModel.fromJson(json);
}

/// @nodoc
mixin _$CountResponseModel {
  int get count => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this CountResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CountResponseModelCopyWith<CountResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CountResponseModelCopyWith<$Res> {
  factory $CountResponseModelCopyWith(
          CountResponseModel value, $Res Function(CountResponseModel) then) =
      _$CountResponseModelCopyWithImpl<$Res, CountResponseModel>;
  @useResult
  $Res call({int count, ResponseMetadata metadata});

  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$CountResponseModelCopyWithImpl<$Res, $Val extends CountResponseModel>
    implements $CountResponseModelCopyWith<$Res> {
  _$CountResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? count = null,
    Object? metadata = null,
  }) {
    return _then(_value.copyWith(
      count: null == count
          ? _value.count
          : count // ignore: cast_nullable_to_non_nullable
              as int,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of CountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ResponseMetadataCopyWith<$Res> get metadata {
    return $ResponseMetadataCopyWith<$Res>(_value.metadata, (value) {
      return _then(_value.copyWith(metadata: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$CountResponseModelImplCopyWith<$Res>
    implements $CountResponseModelCopyWith<$Res> {
  factory _$$CountResponseModelImplCopyWith(_$CountResponseModelImpl value,
          $Res Function(_$CountResponseModelImpl) then) =
      __$$CountResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({int count, ResponseMetadata metadata});

  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$CountResponseModelImplCopyWithImpl<$Res>
    extends _$CountResponseModelCopyWithImpl<$Res, _$CountResponseModelImpl>
    implements _$$CountResponseModelImplCopyWith<$Res> {
  __$$CountResponseModelImplCopyWithImpl(_$CountResponseModelImpl _value,
      $Res Function(_$CountResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? count = null,
    Object? metadata = null,
  }) {
    return _then(_$CountResponseModelImpl(
      count: null == count
          ? _value.count
          : count // ignore: cast_nullable_to_non_nullable
              as int,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CountResponseModelImpl implements _CountResponseModel {
  const _$CountResponseModelImpl({required this.count, required this.metadata});

  factory _$CountResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CountResponseModelImplFromJson(json);

  @override
  final int count;
  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'CountResponseModel(count: $count, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CountResponseModelImpl &&
            (identical(other.count, count) || other.count == count) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, count, metadata);

  /// Create a copy of CountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CountResponseModelImplCopyWith<_$CountResponseModelImpl> get copyWith =>
      __$$CountResponseModelImplCopyWithImpl<_$CountResponseModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CountResponseModelImplToJson(
      this,
    );
  }
}

abstract class _CountResponseModel implements CountResponseModel {
  const factory _CountResponseModel(
      {required final int count,
      required final ResponseMetadata metadata}) = _$CountResponseModelImpl;

  factory _CountResponseModel.fromJson(Map<String, dynamic> json) =
      _$CountResponseModelImpl.fromJson;

  @override
  int get count;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of CountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CountResponseModelImplCopyWith<_$CountResponseModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TotalAmountResponseModel _$TotalAmountResponseModelFromJson(
    Map<String, dynamic> json) {
  return _TotalAmountResponseModel.fromJson(json);
}

/// @nodoc
mixin _$TotalAmountResponseModel {
  double get total => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this TotalAmountResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TotalAmountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TotalAmountResponseModelCopyWith<TotalAmountResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TotalAmountResponseModelCopyWith<$Res> {
  factory $TotalAmountResponseModelCopyWith(TotalAmountResponseModel value,
          $Res Function(TotalAmountResponseModel) then) =
      _$TotalAmountResponseModelCopyWithImpl<$Res, TotalAmountResponseModel>;
  @useResult
  $Res call({double total, String currency, ResponseMetadata metadata});

  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$TotalAmountResponseModelCopyWithImpl<$Res,
        $Val extends TotalAmountResponseModel>
    implements $TotalAmountResponseModelCopyWith<$Res> {
  _$TotalAmountResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TotalAmountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? total = null,
    Object? currency = null,
    Object? metadata = null,
  }) {
    return _then(_value.copyWith(
      total: null == total
          ? _value.total
          : total // ignore: cast_nullable_to_non_nullable
              as double,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of TotalAmountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ResponseMetadataCopyWith<$Res> get metadata {
    return $ResponseMetadataCopyWith<$Res>(_value.metadata, (value) {
      return _then(_value.copyWith(metadata: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$TotalAmountResponseModelImplCopyWith<$Res>
    implements $TotalAmountResponseModelCopyWith<$Res> {
  factory _$$TotalAmountResponseModelImplCopyWith(
          _$TotalAmountResponseModelImpl value,
          $Res Function(_$TotalAmountResponseModelImpl) then) =
      __$$TotalAmountResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({double total, String currency, ResponseMetadata metadata});

  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$TotalAmountResponseModelImplCopyWithImpl<$Res>
    extends _$TotalAmountResponseModelCopyWithImpl<$Res,
        _$TotalAmountResponseModelImpl>
    implements _$$TotalAmountResponseModelImplCopyWith<$Res> {
  __$$TotalAmountResponseModelImplCopyWithImpl(
      _$TotalAmountResponseModelImpl _value,
      $Res Function(_$TotalAmountResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of TotalAmountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? total = null,
    Object? currency = null,
    Object? metadata = null,
  }) {
    return _then(_$TotalAmountResponseModelImpl(
      total: null == total
          ? _value.total
          : total // ignore: cast_nullable_to_non_nullable
              as double,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TotalAmountResponseModelImpl implements _TotalAmountResponseModel {
  const _$TotalAmountResponseModelImpl(
      {required this.total, required this.currency, required this.metadata});

  factory _$TotalAmountResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$TotalAmountResponseModelImplFromJson(json);

  @override
  final double total;
  @override
  final String currency;
  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'TotalAmountResponseModel(total: $total, currency: $currency, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TotalAmountResponseModelImpl &&
            (identical(other.total, total) || other.total == total) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, total, currency, metadata);

  /// Create a copy of TotalAmountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TotalAmountResponseModelImplCopyWith<_$TotalAmountResponseModelImpl>
      get copyWith => __$$TotalAmountResponseModelImplCopyWithImpl<
          _$TotalAmountResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TotalAmountResponseModelImplToJson(
      this,
    );
  }
}

abstract class _TotalAmountResponseModel implements TotalAmountResponseModel {
  const factory _TotalAmountResponseModel(
          {required final double total,
          required final String currency,
          required final ResponseMetadata metadata}) =
      _$TotalAmountResponseModelImpl;

  factory _TotalAmountResponseModel.fromJson(Map<String, dynamic> json) =
      _$TotalAmountResponseModelImpl.fromJson;

  @override
  double get total;
  @override
  String get currency;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of TotalAmountResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TotalAmountResponseModelImplCopyWith<_$TotalAmountResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

TagsResponseModel _$TagsResponseModelFromJson(Map<String, dynamic> json) {
  return _TagsResponseModel.fromJson(json);
}

/// @nodoc
mixin _$TagsResponseModel {
  List<String> get tagIds => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this TagsResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TagsResponseModelCopyWith<TagsResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TagsResponseModelCopyWith<$Res> {
  factory $TagsResponseModelCopyWith(
          TagsResponseModel value, $Res Function(TagsResponseModel) then) =
      _$TagsResponseModelCopyWithImpl<$Res, TagsResponseModel>;
  @useResult
  $Res call({List<String> tagIds, ResponseMetadata metadata});

  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$TagsResponseModelCopyWithImpl<$Res, $Val extends TagsResponseModel>
    implements $TagsResponseModelCopyWith<$Res> {
  _$TagsResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? tagIds = null,
    Object? metadata = null,
  }) {
    return _then(_value.copyWith(
      tagIds: null == tagIds
          ? _value.tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of TagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ResponseMetadataCopyWith<$Res> get metadata {
    return $ResponseMetadataCopyWith<$Res>(_value.metadata, (value) {
      return _then(_value.copyWith(metadata: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$TagsResponseModelImplCopyWith<$Res>
    implements $TagsResponseModelCopyWith<$Res> {
  factory _$$TagsResponseModelImplCopyWith(_$TagsResponseModelImpl value,
          $Res Function(_$TagsResponseModelImpl) then) =
      __$$TagsResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({List<String> tagIds, ResponseMetadata metadata});

  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$TagsResponseModelImplCopyWithImpl<$Res>
    extends _$TagsResponseModelCopyWithImpl<$Res, _$TagsResponseModelImpl>
    implements _$$TagsResponseModelImplCopyWith<$Res> {
  __$$TagsResponseModelImplCopyWithImpl(_$TagsResponseModelImpl _value,
      $Res Function(_$TagsResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of TagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? tagIds = null,
    Object? metadata = null,
  }) {
    return _then(_$TagsResponseModelImpl(
      tagIds: null == tagIds
          ? _value._tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TagsResponseModelImpl implements _TagsResponseModel {
  const _$TagsResponseModelImpl(
      {required final List<String> tagIds, required this.metadata})
      : _tagIds = tagIds;

  factory _$TagsResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$TagsResponseModelImplFromJson(json);

  final List<String> _tagIds;
  @override
  List<String> get tagIds {
    if (_tagIds is EqualUnmodifiableListView) return _tagIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_tagIds);
  }

  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'TagsResponseModel(tagIds: $tagIds, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TagsResponseModelImpl &&
            const DeepCollectionEquality().equals(other._tagIds, _tagIds) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, const DeepCollectionEquality().hash(_tagIds), metadata);

  /// Create a copy of TagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TagsResponseModelImplCopyWith<_$TagsResponseModelImpl> get copyWith =>
      __$$TagsResponseModelImplCopyWithImpl<_$TagsResponseModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TagsResponseModelImplToJson(
      this,
    );
  }
}

abstract class _TagsResponseModel implements TagsResponseModel {
  const factory _TagsResponseModel(
      {required final List<String> tagIds,
      required final ResponseMetadata metadata}) = _$TagsResponseModelImpl;

  factory _TagsResponseModel.fromJson(Map<String, dynamic> json) =
      _$TagsResponseModelImpl.fromJson;

  @override
  List<String> get tagIds;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of TagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TagsResponseModelImplCopyWith<_$TagsResponseModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
