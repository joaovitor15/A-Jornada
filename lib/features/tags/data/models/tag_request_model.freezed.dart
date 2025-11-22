// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'tag_request_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GetTagsByProfileRequestModel _$GetTagsByProfileRequestModelFromJson(
    Map<String, dynamic> json) {
  return _GetTagsByProfileRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTagsByProfileRequestModel {
  String get profileId => throw _privateConstructorUsedError;

  /// Serializes this GetTagsByProfileRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTagsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTagsByProfileRequestModelCopyWith<GetTagsByProfileRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTagsByProfileRequestModelCopyWith<$Res> {
  factory $GetTagsByProfileRequestModelCopyWith(
          GetTagsByProfileRequestModel value,
          $Res Function(GetTagsByProfileRequestModel) then) =
      _$GetTagsByProfileRequestModelCopyWithImpl<$Res,
          GetTagsByProfileRequestModel>;
  @useResult
  $Res call({String profileId});
}

/// @nodoc
class _$GetTagsByProfileRequestModelCopyWithImpl<$Res,
        $Val extends GetTagsByProfileRequestModel>
    implements $GetTagsByProfileRequestModelCopyWith<$Res> {
  _$GetTagsByProfileRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTagsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTagsByProfileRequestModelImplCopyWith<$Res>
    implements $GetTagsByProfileRequestModelCopyWith<$Res> {
  factory _$$GetTagsByProfileRequestModelImplCopyWith(
          _$GetTagsByProfileRequestModelImpl value,
          $Res Function(_$GetTagsByProfileRequestModelImpl) then) =
      __$$GetTagsByProfileRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId});
}

