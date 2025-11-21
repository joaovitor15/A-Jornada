import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/services/analytics/analytics_service.dart';
import 'package:myapp/core/services/permissions/permission_service.dart';
import 'package:myapp/core/services/notifications/notification_service.dart';

// ============ ANALYTICS ============

final analyticsServiceProvider = Provider<AnalyticsService>((ref) {
  return AnalyticsServiceImpl(
    firebaseAnalytics: FirebaseAnalytics.instance,
  );
});

// ============ PERMISSIONS ============

final permissionServiceProvider = Provider<PermissionService>((ref) {
  return PermissionServiceImpl();
});

// ============ NOTIFICATIONS ============

final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationServiceImpl(
    firebaseMessaging: FirebaseMessaging.instance,
  );
});