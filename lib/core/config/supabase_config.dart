import 'package:supabase_flutter/supabase_flutter.dart';
import 'environment.dart';
import '../utils/logger.dart';

class SupabaseConfig {
  static bool _isInitialized = false;

  static Future<void> init() async {
    try {
      await Supabase.initialize(
        url: Environment.supabaseUrl,
        anonKey: Environment.supabaseAnonKey,
      );

      _isInitialized = true;
      logger.info('Supabase initialized successfully');
    } catch (e, st) {
      logger.error('Failed to initialize Supabase', err: e, stackTrace: st);
      rethrow;
    }
  }

  static SupabaseClient get client {
    _ensureInitialized();
    return Supabase.instance.client;
  }

  static Future<List<Map<String, dynamic>>> fetchFromTable(String table) async {
    try {
      final response = await client.from(table).select();
      logger.info('Fetched from $table successfully');
      return response;
    } catch (e, st) {
      logger.error('Error fetching from $table', err: e, stackTrace: st);
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> insertIntoTable(
    String table,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await client.from(table).insert(data).select().single();
      logger.info('Inserted into $table successfully');
      return response;
    } catch (e, st) {
      logger.error('Error inserting into $table', err: e, stackTrace: st);
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> updateInTable(
    String table,
    Map<String, dynamic> data,
    String id,
  ) async {
    try {
      final response = await client
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single();
      logger.info('Updated $table successfully');
      return response;
    } catch (e, st) {
      logger.error('Error updating $table', err: e, stackTrace: st);
      rethrow;
    }
  }

  static Future<void> deleteFromTable(String table, String id) async {
    try {
      await client.from(table).delete().eq('id', id);
      logger.info('Deleted from $table successfully');
    } catch (e, st) {
      logger.error('Error deleting from $table', err: e, stackTrace: st);
      rethrow;
    }
  }

  static void _ensureInitialized() {
    if (!_isInitialized) {
      throw Exception(
        'Supabase not initialized. Call SupabaseConfig.init() first.',
      );
    }
  }
}