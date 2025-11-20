import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/config/environment.dart';
import 'package:myapp/core/config/supabase_config.dart';
import 'package:myapp/core/config/get_it_config.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/shared/themes/app_theme.dart';
import 'package:myapp/shared/providers/riverpod_observer.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    // 1. Load environment variables
    await Environment.init();
    logger.info('Environment initialized');

    // 2. Initialize Supabase
    await SupabaseConfig.init();
    logger.info('Supabase initialized');

    // 3. Setup dependency injection
    setupGetIt();
    logger.info('GetIt setup completed');

    // 4. Run app
    runApp(
      ProviderScope(
        observers: [RiverpodObserver()],
        child: const MyApp(),
      ),
    );
  } catch (e, st) {
    logger.error('Failed to initialize app', err: e, stackTrace: st);
    rethrow;
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Controle Financeiro',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Controle Financeiro'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Foundation + 3 Críticos completos! 🎉',
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              const SizedBox(height: 16),
              Text(
                'Pronto para Auth Feature',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ],
          ),
        ),
      ),
    );
  }
}