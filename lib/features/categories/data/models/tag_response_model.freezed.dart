// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'tag_response_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GetTagsResponseModel _$GetTagsResponseModelFromJson(Map<String, dynamic> json) {
  return _GetTagsResponseModel.fromJson(json);
}

/// @nodoc
mixin _$GetTagsResponseModel {
  List<TagResponseData> get data => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this GetTagsResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTagsResponseModelCopyWith<GetTagsResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTagsResponseModelCopyWith<$Res> {
  factory $GetTagsResponseModelCopyWith(GetTagsResponseModel value,
          $Res Function(GetTagsResponseModel) then) =
      _$GetTagsResponseModelCopyWithImpl<$Res, GetTagsResponseModel>;
  @useResult
  $Res call({List<TagResponseData> data, ResponseMetadata metadata});

  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$GetTagsResponseModelCopyWithImpl<$Res,
        $Val extends GetTagsResponseModel>
    implements $GetTagsResponseModelCopyWith<$Res> {
  _$GetTagsResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = null,
    Object? metadata = null,
  }) {
    return _then(_value.copyWith(
      data: null == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as List<TagResponseData>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of GetTagsResponseModel
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
abstract class _$$GetTagsResponseModelImplCopyWith<$Res>
    implements $GetTagsResponseModelCopyWith<$Res> {
  factory _$$GetTagsResponseModelImplCopyWith(_$GetTagsResponseModelImpl value,
          $Res Function(_$GetTagsResponseModelImpl) then) =
      __$$GetTagsResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({List<TagResponseData> data, ResponseMetadata metadata});

  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$GetTagsResponseModelImplCopyWithImpl<$Res>
    extends _$GetTagsResponseModelCopyWithImpl<$Res, _$GetTagsResponseModelImpl>
    implements _$$GetTagsResponseModelImplCopyWith<$Res> {
  __$$GetTagsResponseModelImplCopyWithImpl(_$GetTagsResponseModelImpl _value,
      $Res Function(_$GetTagsResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = null,
    Object? metadata = null,
  }) {
    return _then(_$GetTagsResponseModelImpl(
      data: null == data
          ? _value._data
          : data // ignore: cast_nullable_to_non_nullable
              as List<TagResponseData>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTagsResponseModelImpl implements _GetTagsResponseModel {
  const _$GetTagsResponseModelImpl(
      {required final List<TagResponseData> data, required this.metadata})
      : _data = data;

  factory _$GetTagsResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GetTagsResponseModelImplFromJson(json);

  final List<TagResponseData> _data;
  @override
  List<TagResponseData> get data {
    if (_data is EqualUnmodifiableListView) return _data;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_data);
  }

  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'GetTagsResponseModel(data: $data, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTagsResponseModelImpl &&
            const DeepCollectionEquality().equals(other._data, _data) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, const DeepCollectionEquality().hash(_data), metadata);

  /// Create a copy of GetTagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTagsResponseModelImplCopyWith<_$GetTagsResponseModelImpl>
      get copyWith =>
          __$$GetTagsResponseModelImplCopyWithImpl<_$GetTagsResponseModelImpl>(
              this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTagsResponseModelImplToJson(
      this,
    );
  }
}

abstract class _GetTagsResponseModel implements GetTagsResponseModel {
  const factory _GetTagsResponseModel(
      {required final List<TagResponseData> data,
      required final ResponseMetadata metadata}) = _$GetTagsResponseModelImpl;

  factory _GetTagsResponseModel.fromJson(Map<String, dynamic> json) =
      _$GetTagsResponseModelImpl.fromJson;

  @override
  List<TagResponseData> get data;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of GetTagsResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTagsResponseModelImplCopyWith<_$GetTagsResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTagResponseModel _$GetTagResponseModelFromJson(Map<String, dynamic> json) {
  return _GetTagResponseModel.fromJson(json);
}

/// @nodoc
mixin _$GetTagResponseModel {
  TagResponseData? get data => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this GetTagResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTagResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTagResponseModelCopyWith<GetTagResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTagResponseModelCopyWith<$Res> {
  factory $GetTagResponseModelCopyWith(
          GetTagResponseModel value, $Res Function(GetTagResponseModel) then) =
      _$GetTagResponseModelCopyWithImpl<$Res, GetTagResponseModel>;
  @useResult
  $Res call({TagResponseData? data, ResponseMetadata metadata});

  $TagResponseDataCopyWith<$Res>? get data;
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$GetTagResponseModelCopyWithImpl<$Res, $Val extends GetTagResponseModel>
    implements $GetTagResponseModelCopyWith<$Res> {
  _$GetTagResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTagResponseModel
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
              as TagResponseData?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of GetTagResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $TagResponseDataCopyWith<$Res>? get data {
    if (_value.data == null) {
      return null;
    }

    return $TagResponseDataCopyWith<$Res>(_value.data!, (value) {
      return _then(_value.copyWith(data: value) as $Val);
    });
  }

  /// Create a copy of GetTagResponseModel
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
abstract class _$$GetTagResponseModelImplCopyWith<$Res>
    implements $GetTagResponseModelCopyWith<$Res> {
  factory _$$GetTagResponseModelImplCopyWith(_$GetTagResponseModelImpl value,
          $Res Function(_$GetTagResponseModelImpl) then) =
      __$$GetTagResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({TagResponseData? data, ResponseMetadata metadata});

  @override
  $TagResponseDataCopyWith<$Res>? get data;
  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$GetTagResponseModelImplCopyWithImpl<$Res>
    extends _$GetTagResponseModelCopyWithImpl<$Res, _$GetTagResponseModelImpl>
    implements _$$GetTagResponseModelImplCopyWith<$Res> {
  __$$GetTagResponseModelImplCopyWithImpl(_$GetTagResponseModelImpl _value,
      $Res Function(_$GetTagResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTagResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = freezed,
    Object? metadata = null,
  }) {
    return _then(_$GetTagResponseModelImpl(
      data: freezed == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as TagResponseData?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTagResponseModelImpl implements _GetTagResponseModel {
  const _$GetTagResponseModelImpl({required this.data, required this.metadata});

  factory _$GetTagResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GetTagResponseModelImplFromJson(json);

  @override
  final TagResponseData? data;
  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'GetTagResponseModel(data: $data, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTagResponseModelImpl &&
            (identical(other.data, data) || other.data == data) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, data, metadata);

  /// Create a copy of GetTagResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTagResponseModelImplCopyWith<_$GetTagResponseModelImpl> get copyWith =>
      __$$GetTagResponseModelImplCopyWithImpl<_$GetTagResponseModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTagResponseModelImplToJson(
      this,
    );
  }
}

abstract class _GetTagResponseModel implements GetTagResponseModel {
  const factory _GetTagResponseModel(
      {required final TagResponseData? data,
      required final ResponseMetadata metadata}) = _$GetTagResponseModelImpl;

  factory _GetTagResponseModel.fromJson(Map<String, dynamic> json) =
      _$GetTagResponseModelImpl.fromJson;

  @override
  TagResponseData? get data;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of GetTagResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTagResponseModelImplCopyWith<_$GetTagResponseModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TagResponseData _$TagResponseDataFromJson(Map<String, dynamic> json) {
  return _TagResponseData.fromJson(json);
}

/// @nodoc
mixin _$TagResponseData {
  String get id => throw _privateConstructorUsedError;
  String get profileId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this TagResponseData to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TagResponseData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TagResponseDataCopyWith<TagResponseData> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TagResponseDataCopyWith<$Res> {
  factory $TagResponseDataCopyWith(
          TagResponseData value, $Res Function(TagResponseData) then) =
      _$TagResponseDataCopyWithImpl<$Res, TagResponseData>;
  @useResult
  $Res call(
      {String id,
      String profileId,
      String name,
      String? color,
      int sortOrder,
      DateTime createdAt,
      DateTime updatedAt});
}

/// @nodoc
class _$TagResponseDataCopyWithImpl<$Res, $Val extends TagResponseData>
    implements $TagResponseDataCopyWith<$Res> {
  _$TagResponseDataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TagResponseData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? sortOrder = null,
    Object? createdAt = null,
    Object? updatedAt = null,
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
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      color: freezed == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String?,
      sortOrder: null == sortOrder
          ? _value.sortOrder
          : sortOrder // ignore: cast_nullable_to_non_nullable
              as int,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$TagResponseDataImplCopyWith<$Res>
    implements $TagResponseDataCopyWith<$Res> {
  factory _$$TagResponseDataImplCopyWith(_$TagResponseDataImpl value,
          $Res Function(_$TagResponseDataImpl) then) =
      __$$TagResponseDataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String profileId,
      String name,
      String? color,
      int sortOrder,
      DateTime createdAt,
      DateTime updatedAt});
}

/// @nodoc
class __$$TagResponseDataImplCopyWithImpl<$Res>
    extends _$TagResponseDataCopyWithImpl<$Res, _$TagResponseDataImpl>
    implements _$$TagResponseDataImplCopyWith<$Res> {
  __$$TagResponseDataImplCopyWithImpl(
      _$TagResponseDataImpl _value, $Res Function(_$TagResponseDataImpl) _then)
      : super(_value, _then);

  /// Create a copy of TagResponseData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? sortOrder = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_$TagResponseDataImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      color: freezed == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String?,
      sortOrder: null == sortOrder
          ? _value.sortOrder
          : sortOrder // ignore: cast_nullable_to_non_nullable
              as int,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TagResponseDataImpl implements _TagResponseData {
  const _$TagResponseDataImpl(
      {required this.id,
      required this.profileId,
      required this.name,
      this.color,
      required this.sortOrder,
      required this.createdAt,
      required this.updatedAt});

  factory _$TagResponseDataImpl.fromJson(Map<String, dynamic> json) =>
      _$$TagResponseDataImplFromJson(json);

  @override
  final String id;
  @override
  final String profileId;
  @override
  final String name;
  @override
  final String? color;
  @override
  final int sortOrder;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'TagResponseData(id: $id, profileId: $profileId, name: $name, color: $color, sortOrder: $sortOrder, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TagResponseDataImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, id, profileId, name, color, sortOrder, createdAt, updatedAt);

  /// Create a copy of TagResponseData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TagResponseDataImplCopyWith<_$TagResponseDataImpl> get copyWith =>
      __$$TagResponseDataImplCopyWithImpl<_$TagResponseDataImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TagResponseDataImplToJson(
      this,
    );
  }
}

abstract class _TagResponseData implements TagResponseData {
  const factory _TagResponseData(
      {required final String id,
      required final String profileId,
      required final String name,
      final String? color,
      required final int sortOrder,
      required final DateTime createdAt,
      required final DateTime updatedAt}) = _$TagResponseDataImpl;

  factory _TagResponseData.fromJson(Map<String, dynamic> json) =
      _$TagResponseDataImpl.fromJson;

  @override
  String get id;
  @override
  String get profileId;
  @override
  String get name;
  @override
  String? get color;
  @override
  int get sortOrder;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of TagResponseData
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TagResponseDataImplCopyWith<_$TagResponseDataImpl> get copyWith =>
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
