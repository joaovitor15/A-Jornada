import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../utils/logger.dart';

class Environment {
  static late final String _supabaseUrl;
  static late final String _supabaseAnonKey;
  static late final String _supabaseServiceRoleKey;

  static bool _isInitialized = false;

  static Future<void> init() async {
    try {
      await dotenv.load(fileName: '.env');
      
      _supabaseUrl = dotenv.env['SUPABASE_URL'] ?? '';
      _supabaseAnonKey = dotenv.env['SUPABASE_ANON_KEY'] ?? '';
      _supabaseServiceRoleKey = dotenv.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

      _validateEnvironment();
      _isInitialized = true;
      
      logger.info('Environment loaded successfully');
    } catch (e, st) {
      logger.error('Failed to load environment', err: e, stackTrace: st);
      rethrow;
    }
  }

  static void _validateEnvironment() {
    if (_supabaseUrl.isEmpty) {
      throw Exception('SUPABASE_URL not found in .env');
    }
    if (_supabaseAnonKey.isEmpty) {
      throw Exception('SUPABASE_ANON_KEY not found in .env');
    }
    if (_supabaseServiceRoleKey.isEmpty) {
      throw Exception('SUPABASE_SERVICE_ROLE_KEY not found in .env');
    }
  }

  static String get supabaseUrl {
    _ensureInitialized();
    return _supabaseUrl;
  }

  static String get supabaseAnonKey {
    _ensureInitialized();
    return _supabaseAnonKey;
  }

  static String get supabaseServiceRoleKey {
    _ensureInitialized();
    return _supabaseServiceRoleKey;
  }

  static void _ensureInitialized() {
    if (!_isInitialized) {
      throw Exception('Environment not initialized. Call Environment.init() first.');
    }
  }
}