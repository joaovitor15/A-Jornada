import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class SignupUseCase {
  final AuthRepository repository;

  SignupUseCase({required this.repository});

  Future<AuthEntity> call({
    required String email,
    required String password,
    required String displayName,
  }) async {
    // Validate inputs
    if (email.isEmpty) {
      throw ArgumentError('Email cannot be empty');
    }
    if (password.isEmpty) {
      throw ArgumentError('Password cannot be empty');
    }
    if (displayName.isEmpty) {
      throw ArgumentError('Display name cannot be empty');
    }
    if (password.length < 6) {
      throw ArgumentError('Password must be at least 6 characters');
    }

    // Call repository
    return await repository.signup(
      email: email,
      password: password,
      displayName: displayName,
    );
  }
}