import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/config/environment.dart';
import 'core/config/supabase_config.dart';
import 'core/config/get_it_config.dart';
import 'core/utils/logger.dart';
import 'shared/themes/app_theme.dart';

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
    await GetItConfig.setupServiceLocator();
    logger.info('GetIt setup completed');

    // 4. Run app
    runApp(
      ProviderScope(
        child: MyApp(),
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
          title: Text('Controle Financeiro'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Foundation completo! 🎉',
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              SizedBox(height: 16),
              Text(
                'Pronto para começar com Features',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ],
          ),
        ),
      ),
    );
  }
}