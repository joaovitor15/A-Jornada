import 'package:myapp/core/exceptions/app_validation_exception.dart';
import '../repositories/auth_repository.dart';

class VerifyEmailUseCase {
  final AuthRepository repository;

  VerifyEmailUseCase({required this.repository});

  Future<void> call({
    required String email,
    required String code,
  }) async {
    // Validate inputs
    if (email.isEmpty) {
      throw AppValidationException(
        message: 'Email cannot be empty',
        code: 'EMPTY_EMAIL',
      );
    }
    if (code.isEmpty) {
      throw AppValidationException(
        message: 'Verification code cannot be empty',
        code: 'EMPTY_CODE',
      );
    }

    // Call repository
    return await repository.verifyEmail(email, code);
  }
}