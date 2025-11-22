import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/config/environment.dart';
import 'package:myapp/core/config/get_it_config.dart';
import 'package:myapp/core/config/app_initialization.dart';
import 'package:myapp/core/config/app_router.dart';
import 'package:myapp/core/config/supabase_config.dart';
import 'package:myapp/shared/themes/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1️⃣ Carregar .env
  await Environment.init();

  // 2️⃣ Inicializar GetIt (DI)
  setupGetIt();

  // 3️⃣ Inicializar Supabase
  await SupabaseConfig.init();

  // 4️⃣ Inicializar Hive + Cache + Notifications
  await AppInitialization.initialize();

  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Controle Financeiro',
      routerConfig: router,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.light,
    );
  }
}