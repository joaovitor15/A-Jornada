import 'package:dio/dio.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/core/exceptions/app_network_exception.dart';

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
          error: AppNetworkException(
            message: 'Status de resposta nulo',
            code: 'NULL_STATUS',
          ),
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

  AppNetworkException _handleStatusCode(int statusCode) {
    switch (statusCode) {
      case 400:
        return AppNetworkException(
          message: 'Requisição inválida',
          code: 'BAD_REQUEST',
        );
      case 401:
        return AppNetworkException(
          message: 'Não autorizado',
          code: 'UNAUTHORIZED',
        );
      case 403:
        return AppNetworkException(
          message: 'Acesso proibido',
          code: 'FORBIDDEN',
        );
      case 404:
        return AppNetworkException(
          message: 'Recurso não encontrado',
          code: 'NOT_FOUND',
        );
      case 500:
      case 502:
      case 503:
        return AppNetworkException(
          message: 'Erro no servidor',
          code: 'SERVER_ERROR',
        );
      default:
        return AppNetworkException(
          message: 'Erro desconhecido - Status: $statusCode',
          code: 'UNKNOWN',
        );
    }
  }

  AppNetworkException _handleDioError(DioException err) {
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return AppNetworkException(
          message: 'Tempo de conexão expirado',
          code: 'TIMEOUT',
        );
      case DioExceptionType.connectionError:
        return AppNetworkException(
          message: 'Sem conexão com a internet',
          code: 'NO_CONNECTION',
        );
      case DioExceptionType.badResponse:
        return AppNetworkException(
          message: 'Resposta inválida do servidor',
          code: 'BAD_RESPONSE',
        );
      case DioExceptionType.cancel:
        return AppNetworkException(
          message: 'Requisição cancelada',
          code: 'CANCELLED',
        );
      case DioExceptionType.unknown:
        return AppNetworkException(
          message: err.message ?? 'Erro desconhecido',
          code: 'UNKNOWN',
        );
      default:
        return AppNetworkException(
          message: err.message ?? 'Erro desconhecido',
          code: 'UNKNOWN',
        );
    }
  }
}