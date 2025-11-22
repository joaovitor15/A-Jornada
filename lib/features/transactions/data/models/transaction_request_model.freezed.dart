// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'transaction_request_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GetTransactionsByProfileRequestModel
    _$GetTransactionsByProfileRequestModelFromJson(Map<String, dynamic> json) {
  return _GetTransactionsByProfileRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTransactionsByProfileRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  int get page => throw _privateConstructorUsedError;
  int get pageSize => throw _privateConstructorUsedError;

  /// Serializes this GetTransactionsByProfileRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTransactionsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTransactionsByProfileRequestModelCopyWith<
          GetTransactionsByProfileRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTransactionsByProfileRequestModelCopyWith<$Res> {
  factory $GetTransactionsByProfileRequestModelCopyWith(
          GetTransactionsByProfileRequestModel value,
          $Res Function(GetTransactionsByProfileRequestModel) then) =
      _$GetTransactionsByProfileRequestModelCopyWithImpl<$Res,
          GetTransactionsByProfileRequestModel>;
  @useResult
  $Res call({String profileId, int page, int pageSize});
}

/// @nodoc
class _$GetTransactionsByProfileRequestModelCopyWithImpl<$Res,
        $Val extends GetTransactionsByProfileRequestModel>
    implements $GetTransactionsByProfileRequestModelCopyWith<$Res> {
  _$GetTransactionsByProfileRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTransactionsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTransactionsByProfileRequestModelImplCopyWith<$Res>
    implements $GetTransactionsByProfileRequestModelCopyWith<$Res> {
  factory _$$GetTransactionsByProfileRequestModelImplCopyWith(
          _$GetTransactionsByProfileRequestModelImpl value,
          $Res Function(_$GetTransactionsByProfileRequestModelImpl) then) =
      __$$GetTransactionsByProfileRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId, int page, int pageSize});
}

