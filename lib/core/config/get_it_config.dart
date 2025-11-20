import 'package:get_it/get_it.dart';
import 'package:myapp/core/network/dio_client.dart';
import 'package:myapp/core/utils/logger.dart';

final getIt = GetIt.instance;

void setupGetIt() {
  // Network
  getIt.registerSingleton<DioClient>(
    DioClient(),
  );

  // Logger
  getIt.registerSingleton<Logger>(
    Logger(),
  );
}