import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';
import '../utils/logger.dart';

class HiveConfig {
  static Future<void> init() async {
    try {
      final appDocDir = await getApplicationDocumentsDirectory();
      await Hive.initFlutter(appDocDir.path);

      // Registrar adapters aqui quando criados
      // Hive.registerAdapter(AuthModelAdapter());

      logger.info('✅ Hive initialized successfully');
    } catch (e, st) {
      logger.error('❌ Hive initialization failed', err: e, stackTrace: st);
      rethrow;
    }
  }

  /// Abrir box com tipo genérico
  static Future<Box<T>> openBox<T>(String boxName) async {
    try {
      if (Hive.isBoxOpen(boxName)) {
        return Hive.box<T>(boxName);
      }
      return await Hive.openBox<T>(boxName);
    } catch (e, st) {
      logger.error('❌ Failed to open box: $boxName', err: e, stackTrace: st);
      rethrow;
    }
  }

  /// Fechar box
  static Future<void> closeBox(String boxName) async {
    try {
      if (Hive.isBoxOpen(boxName)) {
        await Hive.box(boxName).close();
      }
    } catch (e, st) {
      logger.error('❌ Failed to close box: $boxName', err: e, stackTrace: st);
    }
  }

  /// Limpar tudo (logout)
  static Future<void> clear() async {
    try {
      await Hive.deleteFromDisk();
      logger.info('✅ Hive cleared');
    } catch (e, st) {
      logger.error('❌ Failed to clear Hive', err: e, stackTrace: st);
    }
  }
}