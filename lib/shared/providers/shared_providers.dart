import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/core/network/dio_client.dart';

// Shared providers (global state)

// Logger provider (Singleton)
final loggerProvider = Provider<Logger>((ref) {
  return Logger();
});

// DioClient provider (Singleton)
final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient();
});

// Loading state provider
final loadingStateProvider = StateProvider<bool>((ref) {
  return false;
});

// Error message provider
final errorMessageProvider = StateProvider<String?>((ref) {
  return null;
});

// Success message provider
final successMessageProvider = StateProvider<String?>((ref) {
  return null;
});

// Clear messages (utility)
final clearMessagesProvider = Provider((ref) {
  return () {
    ref.read(errorMessageProvider.notifier).state = null;
    ref.read(successMessageProvider.notifier).state = null;
  };
});