import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/logger.dart';

class RiverpodObserver extends ProviderObserver {
  @override
  void didUpdateProvider(
    ProviderBase<dynamic> provider,
    Object? previousValue,
    Object? newValue,
    ProviderContainer container,
  ) {
    logger.info(
      'Provider "${provider.name}" updated: $previousValue → $newValue',
    );
  }

  @override
  void didAddProvider(
    ProviderBase<dynamic> provider,
    Object? value,
    ProviderContainer container,
  ) {
    logger.info('Provider "${provider.name}" added: $value');
  }

  @override
  void didDisposeProvider(
    ProviderBase<dynamic> provider,
    ProviderContainer container,
  ) {
    logger.info('Provider "${provider.name}" disposed');
  }
}