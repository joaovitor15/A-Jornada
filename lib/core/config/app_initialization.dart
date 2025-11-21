import 'package:firebase_messaging/firebase_messaging.dart';
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

      // 3. Firebase Messaging (Notifications)
      await _initializeFirebaseMessaging();

      logger.info('✅ App initialization complete');
    } catch (e, st) {
      logger.error('❌ App initialization failed', err: e, stackTrace: st);
      rethrow;
    }
  }

  /// Inicializar Firebase Messaging
  static Future<void> _initializeFirebaseMessaging() async {
    try {
      final messaging = FirebaseMessaging.instance;

      // Request permission
      await messaging.requestPermission();

      // Get token
      final token = await messaging.getToken();
      logger.info('🔑 FCM Token obtained: ${token?.substring(0, 20)}...');

      logger.info('✅ Firebase Messaging initialized');
    } catch (e, st) {
      logger.error('❌ Firebase Messaging initialization failed', err: e, stackTrace: st);
    }
  }
}