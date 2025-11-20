import 'package:get_it/get_it.dart';
import '../utils/logger.dart';
import '../network/dio_client.dart';

final getIt = GetIt.instance;

class GetItConfig {
  static Future<void> setupServiceLocator() async {
    try {
      // Logger (Singleton)
      getIt.registerSingleton<AppLogger>(
        AppLogger(),
      );

      // DioClient (Singleton)
      getIt.registerSingleton<DioClient>(
        DioClient(),
      );

      logger.info('ServiceLocator setup completed');
    } catch (e, st) {
      logger.error('Failed to setup ServiceLocator', err: e, stackTrace: st);
      rethrow;
    }
  }
}