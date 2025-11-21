import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:myapp/core/utils/logger.dart';

abstract class NotificationService {
  Future<void> initialize();
  Future<String?> getToken();
  Future<void> requestPermission();
  Future<void> subscribeToTopic(String topic);
  Future<void> unsubscribeFromTopic(String topic);
}

class NotificationServiceImpl implements NotificationService {
  final FirebaseMessaging _firebaseMessaging;

  NotificationServiceImpl({required FirebaseMessaging firebaseMessaging})
      : _firebaseMessaging = firebaseMessaging;

  @override
  Future<void> initialize() async {
    try {
      // Handle foreground messages
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        logger.info('📬 Foreground message: ${message.notification?.title}');
        _handleMessage(message);
      });

      // Handle background messages
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        logger.info(
            '📭 Background message opened: ${message.notification?.title}');
        _handleMessage(message);
      });

      logger.info('✅ Notification service initialized');
    } catch (e, st) {
      logger.error('❌ Failed to initialize notification service',
          err: e, stackTrace: st);
    }
  }

  @override
  Future<String?> getToken() async {
    try {
      final token = await _firebaseMessaging.getToken();
      logger.info('🔑 FCM Token: ${token?.substring(0, 20)}...');
      return token;
    } catch (e, st) {
      logger.error('❌ Failed to get FCM token', err: e, stackTrace: st);
      return null;
    }
  }

  @override
  Future<void> requestPermission() async {
    try {
      final settings = await _firebaseMessaging.requestPermission();
      final status = settings.authorizationStatus.name;
      logger.info('🔔 Notification permission: $status');
    } catch (e, st) {
      logger.error('❌ Failed to request notification permission',
          err: e, stackTrace: st);
    }
  }

  @override
  Future<void> subscribeToTopic(String topic) async {
    try {
      await _firebaseMessaging.subscribeToTopic(topic);
      logger.info('📢 Subscribed to topic: $topic');
    } catch (e, st) {
      logger.error('❌ Failed to subscribe to topic: $topic',
          err: e, stackTrace: st);
    }
  }

  @override
  Future<void> unsubscribeFromTopic(String topic) async {
    try {
      await _firebaseMessaging.unsubscribeFromTopic(topic);
      logger.info('🔇 Unsubscribed from topic: $topic');
    } catch (e, st) {
      logger.error('❌ Failed to unsubscribe from topic: $topic',
          err: e, stackTrace: st);
    }
  }

  void _handleMessage(RemoteMessage message) {
    logger.info('📨 Handling message: ${message.notification?.body}');
    // TODO: Implementar lógica de navegação baseada no tipo de mensagem
  }
}
