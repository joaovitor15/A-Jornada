import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class RefreshTokenUseCase {
  final AuthRepository repository;

  RefreshTokenUseCase({required this.repository});

  Future<AuthEntity> call() async {
    // Call repository
    return await repository.refreshToken();
  }
}