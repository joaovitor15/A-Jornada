import 'package:myapp/core/exceptions/app_validation_exception.dart';
import '../repositories/auth_repository.dart';

class ResetPasswordUseCase {
  final AuthRepository repository;

  ResetPasswordUseCase({required this.repository});

  Future<void> call({required String email}) async {
    // Validate inputs
    if (email.isEmpty) {
      throw AppValidationException(
        message: 'Email cannot be empty',
        code: 'EMPTY_EMAIL',
      );
    }

    // Call repository
    return await repository.resetPassword(email);
  }
}