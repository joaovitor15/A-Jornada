import 'package:permission_handler/permission_handler.dart';
import 'package:myapp/core/utils/logger.dart';

abstract class PermissionService {
  Future<bool> requestCamera();
  Future<bool> requestGallery();
  Future<bool> requestLocation();
  Future<bool> requestNotifications();
  Future<bool> checkPermission(Permission permission);
  Future<void> openSettings();
}

class PermissionServiceImpl implements PermissionService {
  @override
  Future<bool> requestCamera() async {
    try {
      final status = await Permission.camera.request();
      logger.info('📷 Camera permission: ${status.isDenied ? 'denied' : status.isGranted ? 'granted' : 'restricted'}');
      return status.isGranted;
    } catch (e, st) {
      logger.error('❌ Failed to request camera permission', err: e, stackTrace: st);
      return false;
    }
  }

  @override
  Future<bool> requestGallery() async {
    try {
      final status = await Permission.photos.request();
      logger.info('🖼️ Gallery permission: ${status.isDenied ? 'denied' : status.isGranted ? 'granted' : 'restricted'}');
      return status.isGranted;
    } catch (e, st) {
      logger.error('❌ Failed to request gallery permission', err: e, stackTrace: st);
      return false;
    }
  }

  @override
  Future<bool> requestLocation() async {
    try {
      final status = await Permission.location.request();
      logger.info('📍 Location permission: ${status.isDenied ? 'denied' : status.isGranted ? 'granted' : 'restricted'}');
      return status.isGranted;
    } catch (e, st) {
      logger.error('❌ Failed to request location permission', err: e, stackTrace: st);
      return false;
    }
  }

  @override
  Future<bool> requestNotifications() async {
    try {
      final status = await Permission.notification.request();
      logger.info('🔔 Notification permission: ${status.isDenied ? 'denied' : status.isGranted ? 'granted' : 'restricted'}');
      return status.isGranted;
    } catch (e, st) {
      logger.error('❌ Failed to request notification permission', err: e, stackTrace: st);
      return false;
    }
  }

  @override
  Future<bool> checkPermission(Permission permission) async {
    try {
      final status = await permission.status;
      logger.info('✅ Permission check: ${status.isDenied ? 'denied' : status.isGranted ? 'granted' : 'restricted'}');
      return status.isGranted;
    } catch (e, st) {
      logger.error('❌ Failed to check permission', err: e, stackTrace: st);
      return false;
    }
  }

  @override
  Future<void> openSettings() async {
    try {
      await openAppSettings();
      logger.info('⚙️ App settings opened');
    } catch (e, st) {
      logger.error('❌ Failed to open app settings', err: e, stackTrace: st);
    }
  }
}