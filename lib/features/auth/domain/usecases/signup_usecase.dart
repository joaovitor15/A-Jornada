import 'package:myapp/core/exceptions/app_validation_exception.dart';
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
      throw AppValidationException(
        message: 'Email cannot be empty',
        code: 'EMPTY_EMAIL',
      );
    }
    if (password.isEmpty) {
      throw AppValidationException(
        message: 'Password cannot be empty',
        code: 'EMPTY_PASSWORD',
      );
    }
    if (displayName.isEmpty) {
      throw AppValidationException(
        message: 'Display name cannot be empty',
        code: 'EMPTY_DISPLAY_NAME',
      );
    }
    if (password.length < 6) {
      throw AppValidationException(
        message: 'Password must be at least 6 characters',
        code: 'PASSWORD_TOO_SHORT',
      );
    }

    // Call repository
    return await repository.signup(
      email: email,
      password: password,
      displayName: displayName,
    );
  }
}