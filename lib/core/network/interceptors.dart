import 'package:dio/dio.dart';
import '../utils/logger.dart';
import '../exceptions/network_exception.dart';

class LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    logger.info(
      'Request: ${options.method} ${options.path}',
    );
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    logger.info(
      'Response: ${response.statusCode} ${response.requestOptions.path}',
    );
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    logger.error(
      'Error: ${err.message}',
      err: err,
    );
    handler.next(err);
  }
}

class ErrorInterceptor extends Interceptor {
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (response.statusCode == null) {
      handler.reject(
        DioException(
          requestOptions: response.requestOptions,
          error: NetworkException.unknown(),
        ),
      );
      return;
    }

    if (response.statusCode! >= 400) {
      final exception = _handleStatusCode(response.statusCode!);
      handler.reject(
        DioException(
          requestOptions: response.requestOptions,
          error: exception,
        ),
      );
      return;
    }

    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final exception = _handleDioError(err);
    handler.reject(
      DioException(
        requestOptions: err.requestOptions,
        error: exception,
      ),
    );
  }

  NetworkException _handleStatusCode(int statusCode) {
    switch (statusCode) {
      case 400:
        return NetworkException.badRequest();
      case 401:
        return NetworkException.unauthorized();
      case 403:
        return NetworkException.forbidden();
      case 404:
        return NetworkException.notFound();
      case 500:
      case 502:
      case 503:
        return NetworkException.serverError();
      default:
        return NetworkException.unknown(message: 'Status: $statusCode');
    }
  }

  NetworkException _handleDioError(DioException err) {
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkException.timeout();
      case DioExceptionType.connectionError:
        return NetworkException.noConnection();
      case DioExceptionType.badResponse:
        return NetworkException.badRequest();
      case DioExceptionType.cancel:
        return NetworkException.unknown(message: 'Request cancelled');
      case DioExceptionType.unknown:
        return NetworkException.unknown(message: err.message);
      default:
        return NetworkException.unknown(message: err.message);
    }
  }
}