import 'package:hive_flutter/hive_flutter.dart';
import 'cache_datasource.dart';
import '../utils/logger.dart';

class CacheDataSourceImpl implements CacheDataSource {
  static const String _defaultBoxName = 'app_cache';
  
  late Box<dynamic> _box;

  /// Inicializar
  Future<void> init() async {
    try {
      if (Hive.isBoxOpen(_defaultBoxName)) {
        _box = Hive.box<dynamic>(_defaultBoxName);
      } else {
        _box = await Hive.openBox<dynamic>(_defaultBoxName);
      }
      logger.info('✅ CacheDataSource initialized');
    } catch (e, st) {
      logger.error('❌ CacheDataSource init failed', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<void> saveData<T>(String key, T value) async {
    try {
      await _box.put(key, value);
      logger.info('💾 Saved to cache: $key');
    } catch (e, st) {
      logger.error('❌ Failed to save cache: $key', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<T?> getData<T>(String key) async {
    try {
      final data = _box.get(key);
      if (data != null) {
        logger.info('📖 Retrieved from cache: $key');
      }
      return data as T?;
    } catch (e, st) {
      logger.error('❌ Failed to get cache: $key', err: e, stackTrace: st);
      return null;
    }
  }

  @override
  Future<void> deleteData(String key) async {
    try {
      await _box.delete(key);
      logger.info('🗑️ Deleted from cache: $key');
    } catch (e, st) {
      logger.error('❌ Failed to delete cache: $key', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<void> clearAll() async {
    try {
      await _box.clear();
      logger.info('🧹 Cache cleared');
    } catch (e, st) {
      logger.error('❌ Failed to clear cache', err: e, stackTrace: st);
      rethrow;
    }
  }

  @override
  Future<bool> hasKey(String key) async {
    try {
      return _box.containsKey(key);
    } catch (e) {
      return false;
    }
  }
}