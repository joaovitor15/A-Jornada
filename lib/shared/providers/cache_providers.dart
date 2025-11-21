import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/local_storage/cache_datasource.dart';
import 'package:myapp/core/local_storage/cache_datasource_impl.dart';

/// ✅ Provider para CacheDataSource (Singleton)
final cacheDataSourceProvider = Provider<CacheDataSource>((ref) {
  return CacheDataSourceImpl();
});