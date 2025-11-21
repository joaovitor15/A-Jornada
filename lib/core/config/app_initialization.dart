import 'package:myapp/core/local_storage/hive_config.dart';
import 'package:myapp/core/local_storage/cache_datasource_impl.dart';
import 'package:myapp/core/utils/logger.dart';

class AppInitialization {
  /// Inicializar toda a infraestrutura da app
  static Future<void> initialize() async {
    try {
      logger.info('🚀 Starting app initialization...');

      // 1. Hive
      await HiveConfig.init();

      // 2. Cache DataSource
      final cacheDataSource = CacheDataSourceImpl();
      await cacheDataSource.init();

      logger.info('✅ App initialization complete');
    } catch (e, st) {
      logger.error('❌ App initialization failed', err: e, stackTrace: st);
      rethrow;
    }
  }
}