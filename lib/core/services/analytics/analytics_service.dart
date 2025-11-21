import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:myapp/core/utils/logger.dart';

abstract class AnalyticsService {
  Future<void> logEvent(String name, Map<String, Object>? parameters);
  Future<void> logScreen(String screenName);
  Future<void> logError(String error, String? code);
  Future<void> setUserId(String userId);
  Future<void> clearUserId();
}

class AnalyticsServiceImpl implements AnalyticsService {
  final FirebaseAnalytics _firebaseAnalytics;

  AnalyticsServiceImpl({required FirebaseAnalytics firebaseAnalytics})
      : _firebaseAnalytics = firebaseAnalytics;

  @override
  Future<void> logEvent(String name, Map<String, Object>? parameters) async {
    try {
      await _firebaseAnalytics.logEvent(
        name: name,
        parameters: parameters,
      );
      logger.info('📊 Analytics event logged: $name');
    } catch (e, st) {
      logger.error('❌ Failed to log analytics event: $name', err: e, stackTrace: st);
    }
  }

  @override
  Future<void> logScreen(String screenName) async {
    try {
      await _firebaseAnalytics.logScreenView(screenName: screenName);
      logger.info('📱 Analytics screen logged: $screenName');
    } catch (e, st) {
      logger.error('❌ Failed to log screen: $screenName', err: e, stackTrace: st);
    }
  }

  @override
  Future<void> logError(String error, String? code) async {
    try {
      await _firebaseAnalytics.logEvent(
        name: 'app_error',
        parameters: {
          'error_message': error,
          'error_code': code ?? 'unknown',
        },
      );
      logger.info('❌ Analytics error logged: $error');
    } catch (e, st) {
      logger.error('❌ Failed to log error to analytics', err: e, stackTrace: st);
    }
  }

  @override
  Future<void> setUserId(String userId) async {
    try {
      await _firebaseAnalytics.setUserId(id: userId);
      logger.info('👤 Analytics userId set: $userId');
    } catch (e, st) {
      logger.error('❌ Failed to set userId', err: e, stackTrace: st);
    }
  }

  @override
  Future<void> clearUserId() async {
    try {
      await _firebaseAnalytics.setUserId(id: null);
      logger.info('👤 Analytics userId cleared');
    } catch (e, st) {
      logger.error('❌ Failed to clear userId', err: e, stackTrace: st);
    }
  }
}