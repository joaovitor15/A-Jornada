import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class WatchAuthStateUseCase {
  final AuthRepository repository;

  WatchAuthStateUseCase({required this.repository});

  Stream<AuthEntity?> call() {
    // Call repository
    return repository.watchAuthState();
  }
}