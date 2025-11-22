import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/config/environment.dart';
import '../utils/logger.dart';
import 'interceptors.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();

  late final Dio _dio;
  String? _currentAuthToken;

  factory DioClient() {
    return _instance;
  }

  DioClient._internal() {
    _setupDio();
  }

  void _setupDio() {
    _dio = Dio(
      BaseOptions(
        baseUrl: '${Environment.supabaseUrl}/rest/v1',
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        sendTimeout: const Duration(seconds: 30),
        validateStatus: (status) {
          return status != null && status < 500;
        },
        headers: {
          'Content-Type': 'application/json',
          'apikey': Environment.supabaseAnonKey,
        },
      ),
    );

    // ✅ Add interceptors (ordem importa!)
    _dio.interceptors.add(LoggingInterceptor());
    _dio.interceptors.add(ErrorInterceptor());
    // ✅ AuthInterceptor será adicionado no PASSO 1.5
  }

  /// ✅ NOVO: Setter para atualizar token dinamicamente
  void setAuthToken(String? token) {
    _currentAuthToken = token;
    logger.info('🔐 DioClient: Auth token atualizado');
  }

  /// ✅ NOVO: Getter para obter token atual
  String? getAuthToken() => _currentAuthToken;

  Dio get dio => _dio;

  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
      );
      return response.data as T;
    } on DioException catch (e) {
      _handleDioException(e);
      rethrow;
    }
  }

  Future<T> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return response.data as T;
    } on DioException catch (e) {
      _handleDioException(e);
      rethrow;
    }
  }

  Future<T> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return response.data as T;
    } on DioException catch (e) {
      _handleDioException(e);
      rethrow;
    }
  }

  Future<T> delete<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        queryParameters: queryParameters,
      );
      return response.data as T;
    } on DioException catch (e) {
      _handleDioException(e);
      rethrow;
    }
  }

  Future<T> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.patch(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return response.data as T;
    } on DioException catch (e) {
      _handleDioException(e);
      rethrow;
    }
  }

  void _handleDioException(DioException e) {
    logger.error('Dio exception: ${e.message}', err: e);
  }
}

/// ✅ Provider para DioClient (Singleton)
final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient();
});

/// ✅ Para testes e uso manual
final dioClient = DioClient();