/// @nodoc
class __$$GetTagsByProfileRequestModelImplCopyWithImpl<$Res>
    extends _$GetTagsByProfileRequestModelCopyWithImpl<$Res,
        _$GetTagsByProfileRequestModelImpl>
    implements _$$GetTagsByProfileRequestModelImplCopyWith<$Res> {
  __$$GetTagsByProfileRequestModelImplCopyWithImpl(
      _$GetTagsByProfileRequestModelImpl _value,
      $Res Function(_$GetTagsByProfileRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTagsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
  }) {
    return _then(_$GetTagsByProfileRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTagsByProfileRequestModelImpl
    implements _GetTagsByProfileRequestModel {
  const _$GetTagsByProfileRequestModelImpl({required this.profileId});

  factory _$GetTagsByProfileRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTagsByProfileRequestModelImplFromJson(json);

  @override
  final String profileId;

  @override
  String toString() {
    return 'GetTagsByProfileRequestModel(profileId: $profileId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTagsByProfileRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId);

  /// Create a copy of GetTagsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTagsByProfileRequestModelImplCopyWith<
          _$GetTagsByProfileRequestModelImpl>
      get copyWith => __$$GetTagsByProfileRequestModelImplCopyWithImpl<
          _$GetTagsByProfileRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTagsByProfileRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTagsByProfileRequestModel
    implements GetTagsByProfileRequestModel {
  const factory _GetTagsByProfileRequestModel(
      {required final String profileId}) = _$GetTagsByProfileRequestModelImpl;

  factory _GetTagsByProfileRequestModel.fromJson(Map<String, dynamic> json) =
      _$GetTagsByProfileRequestModelImpl.fromJson;

  @override
  String get profileId;

  /// Create a copy of GetTagsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTagsByProfileRequestModelImplCopyWith<
          _$GetTagsByProfileRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTagByIdRequestModel _$GetTagByIdRequestModelFromJson(
    Map<String, dynamic> json) {
  return _GetTagByIdRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTagByIdRequestModel {
  String get tagId => throw _privateConstructorUsedError;

  /// Serializes this GetTagByIdRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTagByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTagByIdRequestModelCopyWith<GetTagByIdRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTagByIdRequestModelCopyWith<$Res> {
  factory $GetTagByIdRequestModelCopyWith(GetTagByIdRequestModel value,
          $Res Function(GetTagByIdRequestModel) then) =
      _$GetTagByIdRequestModelCopyWithImpl<$Res, GetTagByIdRequestModel>;
  @useResult
  $Res call({String tagId});
}

/// @nodoc
class _$GetTagByIdRequestModelCopyWithImpl<$Res,
        $Val extends GetTagByIdRequestModel>
    implements $GetTagByIdRequestModelCopyWith<$Res> {
  _$GetTagByIdRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTagByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? tagId = null,
  }) {
    return _then(_value.copyWith(
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTagByIdRequestModelImplCopyWith<$Res>
    implements $GetTagByIdRequestModelCopyWith<$Res> {
  factory _$$GetTagByIdRequestModelImplCopyWith(
          _$GetTagByIdRequestModelImpl value,
          $Res Function(_$GetTagByIdRequestModelImpl) then) =
      __$$GetTagByIdRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String tagId});
}

/// @nodoc
class __$$GetTagByIdRequestModelImplCopyWithImpl<$Res>
    extends _$GetTagByIdRequestModelCopyWithImpl<$Res,
        _$GetTagByIdRequestModelImpl>
    implements _$$GetTagByIdRequestModelImplCopyWith<$Res> {
  __$$GetTagByIdRequestModelImplCopyWithImpl(
      _$GetTagByIdRequestModelImpl _value,
      $Res Function(_$GetTagByIdRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTagByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? tagId = null,
  }) {
    return _then(_$GetTagByIdRequestModelImpl(
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTagByIdRequestModelImpl implements _GetTagByIdRequestModel {
  const _$GetTagByIdRequestModelImpl({required this.tagId});

  factory _$GetTagByIdRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GetTagByIdRequestModelImplFromJson(json);

  @override
  final String tagId;

  @override
  String toString() {
    return 'GetTagByIdRequestModel(tagId: $tagId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTagByIdRequestModelImpl &&
            (identical(other.tagId, tagId) || other.tagId == tagId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, tagId);

  /// Create a copy of GetTagByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTagByIdRequestModelImplCopyWith<_$GetTagByIdRequestModelImpl>
      get copyWith => __$$GetTagByIdRequestModelImplCopyWithImpl<
          _$GetTagByIdRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTagByIdRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTagByIdRequestModel implements GetTagByIdRequestModel {
  const factory _GetTagByIdRequestModel({required final String tagId}) =
      _$GetTagByIdRequestModelImpl;

  factory _GetTagByIdRequestModel.fromJson(Map<String, dynamic> json) =
      _$GetTagByIdRequestModelImpl.fromJson;

  @override
  String get tagId;

  /// Create a copy of GetTagByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTagByIdRequestModelImplCopyWith<_$GetTagByIdRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

SearchTagsByNameRequestModel _$SearchTagsByNameRequestModelFromJson(
    Map<String, dynamic> json) {
  return _SearchTagsByNameRequestModel.fromJson(json);
}

/// @nodoc
mixin _$SearchTagsByNameRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  String get searchText => throw _privateConstructorUsedError;

  /// Serializes this SearchTagsByNameRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of SearchTagsByNameRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SearchTagsByNameRequestModelCopyWith<SearchTagsByNameRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SearchTagsByNameRequestModelCopyWith<$Res> {
  factory $SearchTagsByNameRequestModelCopyWith(
          SearchTagsByNameRequestModel value,
          $Res Function(SearchTagsByNameRequestModel) then) =
      _$SearchTagsByNameRequestModelCopyWithImpl<$Res,
          SearchTagsByNameRequestModel>;
  @useResult
  $Res call({String profileId, String searchText});
}

/// @nodoc
class _$SearchTagsByNameRequestModelCopyWithImpl<$Res,
        $Val extends SearchTagsByNameRequestModel>
    implements $SearchTagsByNameRequestModelCopyWith<$Res> {
  _$SearchTagsByNameRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SearchTagsByNameRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? searchText = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      searchText: null == searchText
          ? _value.searchText
          : searchText // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SearchTagsByNameRequestModelImplCopyWith<$Res>
    implements $SearchTagsByNameRequestModelCopyWith<$Res> {
  factory _$$SearchTagsByNameRequestModelImplCopyWith(
          _$SearchTagsByNameRequestModelImpl value,
          $Res Function(_$SearchTagsByNameRequestModelImpl) then) =
      __$$SearchTagsByNameRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId, String searchText});
}

/// @nodoc
class __$$SearchTagsByNameRequestModelImplCopyWithImpl<$Res>
    extends _$SearchTagsByNameRequestModelCopyWithImpl<$Res,
        _$SearchTagsByNameRequestModelImpl>
    implements _$$SearchTagsByNameRequestModelImplCopyWith<$Res> {
  __$$SearchTagsByNameRequestModelImplCopyWithImpl(
      _$SearchTagsByNameRequestModelImpl _value,
      $Res Function(_$SearchTagsByNameRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of SearchTagsByNameRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? searchText = null,
  }) {
    return _then(_$SearchTagsByNameRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      searchText: null == searchText
          ? _value.searchText
          : searchText // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$SearchTagsByNameRequestModelImpl
    implements _SearchTagsByNameRequestModel {
  const _$SearchTagsByNameRequestModelImpl(
      {required this.profileId, required this.searchText});

  factory _$SearchTagsByNameRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$SearchTagsByNameRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  final String searchText;

  @override
  String toString() {
    return 'SearchTagsByNameRequestModel(profileId: $profileId, searchText: $searchText)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SearchTagsByNameRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.searchText, searchText) ||
                other.searchText == searchText));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId, searchText);

  /// Create a copy of SearchTagsByNameRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SearchTagsByNameRequestModelImplCopyWith<
          _$SearchTagsByNameRequestModelImpl>
      get copyWith => __$$SearchTagsByNameRequestModelImplCopyWithImpl<
          _$SearchTagsByNameRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SearchTagsByNameRequestModelImplToJson(
      this,
    );
  }
}

abstract class _SearchTagsByNameRequestModel
    implements SearchTagsByNameRequestModel {
  const factory _SearchTagsByNameRequestModel(
      {required final String profileId,
      required final String searchText}) = _$SearchTagsByNameRequestModelImpl;

  factory _SearchTagsByNameRequestModel.fromJson(Map<String, dynamic> json) =
      _$SearchTagsByNameRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  String get searchText;

  /// Create a copy of SearchTagsByNameRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SearchTagsByNameRequestModelImplCopyWith<
          _$SearchTagsByNameRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

CreateTagRequestModel _$CreateTagRequestModelFromJson(
    Map<String, dynamic> json) {
  return _CreateTagRequestModel.fromJson(json);
}

/// @nodoc
mixin _$CreateTagRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;

  /// Serializes this CreateTagRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateTagRequestModelCopyWith<CreateTagRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateTagRequestModelCopyWith<$Res> {
  factory $CreateTagRequestModelCopyWith(CreateTagRequestModel value,
          $Res Function(CreateTagRequestModel) then) =
      _$CreateTagRequestModelCopyWithImpl<$Res, CreateTagRequestModel>;
  @useResult
  $Res call({String profileId, String name, String? color, int sortOrder});
}

/// @nodoc
class _$CreateTagRequestModelCopyWithImpl<$Res,
        $Val extends CreateTagRequestModel>
    implements $CreateTagRequestModelCopyWith<$Res> {
  _$CreateTagRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? sortOrder = null,
  }) {
    return _then(_value.copyWith(
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
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CreateTagRequestModelImplCopyWith<$Res>
    implements $CreateTagRequestModelCopyWith<$Res> {
  factory _$$CreateTagRequestModelImplCopyWith(
          _$CreateTagRequestModelImpl value,
          $Res Function(_$CreateTagRequestModelImpl) then) =
      __$$CreateTagRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId, String name, String? color, int sortOrder});
}

/// @nodoc
class __$$CreateTagRequestModelImplCopyWithImpl<$Res>
    extends _$CreateTagRequestModelCopyWithImpl<$Res,
        _$CreateTagRequestModelImpl>
    implements _$$CreateTagRequestModelImplCopyWith<$Res> {
  __$$CreateTagRequestModelImplCopyWithImpl(_$CreateTagRequestModelImpl _value,
      $Res Function(_$CreateTagRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CreateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? name = null,
    Object? color = freezed,
    Object? sortOrder = null,
  }) {
    return _then(_$CreateTagRequestModelImpl(
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
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateTagRequestModelImpl implements _CreateTagRequestModel {
  const _$CreateTagRequestModelImpl(
      {required this.profileId,
      required this.name,
      this.color,
      this.sortOrder = 0});

  factory _$CreateTagRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateTagRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  final String name;
  @override
  final String? color;
  @override
  @JsonKey()
  final int sortOrder;

  @override
  String toString() {
    return 'CreateTagRequestModel(profileId: $profileId, name: $name, color: $color, sortOrder: $sortOrder)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateTagRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, profileId, name, color, sortOrder);

  /// Create a copy of CreateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateTagRequestModelImplCopyWith<_$CreateTagRequestModelImpl>
      get copyWith => __$$CreateTagRequestModelImplCopyWithImpl<
          _$CreateTagRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateTagRequestModelImplToJson(
      this,
    );
  }
}

abstract class _CreateTagRequestModel implements CreateTagRequestModel {
  const factory _CreateTagRequestModel(
      {required final String profileId,
      required final String name,
      final String? color,
      final int sortOrder}) = _$CreateTagRequestModelImpl;

  factory _CreateTagRequestModel.fromJson(Map<String, dynamic> json) =
      _$CreateTagRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  String get name;
  @override
  String? get color;
  @override
  int get sortOrder;

  /// Create a copy of CreateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateTagRequestModelImplCopyWith<_$CreateTagRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

UpdateTagRequestModel _$UpdateTagRequestModelFromJson(
    Map<String, dynamic> json) {
  return _UpdateTagRequestModel.fromJson(json);
}

/// @nodoc
mixin _$UpdateTagRequestModel {
  String get id => throw _privateConstructorUsedError;
  String? get name => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  int? get sortOrder => throw _privateConstructorUsedError;

  /// Serializes this UpdateTagRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdateTagRequestModelCopyWith<UpdateTagRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdateTagRequestModelCopyWith<$Res> {
  factory $UpdateTagRequestModelCopyWith(UpdateTagRequestModel value,
          $Res Function(UpdateTagRequestModel) then) =
      _$UpdateTagRequestModelCopyWithImpl<$Res, UpdateTagRequestModel>;
  @useResult
  $Res call({String id, String? name, String? color, int? sortOrder});
}

/// @nodoc
class _$UpdateTagRequestModelCopyWithImpl<$Res,
        $Val extends UpdateTagRequestModel>
    implements $UpdateTagRequestModelCopyWith<$Res> {
  _$UpdateTagRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = freezed,
    Object? color = freezed,
    Object? sortOrder = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: freezed == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String?,
      color: freezed == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String?,
      sortOrder: freezed == sortOrder
          ? _value.sortOrder
          : sortOrder // ignore: cast_nullable_to_non_nullable
              as int?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$UpdateTagRequestModelImplCopyWith<$Res>
    implements $UpdateTagRequestModelCopyWith<$Res> {
  factory _$$UpdateTagRequestModelImplCopyWith(
          _$UpdateTagRequestModelImpl value,
          $Res Function(_$UpdateTagRequestModelImpl) then) =
      __$$UpdateTagRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String? name, String? color, int? sortOrder});
}

/// @nodoc
class __$$UpdateTagRequestModelImplCopyWithImpl<$Res>
    extends _$UpdateTagRequestModelCopyWithImpl<$Res,
        _$UpdateTagRequestModelImpl>
    implements _$$UpdateTagRequestModelImplCopyWith<$Res> {
  __$$UpdateTagRequestModelImplCopyWithImpl(_$UpdateTagRequestModelImpl _value,
      $Res Function(_$UpdateTagRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of UpdateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = freezed,
    Object? color = freezed,
    Object? sortOrder = freezed,
  }) {
    return _then(_$UpdateTagRequestModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: freezed == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String?,
      color: freezed == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String?,
      sortOrder: freezed == sortOrder
          ? _value.sortOrder
          : sortOrder // ignore: cast_nullable_to_non_nullable
              as int?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UpdateTagRequestModelImpl implements _UpdateTagRequestModel {
  const _$UpdateTagRequestModelImpl(
      {required this.id, this.name, this.color, this.sortOrder});

  factory _$UpdateTagRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$UpdateTagRequestModelImplFromJson(json);

  @override
  final String id;
  @override
  final String? name;
  @override
  final String? color;
  @override
  final int? sortOrder;

  @override
  String toString() {
    return 'UpdateTagRequestModel(id: $id, name: $name, color: $color, sortOrder: $sortOrder)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateTagRequestModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, color, sortOrder);

  /// Create a copy of UpdateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateTagRequestModelImplCopyWith<_$UpdateTagRequestModelImpl>
      get copyWith => __$$UpdateTagRequestModelImplCopyWithImpl<
          _$UpdateTagRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdateTagRequestModelImplToJson(
      this,
    );
  }
}

abstract class _UpdateTagRequestModel implements UpdateTagRequestModel {
  const factory _UpdateTagRequestModel(
      {required final String id,
      final String? name,
      final String? color,
      final int? sortOrder}) = _$UpdateTagRequestModelImpl;

  factory _UpdateTagRequestModel.fromJson(Map<String, dynamic> json) =
      _$UpdateTagRequestModelImpl.fromJson;

  @override
  String get id;
  @override
  String? get name;
  @override
  String? get color;
  @override
  int? get sortOrder;

  /// Create a copy of UpdateTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdateTagRequestModelImplCopyWith<_$UpdateTagRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

DeleteTagRequestModel _$DeleteTagRequestModelFromJson(
    Map<String, dynamic> json) {
  return _DeleteTagRequestModel.fromJson(json);
}

/// @nodoc
mixin _$DeleteTagRequestModel {
  String get tagId => throw _privateConstructorUsedError;

  /// Serializes this DeleteTagRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DeleteTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DeleteTagRequestModelCopyWith<DeleteTagRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeleteTagRequestModelCopyWith<$Res> {
  factory $DeleteTagRequestModelCopyWith(DeleteTagRequestModel value,
          $Res Function(DeleteTagRequestModel) then) =
      _$DeleteTagRequestModelCopyWithImpl<$Res, DeleteTagRequestModel>;
  @useResult
  $Res call({String tagId});
}

/// @nodoc
class _$DeleteTagRequestModelCopyWithImpl<$Res,
        $Val extends DeleteTagRequestModel>
    implements $DeleteTagRequestModelCopyWith<$Res> {
  _$DeleteTagRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DeleteTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? tagId = null,
  }) {
    return _then(_value.copyWith(
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$DeleteTagRequestModelImplCopyWith<$Res>
    implements $DeleteTagRequestModelCopyWith<$Res> {
  factory _$$DeleteTagRequestModelImplCopyWith(
          _$DeleteTagRequestModelImpl value,
          $Res Function(_$DeleteTagRequestModelImpl) then) =
      __$$DeleteTagRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String tagId});
}

/// @nodoc
class __$$DeleteTagRequestModelImplCopyWithImpl<$Res>
    extends _$DeleteTagRequestModelCopyWithImpl<$Res,
        _$DeleteTagRequestModelImpl>
    implements _$$DeleteTagRequestModelImplCopyWith<$Res> {
  __$$DeleteTagRequestModelImplCopyWithImpl(_$DeleteTagRequestModelImpl _value,
      $Res Function(_$DeleteTagRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of DeleteTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? tagId = null,
  }) {
    return _then(_$DeleteTagRequestModelImpl(
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DeleteTagRequestModelImpl implements _DeleteTagRequestModel {
  const _$DeleteTagRequestModelImpl({required this.tagId});

  factory _$DeleteTagRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$DeleteTagRequestModelImplFromJson(json);

  @override
  final String tagId;

  @override
  String toString() {
    return 'DeleteTagRequestModel(tagId: $tagId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeleteTagRequestModelImpl &&
            (identical(other.tagId, tagId) || other.tagId == tagId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, tagId);

  /// Create a copy of DeleteTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DeleteTagRequestModelImplCopyWith<_$DeleteTagRequestModelImpl>
      get copyWith => __$$DeleteTagRequestModelImplCopyWithImpl<
          _$DeleteTagRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DeleteTagRequestModelImplToJson(
      this,
    );
  }
}

abstract class _DeleteTagRequestModel implements DeleteTagRequestModel {
  const factory _DeleteTagRequestModel({required final String tagId}) =
      _$DeleteTagRequestModelImpl;

  factory _DeleteTagRequestModel.fromJson(Map<String, dynamic> json) =
      _$DeleteTagRequestModelImpl.fromJson;

  @override
  String get tagId;

  /// Create a copy of DeleteTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DeleteTagRequestModelImplCopyWith<_$DeleteTagRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

CountByProfileRequestModel _$CountByProfileRequestModelFromJson(
    Map<String, dynamic> json) {
  return _CountByProfileRequestModel.fromJson(json);
}

/// @nodoc
mixin _$CountByProfileRequestModel {
  String get profileId => throw _privateConstructorUsedError;

  /// Serializes this CountByProfileRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CountByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CountByProfileRequestModelCopyWith<CountByProfileRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CountByProfileRequestModelCopyWith<$Res> {
  factory $CountByProfileRequestModelCopyWith(CountByProfileRequestModel value,
          $Res Function(CountByProfileRequestModel) then) =
      _$CountByProfileRequestModelCopyWithImpl<$Res,
          CountByProfileRequestModel>;
  @useResult
  $Res call({String profileId});
}

/// @nodoc
class _$CountByProfileRequestModelCopyWithImpl<$Res,
        $Val extends CountByProfileRequestModel>
    implements $CountByProfileRequestModelCopyWith<$Res> {
  _$CountByProfileRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CountByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CountByProfileRequestModelImplCopyWith<$Res>
    implements $CountByProfileRequestModelCopyWith<$Res> {
  factory _$$CountByProfileRequestModelImplCopyWith(
          _$CountByProfileRequestModelImpl value,
          $Res Function(_$CountByProfileRequestModelImpl) then) =
      __$$CountByProfileRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId});
}

/// @nodoc
class __$$CountByProfileRequestModelImplCopyWithImpl<$Res>
    extends _$CountByProfileRequestModelCopyWithImpl<$Res,
        _$CountByProfileRequestModelImpl>
    implements _$$CountByProfileRequestModelImplCopyWith<$Res> {
  __$$CountByProfileRequestModelImplCopyWithImpl(
      _$CountByProfileRequestModelImpl _value,
      $Res Function(_$CountByProfileRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CountByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
  }) {
    return _then(_$CountByProfileRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CountByProfileRequestModelImpl implements _CountByProfileRequestModel {
  const _$CountByProfileRequestModelImpl({required this.profileId});

  factory _$CountByProfileRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$CountByProfileRequestModelImplFromJson(json);

  @override
  final String profileId;

  @override
  String toString() {
    return 'CountByProfileRequestModel(profileId: $profileId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CountByProfileRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId);

  /// Create a copy of CountByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CountByProfileRequestModelImplCopyWith<_$CountByProfileRequestModelImpl>
      get copyWith => __$$CountByProfileRequestModelImplCopyWithImpl<
          _$CountByProfileRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CountByProfileRequestModelImplToJson(
      this,
    );
  }
}

abstract class _CountByProfileRequestModel
    implements CountByProfileRequestModel {
  const factory _CountByProfileRequestModel({required final String profileId}) =
      _$CountByProfileRequestModelImpl;

  factory _CountByProfileRequestModel.fromJson(Map<String, dynamic> json) =
      _$CountByProfileRequestModelImpl.fromJson;

  @override
  String get profileId;

  /// Create a copy of CountByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CountByProfileRequestModelImplCopyWith<_$CountByProfileRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetMostUsedRequestModel _$GetMostUsedRequestModelFromJson(
    Map<String, dynamic> json) {
  return _GetMostUsedRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetMostUsedRequestModel {
  String get profileId => throw _privateConstructorUsedError;

  /// Serializes this GetMostUsedRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetMostUsedRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetMostUsedRequestModelCopyWith<GetMostUsedRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetMostUsedRequestModelCopyWith<$Res> {
  factory $GetMostUsedRequestModelCopyWith(GetMostUsedRequestModel value,
          $Res Function(GetMostUsedRequestModel) then) =
      _$GetMostUsedRequestModelCopyWithImpl<$Res, GetMostUsedRequestModel>;
  @useResult
  $Res call({String profileId});
}

/// @nodoc
class _$GetMostUsedRequestModelCopyWithImpl<$Res,
        $Val extends GetMostUsedRequestModel>
    implements $GetMostUsedRequestModelCopyWith<$Res> {
  _$GetMostUsedRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetMostUsedRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetMostUsedRequestModelImplCopyWith<$Res>
    implements $GetMostUsedRequestModelCopyWith<$Res> {
  factory _$$GetMostUsedRequestModelImplCopyWith(
          _$GetMostUsedRequestModelImpl value,
          $Res Function(_$GetMostUsedRequestModelImpl) then) =
      __$$GetMostUsedRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId});
}

/// @nodoc
class __$$GetMostUsedRequestModelImplCopyWithImpl<$Res>
    extends _$GetMostUsedRequestModelCopyWithImpl<$Res,
        _$GetMostUsedRequestModelImpl>
    implements _$$GetMostUsedRequestModelImplCopyWith<$Res> {
  __$$GetMostUsedRequestModelImplCopyWithImpl(
      _$GetMostUsedRequestModelImpl _value,
      $Res Function(_$GetMostUsedRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetMostUsedRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
  }) {
    return _then(_$GetMostUsedRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetMostUsedRequestModelImpl implements _GetMostUsedRequestModel {
  const _$GetMostUsedRequestModelImpl({required this.profileId});

  factory _$GetMostUsedRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GetMostUsedRequestModelImplFromJson(json);

  @override
  final String profileId;

  @override
  String toString() {
    return 'GetMostUsedRequestModel(profileId: $profileId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetMostUsedRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId);

  /// Create a copy of GetMostUsedRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetMostUsedRequestModelImplCopyWith<_$GetMostUsedRequestModelImpl>
      get copyWith => __$$GetMostUsedRequestModelImplCopyWithImpl<
          _$GetMostUsedRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetMostUsedRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetMostUsedRequestModel implements GetMostUsedRequestModel {
  const factory _GetMostUsedRequestModel({required final String profileId}) =
      _$GetMostUsedRequestModelImpl;

  factory _GetMostUsedRequestModel.fromJson(Map<String, dynamic> json) =
      _$GetMostUsedRequestModelImpl.fromJson;

  @override
  String get profileId;

  /// Create a copy of GetMostUsedRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetMostUsedRequestModelImplCopyWith<_$GetMostUsedRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}
