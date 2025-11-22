// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'category_request_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CreateCategoryRequestModel _$CreateCategoryRequestModelFromJson(
    Map<String, dynamic> json) {
  return _CreateCategoryRequestModel.fromJson(json);
}

/// @nodoc
mixin _$CreateCategoryRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get parentId => throw _privateConstructorUsedError;
  String? get icon => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;

  /// Serializes this CreateCategoryRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateCategoryRequestModelCopyWith<CreateCategoryRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateCategoryRequestModelCopyWith<$Res> {
  factory $CreateCategoryRequestModelCopyWith(CreateCategoryRequestModel value,
          $Res Function(CreateCategoryRequestModel) then) =
      _$CreateCategoryRequestModelCopyWithImpl<$Res,
          CreateCategoryRequestModel>;
  @useResult
  $Res call(
      {String profileId,
      String name,
      String? parentId,
      String? icon,
      String? color,
      int sortOrder});
}

/// @nodoc
class _$CreateCategoryRequestModelCopyWithImpl<$Res,
        $Val extends CreateCategoryRequestModel>
    implements $CreateCategoryRequestModelCopyWith<$Res> {
  _$CreateCategoryRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? name = null,
    Object? parentId = freezed,
    Object? icon = freezed,
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
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
              as String?,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
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
abstract class _$$CreateCategoryRequestModelImplCopyWith<$Res>
    implements $CreateCategoryRequestModelCopyWith<$Res> {
  factory _$$CreateCategoryRequestModelImplCopyWith(
          _$CreateCategoryRequestModelImpl value,
          $Res Function(_$CreateCategoryRequestModelImpl) then) =
      __$$CreateCategoryRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String profileId,
      String name,
      String? parentId,
      String? icon,
      String? color,
      int sortOrder});
}

