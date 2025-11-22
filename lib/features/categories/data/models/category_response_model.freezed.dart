// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'category_response_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GetCategoriesResponseModel _$GetCategoriesResponseModelFromJson(
    Map<String, dynamic> json) {
  return _GetCategoriesResponseModel.fromJson(json);
}

/// @nodoc
mixin _$GetCategoriesResponseModel {
  List<CategoryResponseData> get data => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this GetCategoriesResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetCategoriesResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetCategoriesResponseModelCopyWith<GetCategoriesResponseModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetCategoriesResponseModelCopyWith<$Res> {
  factory $GetCategoriesResponseModelCopyWith(GetCategoriesResponseModel value,
          $Res Function(GetCategoriesResponseModel) then) =
      _$GetCategoriesResponseModelCopyWithImpl<$Res,
          GetCategoriesResponseModel>;
  @useResult
  $Res call({List<CategoryResponseData> data, ResponseMetadata metadata});

  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$GetCategoriesResponseModelCopyWithImpl<$Res,
        $Val extends GetCategoriesResponseModel>
    implements $GetCategoriesResponseModelCopyWith<$Res> {
  _$GetCategoriesResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetCategoriesResponseModel
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
              as List<CategoryResponseData>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of GetCategoriesResponseModel
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
abstract class _$$GetCategoriesResponseModelImplCopyWith<$Res>
    implements $GetCategoriesResponseModelCopyWith<$Res> {
  factory _$$GetCategoriesResponseModelImplCopyWith(
          _$GetCategoriesResponseModelImpl value,
          $Res Function(_$GetCategoriesResponseModelImpl) then) =
      __$$GetCategoriesResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({List<CategoryResponseData> data, ResponseMetadata metadata});

  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$GetCategoriesResponseModelImplCopyWithImpl<$Res>
    extends _$GetCategoriesResponseModelCopyWithImpl<$Res,
        _$GetCategoriesResponseModelImpl>
    implements _$$GetCategoriesResponseModelImplCopyWith<$Res> {
  __$$GetCategoriesResponseModelImplCopyWithImpl(
      _$GetCategoriesResponseModelImpl _value,
      $Res Function(_$GetCategoriesResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetCategoriesResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = null,
    Object? metadata = null,
  }) {
    return _then(_$GetCategoriesResponseModelImpl(
      data: null == data
          ? _value._data
          : data // ignore: cast_nullable_to_non_nullable
              as List<CategoryResponseData>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetCategoriesResponseModelImpl implements _GetCategoriesResponseModel {
  const _$GetCategoriesResponseModelImpl(
      {required final List<CategoryResponseData> data, required this.metadata})
      : _data = data;

  factory _$GetCategoriesResponseModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetCategoriesResponseModelImplFromJson(json);

  final List<CategoryResponseData> _data;
  @override
  List<CategoryResponseData> get data {
    if (_data is EqualUnmodifiableListView) return _data;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_data);
  }

  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'GetCategoriesResponseModel(data: $data, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetCategoriesResponseModelImpl &&
            const DeepCollectionEquality().equals(other._data, _data) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, const DeepCollectionEquality().hash(_data), metadata);

  /// Create a copy of GetCategoriesResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetCategoriesResponseModelImplCopyWith<_$GetCategoriesResponseModelImpl>
      get copyWith => __$$GetCategoriesResponseModelImplCopyWithImpl<
          _$GetCategoriesResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetCategoriesResponseModelImplToJson(
      this,
    );
  }
}

abstract class _GetCategoriesResponseModel
    implements GetCategoriesResponseModel {
  const factory _GetCategoriesResponseModel(
          {required final List<CategoryResponseData> data,
          required final ResponseMetadata metadata}) =
      _$GetCategoriesResponseModelImpl;

  factory _GetCategoriesResponseModel.fromJson(Map<String, dynamic> json) =
      _$GetCategoriesResponseModelImpl.fromJson;

  @override
  List<CategoryResponseData> get data;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of GetCategoriesResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetCategoriesResponseModelImplCopyWith<_$GetCategoriesResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetCategoryResponseModel _$GetCategoryResponseModelFromJson(
    Map<String, dynamic> json) {
  return _GetCategoryResponseModel.fromJson(json);
}

/// @nodoc
mixin _$GetCategoryResponseModel {
  CategoryResponseData? get data => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this GetCategoryResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetCategoryResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetCategoryResponseModelCopyWith<GetCategoryResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetCategoryResponseModelCopyWith<$Res> {
  factory $GetCategoryResponseModelCopyWith(GetCategoryResponseModel value,
          $Res Function(GetCategoryResponseModel) then) =
      _$GetCategoryResponseModelCopyWithImpl<$Res, GetCategoryResponseModel>;
  @useResult
  $Res call({CategoryResponseData? data, ResponseMetadata metadata});

  $CategoryResponseDataCopyWith<$Res>? get data;
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$GetCategoryResponseModelCopyWithImpl<$Res,
        $Val extends GetCategoryResponseModel>
    implements $GetCategoryResponseModelCopyWith<$Res> {
  _$GetCategoryResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetCategoryResponseModel
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
              as CategoryResponseData?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of GetCategoryResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $CategoryResponseDataCopyWith<$Res>? get data {
    if (_value.data == null) {
      return null;
    }

    return $CategoryResponseDataCopyWith<$Res>(_value.data!, (value) {
      return _then(_value.copyWith(data: value) as $Val);
    });
  }

  /// Create a copy of GetCategoryResponseModel
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
abstract class _$$GetCategoryResponseModelImplCopyWith<$Res>
    implements $GetCategoryResponseModelCopyWith<$Res> {
  factory _$$GetCategoryResponseModelImplCopyWith(
          _$GetCategoryResponseModelImpl value,
          $Res Function(_$GetCategoryResponseModelImpl) then) =
      __$$GetCategoryResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({CategoryResponseData? data, ResponseMetadata metadata});

  @override
  $CategoryResponseDataCopyWith<$Res>? get data;
  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$GetCategoryResponseModelImplCopyWithImpl<$Res>
    extends _$GetCategoryResponseModelCopyWithImpl<$Res,
        _$GetCategoryResponseModelImpl>
    implements _$$GetCategoryResponseModelImplCopyWith<$Res> {
  __$$GetCategoryResponseModelImplCopyWithImpl(
      _$GetCategoryResponseModelImpl _value,
      $Res Function(_$GetCategoryResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetCategoryResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = freezed,
    Object? metadata = null,
  }) {
    return _then(_$GetCategoryResponseModelImpl(
      data: freezed == data
          ? _value.data
          : data // ignore: cast_nullable_to_non_nullable
              as CategoryResponseData?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetCategoryResponseModelImpl implements _GetCategoryResponseModel {
  const _$GetCategoryResponseModelImpl(
      {required this.data, required this.metadata});

  factory _$GetCategoryResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GetCategoryResponseModelImplFromJson(json);

  @override
  final CategoryResponseData? data;
  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'GetCategoryResponseModel(data: $data, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetCategoryResponseModelImpl &&
            (identical(other.data, data) || other.data == data) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, data, metadata);

  /// Create a copy of GetCategoryResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetCategoryResponseModelImplCopyWith<_$GetCategoryResponseModelImpl>
      get copyWith => __$$GetCategoryResponseModelImplCopyWithImpl<
          _$GetCategoryResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetCategoryResponseModelImplToJson(
      this,
    );
  }
}

abstract class _GetCategoryResponseModel implements GetCategoryResponseModel {
  const factory _GetCategoryResponseModel(
          {required final CategoryResponseData? data,
          required final ResponseMetadata metadata}) =
      _$GetCategoryResponseModelImpl;

  factory _GetCategoryResponseModel.fromJson(Map<String, dynamic> json) =
      _$GetCategoryResponseModelImpl.fromJson;

  @override
  CategoryResponseData? get data;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of GetCategoryResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetCategoryResponseModelImplCopyWith<_$GetCategoryResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetHierarchyResponseModel _$GetHierarchyResponseModelFromJson(
    Map<String, dynamic> json) {
  return _GetHierarchyResponseModel.fromJson(json);
}

/// @nodoc
mixin _$GetHierarchyResponseModel {
  List<CategoryHierarchyData> get data => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this GetHierarchyResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetHierarchyResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetHierarchyResponseModelCopyWith<GetHierarchyResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetHierarchyResponseModelCopyWith<$Res> {
  factory $GetHierarchyResponseModelCopyWith(GetHierarchyResponseModel value,
          $Res Function(GetHierarchyResponseModel) then) =
      _$GetHierarchyResponseModelCopyWithImpl<$Res, GetHierarchyResponseModel>;
  @useResult
  $Res call({List<CategoryHierarchyData> data, ResponseMetadata metadata});

  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$GetHierarchyResponseModelCopyWithImpl<$Res,
        $Val extends GetHierarchyResponseModel>
    implements $GetHierarchyResponseModelCopyWith<$Res> {
  _$GetHierarchyResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetHierarchyResponseModel
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
              as List<CategoryHierarchyData>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of GetHierarchyResponseModel
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
abstract class _$$GetHierarchyResponseModelImplCopyWith<$Res>
    implements $GetHierarchyResponseModelCopyWith<$Res> {
  factory _$$GetHierarchyResponseModelImplCopyWith(
          _$GetHierarchyResponseModelImpl value,
          $Res Function(_$GetHierarchyResponseModelImpl) then) =
      __$$GetHierarchyResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({List<CategoryHierarchyData> data, ResponseMetadata metadata});

  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$GetHierarchyResponseModelImplCopyWithImpl<$Res>
    extends _$GetHierarchyResponseModelCopyWithImpl<$Res,
        _$GetHierarchyResponseModelImpl>
    implements _$$GetHierarchyResponseModelImplCopyWith<$Res> {
  __$$GetHierarchyResponseModelImplCopyWithImpl(
      _$GetHierarchyResponseModelImpl _value,
      $Res Function(_$GetHierarchyResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetHierarchyResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = null,
    Object? metadata = null,
  }) {
    return _then(_$GetHierarchyResponseModelImpl(
      data: null == data
          ? _value._data
          : data // ignore: cast_nullable_to_non_nullable
              as List<CategoryHierarchyData>,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetHierarchyResponseModelImpl implements _GetHierarchyResponseModel {
  const _$GetHierarchyResponseModelImpl(
      {required final List<CategoryHierarchyData> data, required this.metadata})
      : _data = data;

  factory _$GetHierarchyResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GetHierarchyResponseModelImplFromJson(json);

  final List<CategoryHierarchyData> _data;
  @override
  List<CategoryHierarchyData> get data {
    if (_data is EqualUnmodifiableListView) return _data;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_data);
  }

  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'GetHierarchyResponseModel(data: $data, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetHierarchyResponseModelImpl &&
            const DeepCollectionEquality().equals(other._data, _data) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, const DeepCollectionEquality().hash(_data), metadata);

  /// Create a copy of GetHierarchyResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetHierarchyResponseModelImplCopyWith<_$GetHierarchyResponseModelImpl>
      get copyWith => __$$GetHierarchyResponseModelImplCopyWithImpl<
          _$GetHierarchyResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetHierarchyResponseModelImplToJson(
      this,
    );
  }
}

abstract class _GetHierarchyResponseModel implements GetHierarchyResponseModel {
  const factory _GetHierarchyResponseModel(
          {required final List<CategoryHierarchyData> data,
          required final ResponseMetadata metadata}) =
      _$GetHierarchyResponseModelImpl;

  factory _GetHierarchyResponseModel.fromJson(Map<String, dynamic> json) =
      _$GetHierarchyResponseModelImpl.fromJson;

  @override
  List<CategoryHierarchyData> get data;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of GetHierarchyResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetHierarchyResponseModelImplCopyWith<_$GetHierarchyResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

CategoryResponseData _$CategoryResponseDataFromJson(Map<String, dynamic> json) {
  return _CategoryResponseData.fromJson(json);
}

/// @nodoc
mixin _$CategoryResponseData {
  String get id => throw _privateConstructorUsedError;
  String get profileId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  String? get icon => throw _privateConstructorUsedError;
  String? get parentId => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this CategoryResponseData to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CategoryResponseData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CategoryResponseDataCopyWith<CategoryResponseData> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CategoryResponseDataCopyWith<$Res> {
  factory $CategoryResponseDataCopyWith(CategoryResponseData value,
          $Res Function(CategoryResponseData) then) =
      _$CategoryResponseDataCopyWithImpl<$Res, CategoryResponseData>;
  @useResult
  $Res call(
      {String id,
      String profileId,
      String name,
      String? color,
      String? icon,
      String? parentId,
      int sortOrder,
      DateTime createdAt,
      DateTime updatedAt});
}

/// @nodoc
class _$CategoryResponseDataCopyWithImpl<$Res,
        $Val extends CategoryResponseData>
    implements $CategoryResponseDataCopyWith<$Res> {
  _$CategoryResponseDataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CategoryResponseData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? icon = freezed,
    Object? parentId = freezed,
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
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
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
abstract class _$$CategoryResponseDataImplCopyWith<$Res>
    implements $CategoryResponseDataCopyWith<$Res> {
  factory _$$CategoryResponseDataImplCopyWith(_$CategoryResponseDataImpl value,
          $Res Function(_$CategoryResponseDataImpl) then) =
      __$$CategoryResponseDataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String profileId,
      String name,
      String? color,
      String? icon,
      String? parentId,
      int sortOrder,
      DateTime createdAt,
      DateTime updatedAt});
}

/// @nodoc
class __$$CategoryResponseDataImplCopyWithImpl<$Res>
    extends _$CategoryResponseDataCopyWithImpl<$Res, _$CategoryResponseDataImpl>
    implements _$$CategoryResponseDataImplCopyWith<$Res> {
  __$$CategoryResponseDataImplCopyWithImpl(_$CategoryResponseDataImpl _value,
      $Res Function(_$CategoryResponseDataImpl) _then)
      : super(_value, _then);

  /// Create a copy of CategoryResponseData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? icon = freezed,
    Object? parentId = freezed,
    Object? sortOrder = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_$CategoryResponseDataImpl(
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
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
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
class _$CategoryResponseDataImpl implements _CategoryResponseData {
  const _$CategoryResponseDataImpl(
      {required this.id,
      required this.profileId,
      required this.name,
      this.color,
      this.icon,
      this.parentId,
      required this.sortOrder,
      required this.createdAt,
      required this.updatedAt});

  factory _$CategoryResponseDataImpl.fromJson(Map<String, dynamic> json) =>
      _$$CategoryResponseDataImplFromJson(json);

  @override
  final String id;
  @override
  final String profileId;
  @override
  final String name;
  @override
  final String? color;
  @override
  final String? icon;
  @override
  final String? parentId;
  @override
  final int sortOrder;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'CategoryResponseData(id: $id, profileId: $profileId, name: $name, color: $color, icon: $icon, parentId: $parentId, sortOrder: $sortOrder, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CategoryResponseDataImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.parentId, parentId) ||
                other.parentId == parentId) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, profileId, name, color, icon,
      parentId, sortOrder, createdAt, updatedAt);

  /// Create a copy of CategoryResponseData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CategoryResponseDataImplCopyWith<_$CategoryResponseDataImpl>
      get copyWith =>
          __$$CategoryResponseDataImplCopyWithImpl<_$CategoryResponseDataImpl>(
              this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CategoryResponseDataImplToJson(
      this,
    );
  }
}

abstract class _CategoryResponseData implements CategoryResponseData {
  const factory _CategoryResponseData(
      {required final String id,
      required final String profileId,
      required final String name,
      final String? color,
      final String? icon,
      final String? parentId,
      required final int sortOrder,
      required final DateTime createdAt,
      required final DateTime updatedAt}) = _$CategoryResponseDataImpl;

  factory _CategoryResponseData.fromJson(Map<String, dynamic> json) =
      _$CategoryResponseDataImpl.fromJson;

  @override
  String get id;
  @override
  String get profileId;
  @override
  String get name;
  @override
  String? get color;
  @override
  String? get icon;
  @override
  String? get parentId;
  @override
  int get sortOrder;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of CategoryResponseData
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CategoryResponseDataImplCopyWith<_$CategoryResponseDataImpl>
      get copyWith => throw _privateConstructorUsedError;
}

CategoryHierarchyData _$CategoryHierarchyDataFromJson(
    Map<String, dynamic> json) {
  return _CategoryHierarchyData.fromJson(json);
}

/// @nodoc
mixin _$CategoryHierarchyData {
  String get id => throw _privateConstructorUsedError;
  String get profileId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  String? get icon => throw _privateConstructorUsedError;
  String? get parentId => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;
  List<CategoryHierarchyData> get subcategories =>
      throw _privateConstructorUsedError;

  /// Serializes this CategoryHierarchyData to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CategoryHierarchyData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CategoryHierarchyDataCopyWith<CategoryHierarchyData> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CategoryHierarchyDataCopyWith<$Res> {
  factory $CategoryHierarchyDataCopyWith(CategoryHierarchyData value,
          $Res Function(CategoryHierarchyData) then) =
      _$CategoryHierarchyDataCopyWithImpl<$Res, CategoryHierarchyData>;
  @useResult
  $Res call(
      {String id,
      String profileId,
      String name,
      String? color,
      String? icon,
      String? parentId,
      int sortOrder,
      DateTime createdAt,
      DateTime updatedAt,
      List<CategoryHierarchyData> subcategories});
}

/// @nodoc
class _$CategoryHierarchyDataCopyWithImpl<$Res,
        $Val extends CategoryHierarchyData>
    implements $CategoryHierarchyDataCopyWith<$Res> {
  _$CategoryHierarchyDataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CategoryHierarchyData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? icon = freezed,
    Object? parentId = freezed,
    Object? sortOrder = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? subcategories = null,
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
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
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
      subcategories: null == subcategories
          ? _value.subcategories
          : subcategories // ignore: cast_nullable_to_non_nullable
              as List<CategoryHierarchyData>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CategoryHierarchyDataImplCopyWith<$Res>
    implements $CategoryHierarchyDataCopyWith<$Res> {
  factory _$$CategoryHierarchyDataImplCopyWith(
          _$CategoryHierarchyDataImpl value,
          $Res Function(_$CategoryHierarchyDataImpl) then) =
      __$$CategoryHierarchyDataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String profileId,
      String name,
      String? color,
      String? icon,
      String? parentId,
      int sortOrder,
      DateTime createdAt,
      DateTime updatedAt,
      List<CategoryHierarchyData> subcategories});
}

/// @nodoc
class __$$CategoryHierarchyDataImplCopyWithImpl<$Res>
    extends _$CategoryHierarchyDataCopyWithImpl<$Res,
        _$CategoryHierarchyDataImpl>
    implements _$$CategoryHierarchyDataImplCopyWith<$Res> {
  __$$CategoryHierarchyDataImplCopyWithImpl(_$CategoryHierarchyDataImpl _value,
      $Res Function(_$CategoryHierarchyDataImpl) _then)
      : super(_value, _then);

  /// Create a copy of CategoryHierarchyData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? icon = freezed,
    Object? parentId = freezed,
    Object? sortOrder = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? subcategories = null,
  }) {
    return _then(_$CategoryHierarchyDataImpl(
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
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
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
      subcategories: null == subcategories
          ? _value._subcategories
          : subcategories // ignore: cast_nullable_to_non_nullable
              as List<CategoryHierarchyData>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CategoryHierarchyDataImpl implements _CategoryHierarchyData {
  const _$CategoryHierarchyDataImpl(
      {required this.id,
      required this.profileId,
      required this.name,
      this.color,
      this.icon,
      this.parentId,
      required this.sortOrder,
      required this.createdAt,
      required this.updatedAt,
      final List<CategoryHierarchyData> subcategories = const []})
      : _subcategories = subcategories;

  factory _$CategoryHierarchyDataImpl.fromJson(Map<String, dynamic> json) =>
      _$$CategoryHierarchyDataImplFromJson(json);

  @override
  final String id;
  @override
  final String profileId;
  @override
  final String name;
  @override
  final String? color;
  @override
  final String? icon;
  @override
  final String? parentId;
  @override
  final int sortOrder;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;
  final List<CategoryHierarchyData> _subcategories;
  @override
  @JsonKey()
  List<CategoryHierarchyData> get subcategories {
    if (_subcategories is EqualUnmodifiableListView) return _subcategories;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_subcategories);
  }

  @override
  String toString() {
    return 'CategoryHierarchyData(id: $id, profileId: $profileId, name: $name, color: $color, icon: $icon, parentId: $parentId, sortOrder: $sortOrder, createdAt: $createdAt, updatedAt: $updatedAt, subcategories: $subcategories)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CategoryHierarchyDataImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.parentId, parentId) ||
                other.parentId == parentId) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            const DeepCollectionEquality()
                .equals(other._subcategories, _subcategories));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      profileId,
      name,
      color,
      icon,
      parentId,
      sortOrder,
      createdAt,
      updatedAt,
      const DeepCollectionEquality().hash(_subcategories));

  /// Create a copy of CategoryHierarchyData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CategoryHierarchyDataImplCopyWith<_$CategoryHierarchyDataImpl>
      get copyWith => __$$CategoryHierarchyDataImplCopyWithImpl<
          _$CategoryHierarchyDataImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CategoryHierarchyDataImplToJson(
      this,
    );
  }
}

abstract class _CategoryHierarchyData implements CategoryHierarchyData {
  const factory _CategoryHierarchyData(
          {required final String id,
          required final String profileId,
          required final String name,
          final String? color,
          final String? icon,
          final String? parentId,
          required final int sortOrder,
          required final DateTime createdAt,
          required final DateTime updatedAt,
          final List<CategoryHierarchyData> subcategories}) =
      _$CategoryHierarchyDataImpl;

  factory _CategoryHierarchyData.fromJson(Map<String, dynamic> json) =
      _$CategoryHierarchyDataImpl.fromJson;

  @override
  String get id;
  @override
  String get profileId;
  @override
  String get name;
  @override
  String? get color;
  @override
  String? get icon;
  @override
  String? get parentId;
  @override
  int get sortOrder;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  List<CategoryHierarchyData> get subcategories;

  /// Create a copy of CategoryHierarchyData
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CategoryHierarchyDataImplCopyWith<_$CategoryHierarchyDataImpl>
      get copyWith => throw _privateConstructorUsedError;
}

ValidateDepthResponseModel _$ValidateDepthResponseModelFromJson(
    Map<String, dynamic> json) {
  return _ValidateDepthResponseModel.fromJson(json);
}

/// @nodoc
mixin _$ValidateDepthResponseModel {
  bool get isValid => throw _privateConstructorUsedError;
  int get currentDepth => throw _privateConstructorUsedError;
  int get maxDepth => throw _privateConstructorUsedError;
  String? get message => throw _privateConstructorUsedError;
  ResponseMetadata get metadata => throw _privateConstructorUsedError;

  /// Serializes this ValidateDepthResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ValidateDepthResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ValidateDepthResponseModelCopyWith<ValidateDepthResponseModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ValidateDepthResponseModelCopyWith<$Res> {
  factory $ValidateDepthResponseModelCopyWith(ValidateDepthResponseModel value,
          $Res Function(ValidateDepthResponseModel) then) =
      _$ValidateDepthResponseModelCopyWithImpl<$Res,
          ValidateDepthResponseModel>;
  @useResult
  $Res call(
      {bool isValid,
      int currentDepth,
      int maxDepth,
      String? message,
      ResponseMetadata metadata});

  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class _$ValidateDepthResponseModelCopyWithImpl<$Res,
        $Val extends ValidateDepthResponseModel>
    implements $ValidateDepthResponseModelCopyWith<$Res> {
  _$ValidateDepthResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ValidateDepthResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? isValid = null,
    Object? currentDepth = null,
    Object? maxDepth = null,
    Object? message = freezed,
    Object? metadata = null,
  }) {
    return _then(_value.copyWith(
      isValid: null == isValid
          ? _value.isValid
          : isValid // ignore: cast_nullable_to_non_nullable
              as bool,
      currentDepth: null == currentDepth
          ? _value.currentDepth
          : currentDepth // ignore: cast_nullable_to_non_nullable
              as int,
      maxDepth: null == maxDepth
          ? _value.maxDepth
          : maxDepth // ignore: cast_nullable_to_non_nullable
              as int,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ) as $Val);
  }

  /// Create a copy of ValidateDepthResponseModel
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
abstract class _$$ValidateDepthResponseModelImplCopyWith<$Res>
    implements $ValidateDepthResponseModelCopyWith<$Res> {
  factory _$$ValidateDepthResponseModelImplCopyWith(
          _$ValidateDepthResponseModelImpl value,
          $Res Function(_$ValidateDepthResponseModelImpl) then) =
      __$$ValidateDepthResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {bool isValid,
      int currentDepth,
      int maxDepth,
      String? message,
      ResponseMetadata metadata});

  @override
  $ResponseMetadataCopyWith<$Res> get metadata;
}

/// @nodoc
class __$$ValidateDepthResponseModelImplCopyWithImpl<$Res>
    extends _$ValidateDepthResponseModelCopyWithImpl<$Res,
        _$ValidateDepthResponseModelImpl>
    implements _$$ValidateDepthResponseModelImplCopyWith<$Res> {
  __$$ValidateDepthResponseModelImplCopyWithImpl(
      _$ValidateDepthResponseModelImpl _value,
      $Res Function(_$ValidateDepthResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ValidateDepthResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? isValid = null,
    Object? currentDepth = null,
    Object? maxDepth = null,
    Object? message = freezed,
    Object? metadata = null,
  }) {
    return _then(_$ValidateDepthResponseModelImpl(
      isValid: null == isValid
          ? _value.isValid
          : isValid // ignore: cast_nullable_to_non_nullable
              as bool,
      currentDepth: null == currentDepth
          ? _value.currentDepth
          : currentDepth // ignore: cast_nullable_to_non_nullable
              as int,
      maxDepth: null == maxDepth
          ? _value.maxDepth
          : maxDepth // ignore: cast_nullable_to_non_nullable
              as int,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: null == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as ResponseMetadata,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ValidateDepthResponseModelImpl implements _ValidateDepthResponseModel {
  const _$ValidateDepthResponseModelImpl(
      {required this.isValid,
      required this.currentDepth,
      required this.maxDepth,
      this.message,
      required this.metadata});

  factory _$ValidateDepthResponseModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$ValidateDepthResponseModelImplFromJson(json);

  @override
  final bool isValid;
  @override
  final int currentDepth;
  @override
  final int maxDepth;
  @override
  final String? message;
  @override
  final ResponseMetadata metadata;

  @override
  String toString() {
    return 'ValidateDepthResponseModel(isValid: $isValid, currentDepth: $currentDepth, maxDepth: $maxDepth, message: $message, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ValidateDepthResponseModelImpl &&
            (identical(other.isValid, isValid) || other.isValid == isValid) &&
            (identical(other.currentDepth, currentDepth) ||
                other.currentDepth == currentDepth) &&
            (identical(other.maxDepth, maxDepth) ||
                other.maxDepth == maxDepth) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.metadata, metadata) ||
                other.metadata == metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, isValid, currentDepth, maxDepth, message, metadata);

  /// Create a copy of ValidateDepthResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ValidateDepthResponseModelImplCopyWith<_$ValidateDepthResponseModelImpl>
      get copyWith => __$$ValidateDepthResponseModelImplCopyWithImpl<
          _$ValidateDepthResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ValidateDepthResponseModelImplToJson(
      this,
    );
  }
}

abstract class _ValidateDepthResponseModel
    implements ValidateDepthResponseModel {
  const factory _ValidateDepthResponseModel(
          {required final bool isValid,
          required final int currentDepth,
          required final int maxDepth,
          final String? message,
          required final ResponseMetadata metadata}) =
      _$ValidateDepthResponseModelImpl;

  factory _ValidateDepthResponseModel.fromJson(Map<String, dynamic> json) =
      _$ValidateDepthResponseModelImpl.fromJson;

  @override
  bool get isValid;
  @override
  int get currentDepth;
  @override
  int get maxDepth;
  @override
  String? get message;
  @override
  ResponseMetadata get metadata;

  /// Create a copy of ValidateDepthResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ValidateDepthResponseModelImplCopyWith<_$ValidateDepthResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
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
