import 'package:get_it/get_it.dart';
import 'package:myapp/core/network/dio_client.dart';
import 'package:myapp/core/utils/logger.dart';

final getIt = GetIt.instance;

void setupGetIt() {
  // ==================== CORE ====================

  /// Network Client
  getIt.registerSingleton<DioClient>(
    DioClient(),
  );

  /// Logger
  getIt.registerSingleton<Logger>(
    Logger(),
  );

  // ==================== DATA SOURCES ====================
  // TODO: Serão implementadas com Supabase Studio
  // Auth, Category, Transaction, Tag RemoteDataSource

  // ==================== REPOSITORIES ====================
  // TODO: Serão registradas quando DataSources forem implementadas
  // Auth, Category, Transaction, Tag Repository
}