/// @nodoc
class __$$GetTransactionsByProfileRequestModelImplCopyWithImpl<$Res>
    extends _$GetTransactionsByProfileRequestModelCopyWithImpl<$Res,
        _$GetTransactionsByProfileRequestModelImpl>
    implements _$$GetTransactionsByProfileRequestModelImplCopyWith<$Res> {
  __$$GetTransactionsByProfileRequestModelImplCopyWithImpl(
      _$GetTransactionsByProfileRequestModelImpl _value,
      $Res Function(_$GetTransactionsByProfileRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTransactionsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_$GetTransactionsByProfileRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTransactionsByProfileRequestModelImpl
    implements _GetTransactionsByProfileRequestModel {
  const _$GetTransactionsByProfileRequestModelImpl(
      {required this.profileId, this.page = 1, this.pageSize = 20});

  factory _$GetTransactionsByProfileRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTransactionsByProfileRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  @JsonKey()
  final int page;
  @override
  @JsonKey()
  final int pageSize;

  @override
  String toString() {
    return 'GetTransactionsByProfileRequestModel(profileId: $profileId, page: $page, pageSize: $pageSize)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTransactionsByProfileRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.pageSize, pageSize) ||
                other.pageSize == pageSize));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId, page, pageSize);

  /// Create a copy of GetTransactionsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTransactionsByProfileRequestModelImplCopyWith<
          _$GetTransactionsByProfileRequestModelImpl>
      get copyWith => __$$GetTransactionsByProfileRequestModelImplCopyWithImpl<
          _$GetTransactionsByProfileRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTransactionsByProfileRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTransactionsByProfileRequestModel
    implements GetTransactionsByProfileRequestModel {
  const factory _GetTransactionsByProfileRequestModel(
      {required final String profileId,
      final int page,
      final int pageSize}) = _$GetTransactionsByProfileRequestModelImpl;

  factory _GetTransactionsByProfileRequestModel.fromJson(
          Map<String, dynamic> json) =
      _$GetTransactionsByProfileRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  int get page;
  @override
  int get pageSize;

  /// Create a copy of GetTransactionsByProfileRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTransactionsByProfileRequestModelImplCopyWith<
          _$GetTransactionsByProfileRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTransactionByIdRequestModel _$GetTransactionByIdRequestModelFromJson(
    Map<String, dynamic> json) {
  return _GetTransactionByIdRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTransactionByIdRequestModel {
  String get transactionId => throw _privateConstructorUsedError;

  /// Serializes this GetTransactionByIdRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTransactionByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTransactionByIdRequestModelCopyWith<GetTransactionByIdRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTransactionByIdRequestModelCopyWith<$Res> {
  factory $GetTransactionByIdRequestModelCopyWith(
          GetTransactionByIdRequestModel value,
          $Res Function(GetTransactionByIdRequestModel) then) =
      _$GetTransactionByIdRequestModelCopyWithImpl<$Res,
          GetTransactionByIdRequestModel>;
  @useResult
  $Res call({String transactionId});
}

/// @nodoc
class _$GetTransactionByIdRequestModelCopyWithImpl<$Res,
        $Val extends GetTransactionByIdRequestModel>
    implements $GetTransactionByIdRequestModelCopyWith<$Res> {
  _$GetTransactionByIdRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTransactionByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
  }) {
    return _then(_value.copyWith(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTransactionByIdRequestModelImplCopyWith<$Res>
    implements $GetTransactionByIdRequestModelCopyWith<$Res> {
  factory _$$GetTransactionByIdRequestModelImplCopyWith(
          _$GetTransactionByIdRequestModelImpl value,
          $Res Function(_$GetTransactionByIdRequestModelImpl) then) =
      __$$GetTransactionByIdRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String transactionId});
}

/// @nodoc
class __$$GetTransactionByIdRequestModelImplCopyWithImpl<$Res>
    extends _$GetTransactionByIdRequestModelCopyWithImpl<$Res,
        _$GetTransactionByIdRequestModelImpl>
    implements _$$GetTransactionByIdRequestModelImplCopyWith<$Res> {
  __$$GetTransactionByIdRequestModelImplCopyWithImpl(
      _$GetTransactionByIdRequestModelImpl _value,
      $Res Function(_$GetTransactionByIdRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTransactionByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
  }) {
    return _then(_$GetTransactionByIdRequestModelImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTransactionByIdRequestModelImpl
    implements _GetTransactionByIdRequestModel {
  const _$GetTransactionByIdRequestModelImpl({required this.transactionId});

  factory _$GetTransactionByIdRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTransactionByIdRequestModelImplFromJson(json);

  @override
  final String transactionId;

  @override
  String toString() {
    return 'GetTransactionByIdRequestModel(transactionId: $transactionId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTransactionByIdRequestModelImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, transactionId);

  /// Create a copy of GetTransactionByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTransactionByIdRequestModelImplCopyWith<
          _$GetTransactionByIdRequestModelImpl>
      get copyWith => __$$GetTransactionByIdRequestModelImplCopyWithImpl<
          _$GetTransactionByIdRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTransactionByIdRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTransactionByIdRequestModel
    implements GetTransactionByIdRequestModel {
  const factory _GetTransactionByIdRequestModel(
          {required final String transactionId}) =
      _$GetTransactionByIdRequestModelImpl;

  factory _GetTransactionByIdRequestModel.fromJson(Map<String, dynamic> json) =
      _$GetTransactionByIdRequestModelImpl.fromJson;

  @override
  String get transactionId;

  /// Create a copy of GetTransactionByIdRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTransactionByIdRequestModelImplCopyWith<
          _$GetTransactionByIdRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTransactionsByPeriodRequestModel
    _$GetTransactionsByPeriodRequestModelFromJson(Map<String, dynamic> json) {
  return _GetTransactionsByPeriodRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTransactionsByPeriodRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  DateTime get startDate => throw _privateConstructorUsedError;
  DateTime get endDate => throw _privateConstructorUsedError;
  int get page => throw _privateConstructorUsedError;
  int get pageSize => throw _privateConstructorUsedError;

  /// Serializes this GetTransactionsByPeriodRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTransactionsByPeriodRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTransactionsByPeriodRequestModelCopyWith<
          GetTransactionsByPeriodRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTransactionsByPeriodRequestModelCopyWith<$Res> {
  factory $GetTransactionsByPeriodRequestModelCopyWith(
          GetTransactionsByPeriodRequestModel value,
          $Res Function(GetTransactionsByPeriodRequestModel) then) =
      _$GetTransactionsByPeriodRequestModelCopyWithImpl<$Res,
          GetTransactionsByPeriodRequestModel>;
  @useResult
  $Res call(
      {String profileId,
      DateTime startDate,
      DateTime endDate,
      int page,
      int pageSize});
}

/// @nodoc
class _$GetTransactionsByPeriodRequestModelCopyWithImpl<$Res,
        $Val extends GetTransactionsByPeriodRequestModel>
    implements $GetTransactionsByPeriodRequestModelCopyWith<$Res> {
  _$GetTransactionsByPeriodRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTransactionsByPeriodRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? startDate = null,
    Object? endDate = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTransactionsByPeriodRequestModelImplCopyWith<$Res>
    implements $GetTransactionsByPeriodRequestModelCopyWith<$Res> {
  factory _$$GetTransactionsByPeriodRequestModelImplCopyWith(
          _$GetTransactionsByPeriodRequestModelImpl value,
          $Res Function(_$GetTransactionsByPeriodRequestModelImpl) then) =
      __$$GetTransactionsByPeriodRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String profileId,
      DateTime startDate,
      DateTime endDate,
      int page,
      int pageSize});
}

/// @nodoc
class __$$GetTransactionsByPeriodRequestModelImplCopyWithImpl<$Res>
    extends _$GetTransactionsByPeriodRequestModelCopyWithImpl<$Res,
        _$GetTransactionsByPeriodRequestModelImpl>
    implements _$$GetTransactionsByPeriodRequestModelImplCopyWith<$Res> {
  __$$GetTransactionsByPeriodRequestModelImplCopyWithImpl(
      _$GetTransactionsByPeriodRequestModelImpl _value,
      $Res Function(_$GetTransactionsByPeriodRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTransactionsByPeriodRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? startDate = null,
    Object? endDate = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_$GetTransactionsByPeriodRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTransactionsByPeriodRequestModelImpl
    implements _GetTransactionsByPeriodRequestModel {
  const _$GetTransactionsByPeriodRequestModelImpl(
      {required this.profileId,
      required this.startDate,
      required this.endDate,
      this.page = 1,
      this.pageSize = 20});

  factory _$GetTransactionsByPeriodRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTransactionsByPeriodRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  final DateTime startDate;
  @override
  final DateTime endDate;
  @override
  @JsonKey()
  final int page;
  @override
  @JsonKey()
  final int pageSize;

  @override
  String toString() {
    return 'GetTransactionsByPeriodRequestModel(profileId: $profileId, startDate: $startDate, endDate: $endDate, page: $page, pageSize: $pageSize)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTransactionsByPeriodRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.pageSize, pageSize) ||
                other.pageSize == pageSize));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, profileId, startDate, endDate, page, pageSize);

  /// Create a copy of GetTransactionsByPeriodRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTransactionsByPeriodRequestModelImplCopyWith<
          _$GetTransactionsByPeriodRequestModelImpl>
      get copyWith => __$$GetTransactionsByPeriodRequestModelImplCopyWithImpl<
          _$GetTransactionsByPeriodRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTransactionsByPeriodRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTransactionsByPeriodRequestModel
    implements GetTransactionsByPeriodRequestModel {
  const factory _GetTransactionsByPeriodRequestModel(
      {required final String profileId,
      required final DateTime startDate,
      required final DateTime endDate,
      final int page,
      final int pageSize}) = _$GetTransactionsByPeriodRequestModelImpl;

  factory _GetTransactionsByPeriodRequestModel.fromJson(
          Map<String, dynamic> json) =
      _$GetTransactionsByPeriodRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  DateTime get startDate;
  @override
  DateTime get endDate;
  @override
  int get page;
  @override
  int get pageSize;

  /// Create a copy of GetTransactionsByPeriodRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTransactionsByPeriodRequestModelImplCopyWith<
          _$GetTransactionsByPeriodRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTransactionsByCategoryRequestModel
    _$GetTransactionsByCategoryRequestModelFromJson(Map<String, dynamic> json) {
  return _GetTransactionsByCategoryRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTransactionsByCategoryRequestModel {
  String get categoryId => throw _privateConstructorUsedError;
  int get page => throw _privateConstructorUsedError;
  int get pageSize => throw _privateConstructorUsedError;

  /// Serializes this GetTransactionsByCategoryRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTransactionsByCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTransactionsByCategoryRequestModelCopyWith<
          GetTransactionsByCategoryRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTransactionsByCategoryRequestModelCopyWith<$Res> {
  factory $GetTransactionsByCategoryRequestModelCopyWith(
          GetTransactionsByCategoryRequestModel value,
          $Res Function(GetTransactionsByCategoryRequestModel) then) =
      _$GetTransactionsByCategoryRequestModelCopyWithImpl<$Res,
          GetTransactionsByCategoryRequestModel>;
  @useResult
  $Res call({String categoryId, int page, int pageSize});
}

/// @nodoc
class _$GetTransactionsByCategoryRequestModelCopyWithImpl<$Res,
        $Val extends GetTransactionsByCategoryRequestModel>
    implements $GetTransactionsByCategoryRequestModelCopyWith<$Res> {
  _$GetTransactionsByCategoryRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTransactionsByCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? categoryId = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_value.copyWith(
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTransactionsByCategoryRequestModelImplCopyWith<$Res>
    implements $GetTransactionsByCategoryRequestModelCopyWith<$Res> {
  factory _$$GetTransactionsByCategoryRequestModelImplCopyWith(
          _$GetTransactionsByCategoryRequestModelImpl value,
          $Res Function(_$GetTransactionsByCategoryRequestModelImpl) then) =
      __$$GetTransactionsByCategoryRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String categoryId, int page, int pageSize});
}

/// @nodoc
class __$$GetTransactionsByCategoryRequestModelImplCopyWithImpl<$Res>
    extends _$GetTransactionsByCategoryRequestModelCopyWithImpl<$Res,
        _$GetTransactionsByCategoryRequestModelImpl>
    implements _$$GetTransactionsByCategoryRequestModelImplCopyWith<$Res> {
  __$$GetTransactionsByCategoryRequestModelImplCopyWithImpl(
      _$GetTransactionsByCategoryRequestModelImpl _value,
      $Res Function(_$GetTransactionsByCategoryRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTransactionsByCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? categoryId = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_$GetTransactionsByCategoryRequestModelImpl(
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTransactionsByCategoryRequestModelImpl
    implements _GetTransactionsByCategoryRequestModel {
  const _$GetTransactionsByCategoryRequestModelImpl(
      {required this.categoryId, this.page = 1, this.pageSize = 20});

  factory _$GetTransactionsByCategoryRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTransactionsByCategoryRequestModelImplFromJson(json);

  @override
  final String categoryId;
  @override
  @JsonKey()
  final int page;
  @override
  @JsonKey()
  final int pageSize;

  @override
  String toString() {
    return 'GetTransactionsByCategoryRequestModel(categoryId: $categoryId, page: $page, pageSize: $pageSize)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTransactionsByCategoryRequestModelImpl &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.pageSize, pageSize) ||
                other.pageSize == pageSize));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, categoryId, page, pageSize);

  /// Create a copy of GetTransactionsByCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTransactionsByCategoryRequestModelImplCopyWith<
          _$GetTransactionsByCategoryRequestModelImpl>
      get copyWith => __$$GetTransactionsByCategoryRequestModelImplCopyWithImpl<
          _$GetTransactionsByCategoryRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTransactionsByCategoryRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTransactionsByCategoryRequestModel
    implements GetTransactionsByCategoryRequestModel {
  const factory _GetTransactionsByCategoryRequestModel(
      {required final String categoryId,
      final int page,
      final int pageSize}) = _$GetTransactionsByCategoryRequestModelImpl;

  factory _GetTransactionsByCategoryRequestModel.fromJson(
          Map<String, dynamic> json) =
      _$GetTransactionsByCategoryRequestModelImpl.fromJson;

  @override
  String get categoryId;
  @override
  int get page;
  @override
  int get pageSize;

  /// Create a copy of GetTransactionsByCategoryRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTransactionsByCategoryRequestModelImplCopyWith<
          _$GetTransactionsByCategoryRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetFilteredTransactionsRequestModel
    _$GetFilteredTransactionsRequestModelFromJson(Map<String, dynamic> json) {
  return _GetFilteredTransactionsRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetFilteredTransactionsRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  String? get categoryId => throw _privateConstructorUsedError;
  String? get type => throw _privateConstructorUsedError;
  DateTime? get startDate => throw _privateConstructorUsedError;
  DateTime? get endDate => throw _privateConstructorUsedError;
  List<String>? get tagIds => throw _privateConstructorUsedError;
  String? get searchText => throw _privateConstructorUsedError;
  int get page => throw _privateConstructorUsedError;
  int get pageSize => throw _privateConstructorUsedError;

  /// Serializes this GetFilteredTransactionsRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetFilteredTransactionsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetFilteredTransactionsRequestModelCopyWith<
          GetFilteredTransactionsRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetFilteredTransactionsRequestModelCopyWith<$Res> {
  factory $GetFilteredTransactionsRequestModelCopyWith(
          GetFilteredTransactionsRequestModel value,
          $Res Function(GetFilteredTransactionsRequestModel) then) =
      _$GetFilteredTransactionsRequestModelCopyWithImpl<$Res,
          GetFilteredTransactionsRequestModel>;
  @useResult
  $Res call(
      {String profileId,
      String? categoryId,
      String? type,
      DateTime? startDate,
      DateTime? endDate,
      List<String>? tagIds,
      String? searchText,
      int page,
      int pageSize});
}

/// @nodoc
class _$GetFilteredTransactionsRequestModelCopyWithImpl<$Res,
        $Val extends GetFilteredTransactionsRequestModel>
    implements $GetFilteredTransactionsRequestModelCopyWith<$Res> {
  _$GetFilteredTransactionsRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetFilteredTransactionsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? categoryId = freezed,
    Object? type = freezed,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? tagIds = freezed,
    Object? searchText = freezed,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: freezed == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String?,
      type: freezed == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String?,
      startDate: freezed == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      tagIds: freezed == tagIds
          ? _value.tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      searchText: freezed == searchText
          ? _value.searchText
          : searchText // ignore: cast_nullable_to_non_nullable
              as String?,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetFilteredTransactionsRequestModelImplCopyWith<$Res>
    implements $GetFilteredTransactionsRequestModelCopyWith<$Res> {
  factory _$$GetFilteredTransactionsRequestModelImplCopyWith(
          _$GetFilteredTransactionsRequestModelImpl value,
          $Res Function(_$GetFilteredTransactionsRequestModelImpl) then) =
      __$$GetFilteredTransactionsRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String profileId,
      String? categoryId,
      String? type,
      DateTime? startDate,
      DateTime? endDate,
      List<String>? tagIds,
      String? searchText,
      int page,
      int pageSize});
}

/// @nodoc
class __$$GetFilteredTransactionsRequestModelImplCopyWithImpl<$Res>
    extends _$GetFilteredTransactionsRequestModelCopyWithImpl<$Res,
        _$GetFilteredTransactionsRequestModelImpl>
    implements _$$GetFilteredTransactionsRequestModelImplCopyWith<$Res> {
  __$$GetFilteredTransactionsRequestModelImplCopyWithImpl(
      _$GetFilteredTransactionsRequestModelImpl _value,
      $Res Function(_$GetFilteredTransactionsRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetFilteredTransactionsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? categoryId = freezed,
    Object? type = freezed,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? tagIds = freezed,
    Object? searchText = freezed,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(_$GetFilteredTransactionsRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: freezed == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String?,
      type: freezed == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String?,
      startDate: freezed == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      tagIds: freezed == tagIds
          ? _value._tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      searchText: freezed == searchText
          ? _value.searchText
          : searchText // ignore: cast_nullable_to_non_nullable
              as String?,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      pageSize: null == pageSize
          ? _value.pageSize
          : pageSize // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetFilteredTransactionsRequestModelImpl
    implements _GetFilteredTransactionsRequestModel {
  const _$GetFilteredTransactionsRequestModelImpl(
      {required this.profileId,
      this.categoryId,
      this.type,
      this.startDate,
      this.endDate,
      final List<String>? tagIds,
      this.searchText,
      this.page = 1,
      this.pageSize = 20})
      : _tagIds = tagIds;

  factory _$GetFilteredTransactionsRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetFilteredTransactionsRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  final String? categoryId;
  @override
  final String? type;
  @override
  final DateTime? startDate;
  @override
  final DateTime? endDate;
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
  final String? searchText;
  @override
  @JsonKey()
  final int page;
  @override
  @JsonKey()
  final int pageSize;

  @override
  String toString() {
    return 'GetFilteredTransactionsRequestModel(profileId: $profileId, categoryId: $categoryId, type: $type, startDate: $startDate, endDate: $endDate, tagIds: $tagIds, searchText: $searchText, page: $page, pageSize: $pageSize)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetFilteredTransactionsRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            const DeepCollectionEquality().equals(other._tagIds, _tagIds) &&
            (identical(other.searchText, searchText) ||
                other.searchText == searchText) &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.pageSize, pageSize) ||
                other.pageSize == pageSize));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      profileId,
      categoryId,
      type,
      startDate,
      endDate,
      const DeepCollectionEquality().hash(_tagIds),
      searchText,
      page,
      pageSize);

  /// Create a copy of GetFilteredTransactionsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetFilteredTransactionsRequestModelImplCopyWith<
          _$GetFilteredTransactionsRequestModelImpl>
      get copyWith => __$$GetFilteredTransactionsRequestModelImplCopyWithImpl<
          _$GetFilteredTransactionsRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetFilteredTransactionsRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetFilteredTransactionsRequestModel
    implements GetFilteredTransactionsRequestModel {
  const factory _GetFilteredTransactionsRequestModel(
      {required final String profileId,
      final String? categoryId,
      final String? type,
      final DateTime? startDate,
      final DateTime? endDate,
      final List<String>? tagIds,
      final String? searchText,
      final int page,
      final int pageSize}) = _$GetFilteredTransactionsRequestModelImpl;

  factory _GetFilteredTransactionsRequestModel.fromJson(
          Map<String, dynamic> json) =
      _$GetFilteredTransactionsRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  String? get categoryId;
  @override
  String? get type;
  @override
  DateTime? get startDate;
  @override
  DateTime? get endDate;
  @override
  List<String>? get tagIds;
  @override
  String? get searchText;
  @override
  int get page;
  @override
  int get pageSize;

  /// Create a copy of GetFilteredTransactionsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetFilteredTransactionsRequestModelImplCopyWith<
          _$GetFilteredTransactionsRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

CreateTransactionRequestModel _$CreateTransactionRequestModelFromJson(
    Map<String, dynamic> json) {
  return _CreateTransactionRequestModel.fromJson(json);
}

/// @nodoc
mixin _$CreateTransactionRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  String get categoryId => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  double get amount => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  List<String>? get tagIds => throw _privateConstructorUsedError;

  /// Serializes this CreateTransactionRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateTransactionRequestModelCopyWith<CreateTransactionRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateTransactionRequestModelCopyWith<$Res> {
  factory $CreateTransactionRequestModelCopyWith(
          CreateTransactionRequestModel value,
          $Res Function(CreateTransactionRequestModel) then) =
      _$CreateTransactionRequestModelCopyWithImpl<$Res,
          CreateTransactionRequestModel>;
  @useResult
  $Res call(
      {String profileId,
      String categoryId,
      String type,
      double amount,
      String? description,
      DateTime date,
      List<String>? tagIds});
}

/// @nodoc
class _$CreateTransactionRequestModelCopyWithImpl<$Res,
        $Val extends CreateTransactionRequestModel>
    implements $CreateTransactionRequestModelCopyWith<$Res> {
  _$CreateTransactionRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? categoryId = null,
    Object? type = null,
    Object? amount = null,
    Object? description = freezed,
    Object? date = null,
    Object? tagIds = freezed,
  }) {
    return _then(_value.copyWith(
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
      tagIds: freezed == tagIds
          ? _value.tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CreateTransactionRequestModelImplCopyWith<$Res>
    implements $CreateTransactionRequestModelCopyWith<$Res> {
  factory _$$CreateTransactionRequestModelImplCopyWith(
          _$CreateTransactionRequestModelImpl value,
          $Res Function(_$CreateTransactionRequestModelImpl) then) =
      __$$CreateTransactionRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String profileId,
      String categoryId,
      String type,
      double amount,
      String? description,
      DateTime date,
      List<String>? tagIds});
}

/// @nodoc
class __$$CreateTransactionRequestModelImplCopyWithImpl<$Res>
    extends _$CreateTransactionRequestModelCopyWithImpl<$Res,
        _$CreateTransactionRequestModelImpl>
    implements _$$CreateTransactionRequestModelImplCopyWith<$Res> {
  __$$CreateTransactionRequestModelImplCopyWithImpl(
      _$CreateTransactionRequestModelImpl _value,
      $Res Function(_$CreateTransactionRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CreateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? categoryId = null,
    Object? type = null,
    Object? amount = null,
    Object? description = freezed,
    Object? date = null,
    Object? tagIds = freezed,
  }) {
    return _then(_$CreateTransactionRequestModelImpl(
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
      tagIds: freezed == tagIds
          ? _value._tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateTransactionRequestModelImpl
    implements _CreateTransactionRequestModel {
  const _$CreateTransactionRequestModelImpl(
      {required this.profileId,
      required this.categoryId,
      required this.type,
      required this.amount,
      this.description,
      required this.date,
      final List<String>? tagIds})
      : _tagIds = tagIds;

  factory _$CreateTransactionRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$CreateTransactionRequestModelImplFromJson(json);

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
    return 'CreateTransactionRequestModel(profileId: $profileId, categoryId: $categoryId, type: $type, amount: $amount, description: $description, date: $date, tagIds: $tagIds)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateTransactionRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.date, date) || other.date == date) &&
            const DeepCollectionEquality().equals(other._tagIds, _tagIds));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId, categoryId, type,
      amount, description, date, const DeepCollectionEquality().hash(_tagIds));

  /// Create a copy of CreateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateTransactionRequestModelImplCopyWith<
          _$CreateTransactionRequestModelImpl>
      get copyWith => __$$CreateTransactionRequestModelImplCopyWithImpl<
          _$CreateTransactionRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateTransactionRequestModelImplToJson(
      this,
    );
  }
}

abstract class _CreateTransactionRequestModel
    implements CreateTransactionRequestModel {
  const factory _CreateTransactionRequestModel(
      {required final String profileId,
      required final String categoryId,
      required final String type,
      required final double amount,
      final String? description,
      required final DateTime date,
      final List<String>? tagIds}) = _$CreateTransactionRequestModelImpl;

  factory _CreateTransactionRequestModel.fromJson(Map<String, dynamic> json) =
      _$CreateTransactionRequestModelImpl.fromJson;

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
  List<String>? get tagIds;

  /// Create a copy of CreateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateTransactionRequestModelImplCopyWith<
          _$CreateTransactionRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

UpdateTransactionRequestModel _$UpdateTransactionRequestModelFromJson(
    Map<String, dynamic> json) {
  return _UpdateTransactionRequestModel.fromJson(json);
}

/// @nodoc
mixin _$UpdateTransactionRequestModel {
  String get id => throw _privateConstructorUsedError;
  String? get categoryId => throw _privateConstructorUsedError;
  String? get type => throw _privateConstructorUsedError;
  double? get amount => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  DateTime? get date => throw _privateConstructorUsedError;
  List<String>? get tagIds => throw _privateConstructorUsedError;

  /// Serializes this UpdateTransactionRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdateTransactionRequestModelCopyWith<UpdateTransactionRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdateTransactionRequestModelCopyWith<$Res> {
  factory $UpdateTransactionRequestModelCopyWith(
          UpdateTransactionRequestModel value,
          $Res Function(UpdateTransactionRequestModel) then) =
      _$UpdateTransactionRequestModelCopyWithImpl<$Res,
          UpdateTransactionRequestModel>;
  @useResult
  $Res call(
      {String id,
      String? categoryId,
      String? type,
      double? amount,
      String? description,
      DateTime? date,
      List<String>? tagIds});
}

/// @nodoc
class _$UpdateTransactionRequestModelCopyWithImpl<$Res,
        $Val extends UpdateTransactionRequestModel>
    implements $UpdateTransactionRequestModelCopyWith<$Res> {
  _$UpdateTransactionRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? categoryId = freezed,
    Object? type = freezed,
    Object? amount = freezed,
    Object? description = freezed,
    Object? date = freezed,
    Object? tagIds = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: freezed == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String?,
      type: freezed == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String?,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as double?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      date: freezed == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      tagIds: freezed == tagIds
          ? _value.tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$UpdateTransactionRequestModelImplCopyWith<$Res>
    implements $UpdateTransactionRequestModelCopyWith<$Res> {
  factory _$$UpdateTransactionRequestModelImplCopyWith(
          _$UpdateTransactionRequestModelImpl value,
          $Res Function(_$UpdateTransactionRequestModelImpl) then) =
      __$$UpdateTransactionRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String? categoryId,
      String? type,
      double? amount,
      String? description,
      DateTime? date,
      List<String>? tagIds});
}

/// @nodoc
class __$$UpdateTransactionRequestModelImplCopyWithImpl<$Res>
    extends _$UpdateTransactionRequestModelCopyWithImpl<$Res,
        _$UpdateTransactionRequestModelImpl>
    implements _$$UpdateTransactionRequestModelImplCopyWith<$Res> {
  __$$UpdateTransactionRequestModelImplCopyWithImpl(
      _$UpdateTransactionRequestModelImpl _value,
      $Res Function(_$UpdateTransactionRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of UpdateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? categoryId = freezed,
    Object? type = freezed,
    Object? amount = freezed,
    Object? description = freezed,
    Object? date = freezed,
    Object? tagIds = freezed,
  }) {
    return _then(_$UpdateTransactionRequestModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      categoryId: freezed == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String?,
      type: freezed == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String?,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as double?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      date: freezed == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      tagIds: freezed == tagIds
          ? _value._tagIds
          : tagIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UpdateTransactionRequestModelImpl
    implements _UpdateTransactionRequestModel {
  const _$UpdateTransactionRequestModelImpl(
      {required this.id,
      this.categoryId,
      this.type,
      this.amount,
      this.description,
      this.date,
      final List<String>? tagIds})
      : _tagIds = tagIds;

  factory _$UpdateTransactionRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$UpdateTransactionRequestModelImplFromJson(json);

  @override
  final String id;
  @override
  final String? categoryId;
  @override
  final String? type;
  @override
  final double? amount;
  @override
  final String? description;
  @override
  final DateTime? date;
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
    return 'UpdateTransactionRequestModel(id: $id, categoryId: $categoryId, type: $type, amount: $amount, description: $description, date: $date, tagIds: $tagIds)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateTransactionRequestModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.date, date) || other.date == date) &&
            const DeepCollectionEquality().equals(other._tagIds, _tagIds));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, categoryId, type, amount,
      description, date, const DeepCollectionEquality().hash(_tagIds));

  /// Create a copy of UpdateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateTransactionRequestModelImplCopyWith<
          _$UpdateTransactionRequestModelImpl>
      get copyWith => __$$UpdateTransactionRequestModelImplCopyWithImpl<
          _$UpdateTransactionRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdateTransactionRequestModelImplToJson(
      this,
    );
  }
}

abstract class _UpdateTransactionRequestModel
    implements UpdateTransactionRequestModel {
  const factory _UpdateTransactionRequestModel(
      {required final String id,
      final String? categoryId,
      final String? type,
      final double? amount,
      final String? description,
      final DateTime? date,
      final List<String>? tagIds}) = _$UpdateTransactionRequestModelImpl;

  factory _UpdateTransactionRequestModel.fromJson(Map<String, dynamic> json) =
      _$UpdateTransactionRequestModelImpl.fromJson;

  @override
  String get id;
  @override
  String? get categoryId;
  @override
  String? get type;
  @override
  double? get amount;
  @override
  String? get description;
  @override
  DateTime? get date;
  @override
  List<String>? get tagIds;

  /// Create a copy of UpdateTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdateTransactionRequestModelImplCopyWith<
          _$UpdateTransactionRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

DeleteTransactionRequestModel _$DeleteTransactionRequestModelFromJson(
    Map<String, dynamic> json) {
  return _DeleteTransactionRequestModel.fromJson(json);
}

/// @nodoc
mixin _$DeleteTransactionRequestModel {
  String get transactionId => throw _privateConstructorUsedError;

  /// Serializes this DeleteTransactionRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DeleteTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DeleteTransactionRequestModelCopyWith<DeleteTransactionRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeleteTransactionRequestModelCopyWith<$Res> {
  factory $DeleteTransactionRequestModelCopyWith(
          DeleteTransactionRequestModel value,
          $Res Function(DeleteTransactionRequestModel) then) =
      _$DeleteTransactionRequestModelCopyWithImpl<$Res,
          DeleteTransactionRequestModel>;
  @useResult
  $Res call({String transactionId});
}

/// @nodoc
class _$DeleteTransactionRequestModelCopyWithImpl<$Res,
        $Val extends DeleteTransactionRequestModel>
    implements $DeleteTransactionRequestModelCopyWith<$Res> {
  _$DeleteTransactionRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DeleteTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
  }) {
    return _then(_value.copyWith(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$DeleteTransactionRequestModelImplCopyWith<$Res>
    implements $DeleteTransactionRequestModelCopyWith<$Res> {
  factory _$$DeleteTransactionRequestModelImplCopyWith(
          _$DeleteTransactionRequestModelImpl value,
          $Res Function(_$DeleteTransactionRequestModelImpl) then) =
      __$$DeleteTransactionRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String transactionId});
}

/// @nodoc
class __$$DeleteTransactionRequestModelImplCopyWithImpl<$Res>
    extends _$DeleteTransactionRequestModelCopyWithImpl<$Res,
        _$DeleteTransactionRequestModelImpl>
    implements _$$DeleteTransactionRequestModelImplCopyWith<$Res> {
  __$$DeleteTransactionRequestModelImplCopyWithImpl(
      _$DeleteTransactionRequestModelImpl _value,
      $Res Function(_$DeleteTransactionRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of DeleteTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
  }) {
    return _then(_$DeleteTransactionRequestModelImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DeleteTransactionRequestModelImpl
    implements _DeleteTransactionRequestModel {
  const _$DeleteTransactionRequestModelImpl({required this.transactionId});

  factory _$DeleteTransactionRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$DeleteTransactionRequestModelImplFromJson(json);

  @override
  final String transactionId;

  @override
  String toString() {
    return 'DeleteTransactionRequestModel(transactionId: $transactionId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeleteTransactionRequestModelImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, transactionId);

  /// Create a copy of DeleteTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DeleteTransactionRequestModelImplCopyWith<
          _$DeleteTransactionRequestModelImpl>
      get copyWith => __$$DeleteTransactionRequestModelImplCopyWithImpl<
          _$DeleteTransactionRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DeleteTransactionRequestModelImplToJson(
      this,
    );
  }
}

abstract class _DeleteTransactionRequestModel
    implements DeleteTransactionRequestModel {
  const factory _DeleteTransactionRequestModel(
          {required final String transactionId}) =
      _$DeleteTransactionRequestModelImpl;

  factory _DeleteTransactionRequestModel.fromJson(Map<String, dynamic> json) =
      _$DeleteTransactionRequestModelImpl.fromJson;

  @override
  String get transactionId;

  /// Create a copy of DeleteTransactionRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DeleteTransactionRequestModelImplCopyWith<
          _$DeleteTransactionRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

AddTagRequestModel _$AddTagRequestModelFromJson(Map<String, dynamic> json) {
  return _AddTagRequestModel.fromJson(json);
}

/// @nodoc
mixin _$AddTagRequestModel {
  String get transactionId => throw _privateConstructorUsedError;
  String get tagId => throw _privateConstructorUsedError;

  /// Serializes this AddTagRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AddTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AddTagRequestModelCopyWith<AddTagRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AddTagRequestModelCopyWith<$Res> {
  factory $AddTagRequestModelCopyWith(
          AddTagRequestModel value, $Res Function(AddTagRequestModel) then) =
      _$AddTagRequestModelCopyWithImpl<$Res, AddTagRequestModel>;
  @useResult
  $Res call({String transactionId, String tagId});
}

/// @nodoc
class _$AddTagRequestModelCopyWithImpl<$Res, $Val extends AddTagRequestModel>
    implements $AddTagRequestModelCopyWith<$Res> {
  _$AddTagRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AddTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? tagId = null,
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
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AddTagRequestModelImplCopyWith<$Res>
    implements $AddTagRequestModelCopyWith<$Res> {
  factory _$$AddTagRequestModelImplCopyWith(_$AddTagRequestModelImpl value,
          $Res Function(_$AddTagRequestModelImpl) then) =
      __$$AddTagRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String transactionId, String tagId});
}

/// @nodoc
class __$$AddTagRequestModelImplCopyWithImpl<$Res>
    extends _$AddTagRequestModelCopyWithImpl<$Res, _$AddTagRequestModelImpl>
    implements _$$AddTagRequestModelImplCopyWith<$Res> {
  __$$AddTagRequestModelImplCopyWithImpl(_$AddTagRequestModelImpl _value,
      $Res Function(_$AddTagRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of AddTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? tagId = null,
  }) {
    return _then(_$AddTagRequestModelImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AddTagRequestModelImpl implements _AddTagRequestModel {
  const _$AddTagRequestModelImpl(
      {required this.transactionId, required this.tagId});

  factory _$AddTagRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$AddTagRequestModelImplFromJson(json);

  @override
  final String transactionId;
  @override
  final String tagId;

  @override
  String toString() {
    return 'AddTagRequestModel(transactionId: $transactionId, tagId: $tagId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AddTagRequestModelImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId) &&
            (identical(other.tagId, tagId) || other.tagId == tagId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, transactionId, tagId);

  /// Create a copy of AddTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AddTagRequestModelImplCopyWith<_$AddTagRequestModelImpl> get copyWith =>
      __$$AddTagRequestModelImplCopyWithImpl<_$AddTagRequestModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AddTagRequestModelImplToJson(
      this,
    );
  }
}

abstract class _AddTagRequestModel implements AddTagRequestModel {
  const factory _AddTagRequestModel(
      {required final String transactionId,
      required final String tagId}) = _$AddTagRequestModelImpl;

  factory _AddTagRequestModel.fromJson(Map<String, dynamic> json) =
      _$AddTagRequestModelImpl.fromJson;

  @override
  String get transactionId;
  @override
  String get tagId;

  /// Create a copy of AddTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AddTagRequestModelImplCopyWith<_$AddTagRequestModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RemoveTagRequestModel _$RemoveTagRequestModelFromJson(
    Map<String, dynamic> json) {
  return _RemoveTagRequestModel.fromJson(json);
}

/// @nodoc
mixin _$RemoveTagRequestModel {
  String get transactionId => throw _privateConstructorUsedError;
  String get tagId => throw _privateConstructorUsedError;

  /// Serializes this RemoveTagRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RemoveTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RemoveTagRequestModelCopyWith<RemoveTagRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RemoveTagRequestModelCopyWith<$Res> {
  factory $RemoveTagRequestModelCopyWith(RemoveTagRequestModel value,
          $Res Function(RemoveTagRequestModel) then) =
      _$RemoveTagRequestModelCopyWithImpl<$Res, RemoveTagRequestModel>;
  @useResult
  $Res call({String transactionId, String tagId});
}

/// @nodoc
class _$RemoveTagRequestModelCopyWithImpl<$Res,
        $Val extends RemoveTagRequestModel>
    implements $RemoveTagRequestModelCopyWith<$Res> {
  _$RemoveTagRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RemoveTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? tagId = null,
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
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RemoveTagRequestModelImplCopyWith<$Res>
    implements $RemoveTagRequestModelCopyWith<$Res> {
  factory _$$RemoveTagRequestModelImplCopyWith(
          _$RemoveTagRequestModelImpl value,
          $Res Function(_$RemoveTagRequestModelImpl) then) =
      __$$RemoveTagRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String transactionId, String tagId});
}

/// @nodoc
class __$$RemoveTagRequestModelImplCopyWithImpl<$Res>
    extends _$RemoveTagRequestModelCopyWithImpl<$Res,
        _$RemoveTagRequestModelImpl>
    implements _$$RemoveTagRequestModelImplCopyWith<$Res> {
  __$$RemoveTagRequestModelImplCopyWithImpl(_$RemoveTagRequestModelImpl _value,
      $Res Function(_$RemoveTagRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of RemoveTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? tagId = null,
  }) {
    return _then(_$RemoveTagRequestModelImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      tagId: null == tagId
          ? _value.tagId
          : tagId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RemoveTagRequestModelImpl implements _RemoveTagRequestModel {
  const _$RemoveTagRequestModelImpl(
      {required this.transactionId, required this.tagId});

  factory _$RemoveTagRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$RemoveTagRequestModelImplFromJson(json);

  @override
  final String transactionId;
  @override
  final String tagId;

  @override
  String toString() {
    return 'RemoveTagRequestModel(transactionId: $transactionId, tagId: $tagId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RemoveTagRequestModelImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId) &&
            (identical(other.tagId, tagId) || other.tagId == tagId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, transactionId, tagId);

  /// Create a copy of RemoveTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RemoveTagRequestModelImplCopyWith<_$RemoveTagRequestModelImpl>
      get copyWith => __$$RemoveTagRequestModelImplCopyWithImpl<
          _$RemoveTagRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RemoveTagRequestModelImplToJson(
      this,
    );
  }
}

abstract class _RemoveTagRequestModel implements RemoveTagRequestModel {
  const factory _RemoveTagRequestModel(
      {required final String transactionId,
      required final String tagId}) = _$RemoveTagRequestModelImpl;

  factory _RemoveTagRequestModel.fromJson(Map<String, dynamic> json) =
      _$RemoveTagRequestModelImpl.fromJson;

  @override
  String get transactionId;
  @override
  String get tagId;

  /// Create a copy of RemoveTagRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RemoveTagRequestModelImplCopyWith<_$RemoveTagRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTagsRequestModel _$GetTagsRequestModelFromJson(Map<String, dynamic> json) {
  return _GetTagsRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTagsRequestModel {
  String get transactionId => throw _privateConstructorUsedError;

  /// Serializes this GetTagsRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTagsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTagsRequestModelCopyWith<GetTagsRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTagsRequestModelCopyWith<$Res> {
  factory $GetTagsRequestModelCopyWith(
          GetTagsRequestModel value, $Res Function(GetTagsRequestModel) then) =
      _$GetTagsRequestModelCopyWithImpl<$Res, GetTagsRequestModel>;
  @useResult
  $Res call({String transactionId});
}

/// @nodoc
class _$GetTagsRequestModelCopyWithImpl<$Res, $Val extends GetTagsRequestModel>
    implements $GetTagsRequestModelCopyWith<$Res> {
  _$GetTagsRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTagsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
  }) {
    return _then(_value.copyWith(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTagsRequestModelImplCopyWith<$Res>
    implements $GetTagsRequestModelCopyWith<$Res> {
  factory _$$GetTagsRequestModelImplCopyWith(_$GetTagsRequestModelImpl value,
          $Res Function(_$GetTagsRequestModelImpl) then) =
      __$$GetTagsRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String transactionId});
}

/// @nodoc
class __$$GetTagsRequestModelImplCopyWithImpl<$Res>
    extends _$GetTagsRequestModelCopyWithImpl<$Res, _$GetTagsRequestModelImpl>
    implements _$$GetTagsRequestModelImplCopyWith<$Res> {
  __$$GetTagsRequestModelImplCopyWithImpl(_$GetTagsRequestModelImpl _value,
      $Res Function(_$GetTagsRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTagsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
  }) {
    return _then(_$GetTagsRequestModelImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTagsRequestModelImpl implements _GetTagsRequestModel {
  const _$GetTagsRequestModelImpl({required this.transactionId});

  factory _$GetTagsRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GetTagsRequestModelImplFromJson(json);

  @override
  final String transactionId;

  @override
  String toString() {
    return 'GetTagsRequestModel(transactionId: $transactionId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTagsRequestModelImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, transactionId);

  /// Create a copy of GetTagsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTagsRequestModelImplCopyWith<_$GetTagsRequestModelImpl> get copyWith =>
      __$$GetTagsRequestModelImplCopyWithImpl<_$GetTagsRequestModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTagsRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTagsRequestModel implements GetTagsRequestModel {
  const factory _GetTagsRequestModel({required final String transactionId}) =
      _$GetTagsRequestModelImpl;

  factory _GetTagsRequestModel.fromJson(Map<String, dynamic> json) =
      _$GetTagsRequestModelImpl.fromJson;

  @override
  String get transactionId;

  /// Create a copy of GetTagsRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTagsRequestModelImplCopyWith<_$GetTagsRequestModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
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

GetTotalExpensesRequestModel _$GetTotalExpensesRequestModelFromJson(
    Map<String, dynamic> json) {
  return _GetTotalExpensesRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTotalExpensesRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  DateTime get startDate => throw _privateConstructorUsedError;
  DateTime get endDate => throw _privateConstructorUsedError;

  /// Serializes this GetTotalExpensesRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTotalExpensesRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTotalExpensesRequestModelCopyWith<GetTotalExpensesRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTotalExpensesRequestModelCopyWith<$Res> {
  factory $GetTotalExpensesRequestModelCopyWith(
          GetTotalExpensesRequestModel value,
          $Res Function(GetTotalExpensesRequestModel) then) =
      _$GetTotalExpensesRequestModelCopyWithImpl<$Res,
          GetTotalExpensesRequestModel>;
  @useResult
  $Res call({String profileId, DateTime startDate, DateTime endDate});
}

/// @nodoc
class _$GetTotalExpensesRequestModelCopyWithImpl<$Res,
        $Val extends GetTotalExpensesRequestModel>
    implements $GetTotalExpensesRequestModelCopyWith<$Res> {
  _$GetTotalExpensesRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTotalExpensesRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? startDate = null,
    Object? endDate = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTotalExpensesRequestModelImplCopyWith<$Res>
    implements $GetTotalExpensesRequestModelCopyWith<$Res> {
  factory _$$GetTotalExpensesRequestModelImplCopyWith(
          _$GetTotalExpensesRequestModelImpl value,
          $Res Function(_$GetTotalExpensesRequestModelImpl) then) =
      __$$GetTotalExpensesRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId, DateTime startDate, DateTime endDate});
}

/// @nodoc
class __$$GetTotalExpensesRequestModelImplCopyWithImpl<$Res>
    extends _$GetTotalExpensesRequestModelCopyWithImpl<$Res,
        _$GetTotalExpensesRequestModelImpl>
    implements _$$GetTotalExpensesRequestModelImplCopyWith<$Res> {
  __$$GetTotalExpensesRequestModelImplCopyWithImpl(
      _$GetTotalExpensesRequestModelImpl _value,
      $Res Function(_$GetTotalExpensesRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTotalExpensesRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? startDate = null,
    Object? endDate = null,
  }) {
    return _then(_$GetTotalExpensesRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTotalExpensesRequestModelImpl
    implements _GetTotalExpensesRequestModel {
  const _$GetTotalExpensesRequestModelImpl(
      {required this.profileId,
      required this.startDate,
      required this.endDate});

  factory _$GetTotalExpensesRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTotalExpensesRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  final DateTime startDate;
  @override
  final DateTime endDate;

  @override
  String toString() {
    return 'GetTotalExpensesRequestModel(profileId: $profileId, startDate: $startDate, endDate: $endDate)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTotalExpensesRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId, startDate, endDate);

  /// Create a copy of GetTotalExpensesRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTotalExpensesRequestModelImplCopyWith<
          _$GetTotalExpensesRequestModelImpl>
      get copyWith => __$$GetTotalExpensesRequestModelImplCopyWithImpl<
          _$GetTotalExpensesRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTotalExpensesRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTotalExpensesRequestModel
    implements GetTotalExpensesRequestModel {
  const factory _GetTotalExpensesRequestModel(
      {required final String profileId,
      required final DateTime startDate,
      required final DateTime endDate}) = _$GetTotalExpensesRequestModelImpl;

  factory _GetTotalExpensesRequestModel.fromJson(Map<String, dynamic> json) =
      _$GetTotalExpensesRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  DateTime get startDate;
  @override
  DateTime get endDate;

  /// Create a copy of GetTotalExpensesRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTotalExpensesRequestModelImplCopyWith<
          _$GetTotalExpensesRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

GetTotalIncomeRequestModel _$GetTotalIncomeRequestModelFromJson(
    Map<String, dynamic> json) {
  return _GetTotalIncomeRequestModel.fromJson(json);
}

/// @nodoc
mixin _$GetTotalIncomeRequestModel {
  String get profileId => throw _privateConstructorUsedError;
  DateTime get startDate => throw _privateConstructorUsedError;
  DateTime get endDate => throw _privateConstructorUsedError;

  /// Serializes this GetTotalIncomeRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GetTotalIncomeRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GetTotalIncomeRequestModelCopyWith<GetTotalIncomeRequestModel>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GetTotalIncomeRequestModelCopyWith<$Res> {
  factory $GetTotalIncomeRequestModelCopyWith(GetTotalIncomeRequestModel value,
          $Res Function(GetTotalIncomeRequestModel) then) =
      _$GetTotalIncomeRequestModelCopyWithImpl<$Res,
          GetTotalIncomeRequestModel>;
  @useResult
  $Res call({String profileId, DateTime startDate, DateTime endDate});
}

/// @nodoc
class _$GetTotalIncomeRequestModelCopyWithImpl<$Res,
        $Val extends GetTotalIncomeRequestModel>
    implements $GetTotalIncomeRequestModelCopyWith<$Res> {
  _$GetTotalIncomeRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GetTotalIncomeRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? startDate = null,
    Object? endDate = null,
  }) {
    return _then(_value.copyWith(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GetTotalIncomeRequestModelImplCopyWith<$Res>
    implements $GetTotalIncomeRequestModelCopyWith<$Res> {
  factory _$$GetTotalIncomeRequestModelImplCopyWith(
          _$GetTotalIncomeRequestModelImpl value,
          $Res Function(_$GetTotalIncomeRequestModelImpl) then) =
      __$$GetTotalIncomeRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String profileId, DateTime startDate, DateTime endDate});
}

/// @nodoc
class __$$GetTotalIncomeRequestModelImplCopyWithImpl<$Res>
    extends _$GetTotalIncomeRequestModelCopyWithImpl<$Res,
        _$GetTotalIncomeRequestModelImpl>
    implements _$$GetTotalIncomeRequestModelImplCopyWith<$Res> {
  __$$GetTotalIncomeRequestModelImplCopyWithImpl(
      _$GetTotalIncomeRequestModelImpl _value,
      $Res Function(_$GetTotalIncomeRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GetTotalIncomeRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? profileId = null,
    Object? startDate = null,
    Object? endDate = null,
  }) {
    return _then(_$GetTotalIncomeRequestModelImpl(
      profileId: null == profileId
          ? _value.profileId
          : profileId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GetTotalIncomeRequestModelImpl implements _GetTotalIncomeRequestModel {
  const _$GetTotalIncomeRequestModelImpl(
      {required this.profileId,
      required this.startDate,
      required this.endDate});

  factory _$GetTotalIncomeRequestModelImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$GetTotalIncomeRequestModelImplFromJson(json);

  @override
  final String profileId;
  @override
  final DateTime startDate;
  @override
  final DateTime endDate;

  @override
  String toString() {
    return 'GetTotalIncomeRequestModel(profileId: $profileId, startDate: $startDate, endDate: $endDate)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetTotalIncomeRequestModelImpl &&
            (identical(other.profileId, profileId) ||
                other.profileId == profileId) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileId, startDate, endDate);

  /// Create a copy of GetTotalIncomeRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GetTotalIncomeRequestModelImplCopyWith<_$GetTotalIncomeRequestModelImpl>
      get copyWith => __$$GetTotalIncomeRequestModelImplCopyWithImpl<
          _$GetTotalIncomeRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GetTotalIncomeRequestModelImplToJson(
      this,
    );
  }
}

abstract class _GetTotalIncomeRequestModel
    implements GetTotalIncomeRequestModel {
  const factory _GetTotalIncomeRequestModel(
      {required final String profileId,
      required final DateTime startDate,
      required final DateTime endDate}) = _$GetTotalIncomeRequestModelImpl;

  factory _GetTotalIncomeRequestModel.fromJson(Map<String, dynamic> json) =
      _$GetTotalIncomeRequestModelImpl.fromJson;

  @override
  String get profileId;
  @override
  DateTime get startDate;
  @override
  DateTime get endDate;

  /// Create a copy of GetTotalIncomeRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GetTotalIncomeRequestModelImplCopyWith<_$GetTotalIncomeRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}