/// @nodoc
class __$$CreateCategoryRequestModelImplCopyWithImpl<$Res>
    extends _$CreateCategoryRequestModelCopyWithImpl<$Res,
        _$CreateCategoryRequestModelImpl>
    implements _$$CreateCategoryRequestModelImplCopyWith<$Res> {
  __$$CreateCategoryRequestModelImplCopyWithImpl(
      _$CreateCategoryRequestModelImpl _value,
      $Res Function(_$CreateCategoryRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CreateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? name = null,
    Object? parentId = freezed,
    Object? icon = freezed,
    Object? color = freezed,
    Object? sortOrder = null,
  }) {
    return _then(_$CreateCategoryRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
              as String?,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String?,
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
class _$CreateCategoryRequestModelImpl implements _CreateCategoryRequestModel {
  const _$CreateCategoryRequestModelImpl(
      {required this.profileId,
      required this.name,
      this.parentId,
      this.icon,
      this.color,
      this.sortOrder = 0});

  factory _$CreateCategoryRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$CreateCategoryRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  final String name;
  @override
  final String? parentId;
  @override
  final String? icon;
  @override
  final String? color;
  @override
  @JsonKey()
  final int sortOrder;

  @override
  String toString() {
    return 'CreateCategoryRequestModel(profileId: $profileId, name: $name, parentId: $parentId, icon: $icon, color: $color, sortOrder: $sortOrder)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateCategoryRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.parentId, parentId) ||
                other.parentId == parentId) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, profileId, name, parentId, icon, color, sortOrder);

  /// Create a copy of CreateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateCategoryRequestModelImplCopyWith<_$CreateCategoryRequestModelImpl>
      get copyWith => __$$CreateCategoryRequestModelImplCopyWithImpl<
          _$CreateCategoryRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateCategoryRequestModelImplToJson(
      this,
    );
  }
}

abstract class _CreateCategoryRequestModel
    implements CreateCategoryRequestModel {
  const factory _CreateCategoryRequestModel(
      {required final String profileId,
      required final String name,
      final String? parentId,
      final String? icon,
      final String? color,
      final int sortOrder}) = _$CreateCategoryRequestModelImpl;

  factory _CreateCategoryRequestModel.fromJson(Map<String, dynamic> json) =
      _$CreateCategoryRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  String get name;
  @override
  String? get parentId;
  @override
  String? get icon;
  @override
  String? get color;
  @override
  int get sortOrder;

  /// Create a copy of CreateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateCategoryRequestModelImplCopyWith<_$CreateCategoryRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

UpdateCategoryRequestModel _$UpdateCategoryRequestModelFromJson(
    Map<String, dynamic> json) {
  return _UpdateCategoryRequestModel.fromJson(json);
}

/// @nodoc
mixin _$UpdateCategoryRequestModel {
  String get id => throw _privateConstructorUsedError;
  String? get name => throw _privateConstructorUsedError;
  String? get parentId => throw _privateConstructorUsedError;
  String? get icon => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  int? get sortOrder => throw _privateConstructorUsedError;

  /// Serializes this UpdateCategoryRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdateCategoryRequestModelCopyWith<UpdateCategoryRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdateCategoryRequestModelCopyWith<$Res> {
  factory $UpdateCategoryRequestModelCopyWith(UpdateCategoryRequestModel value,
          $Res Function(UpdateCategoryRequestModel) then) =
      _$UpdateCategoryRequestModelCopyWithImpl<$Res,
          UpdateCategoryRequestModel>;
  @useResult
  $Res call(
      {String id,
      String? name,
      String? parentId,
      String? icon,
      String? color,
      int? sortOrder});
}

/// @nodoc
class _$UpdateCategoryRequestModelCopyWithImpl<$Res,
        $Val extends UpdateCategoryRequestModel>
    implements $UpdateCategoryRequestModelCopyWith<$Res> {
  _$UpdateCategoryRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = freezed,
    Object? parentId = freezed,
    Object? icon = freezed,
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
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
              as String?,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
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
abstract class _$$UpdateCategoryRequestModelImplCopyWith<$Res>
    implements $UpdateCategoryRequestModelCopyWith<$Res> {
  factory _$$UpdateCategoryRequestModelImplCopyWith(
          _$UpdateCategoryRequestModelImpl value,
          $Res Function(_$UpdateCategoryRequestModelImpl) then) =
      __$$UpdateCategoryRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String? name,
      String? parentId,
      String? icon,
      String? color,
      int? sortOrder});
}

/// @nodoc
class __$$UpdateCategoryRequestModelImplCopyWithImpl<$Res>
    extends _$UpdateCategoryRequestModelCopyWithImpl<$Res,
        _$UpdateCategoryRequestModelImpl>
    implements _$$UpdateCategoryRequestModelImplCopyWith<$Res> {
  __$$UpdateCategoryRequestModelImplCopyWithImpl(
      _$UpdateCategoryRequestModelImpl _value,
      $Res Function(_$UpdateCategoryRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of UpdateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = freezed,
    Object? parentId = freezed,
    Object? icon = freezed,
    Object? color = freezed,
    Object? sortOrder = freezed,
  }) {
    return _then(_$UpdateCategoryRequestModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: freezed == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String?,
      parentId: freezed == parentId
          ? _value.parentId
          : parentId // ignore: cast_nullable_to_non_nullable
              as String?,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
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
class _$UpdateCategoryRequestModelImpl implements _UpdateCategoryRequestModel {
  const _$UpdateCategoryRequestModelImpl(
      {required this.id,
      this.name,
      this.parentId,
      this.icon,
      this.color,
      this.sortOrder});

  factory _$UpdateCategoryRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$UpdateCategoryRequestModelImplFromJson(json);

  @override
  final String id;
  @override
  final String? name;
  @override
  final String? parentId;
  @override
  final String? icon;
  @override
  final String? color;
  @override
  final int? sortOrder;

  @override
  String toString() {
    return 'UpdateCategoryRequestModel(id: $id, name: $name, parentId: $parentId, icon: $icon, color: $color, sortOrder: $sortOrder)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateCategoryRequestModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.parentId, parentId) ||
                other.parentId == parentId) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, parentId, icon, color, sortOrder);

  /// Create a copy of UpdateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateCategoryRequestModelImplCopyWith<_$UpdateCategoryRequestModelImpl>
      get copyWith => __$$UpdateCategoryRequestModelImplCopyWithImpl<
          _$UpdateCategoryRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdateCategoryRequestModelImplToJson(
      this,
    );
  }
}

abstract class _UpdateCategoryRequestModel
    implements UpdateCategoryRequestModel {
  const factory _UpdateCategoryRequestModel(
      {required final String id,
      final String? name,
      final String? parentId,
      final String? icon,
      final String? color,
      final int? sortOrder}) = _$UpdateCategoryRequestModelImpl;

  factory _UpdateCategoryRequestModel.fromJson(Map<String, dynamic> json) =
      _$UpdateCategoryRequestModelImpl.fromJson;

  @override
  String get id;
  @override
  String? get name;
  @override
  String? get parentId;
  @override
  String? get icon;
  @override
  String? get color;
  @override
  int? get sortOrder;

  /// Create a copy of UpdateCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdateCategoryRequestModelImplCopyWith<_$UpdateCategoryRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}
