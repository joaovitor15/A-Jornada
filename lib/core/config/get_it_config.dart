import 'package:get_it/get_it.dart';
import '../utils/logger.dart';

final getIt = GetIt.instance;

class GetItConfig {
  static Future<void> setupServiceLocator() async {
    try {
      // Logger (Singleton)
      getIt.registerSingleton<AppLogger>(
        AppLogger(),
      );

      logger.info('ServiceLocator setup completed');
    } catch (e, st) {
      logger.error('Failed to setup ServiceLocator', err: e, stackTrace: st);
      rethrow;
    }
  }
}