import 'package:myapp/core/exceptions/app_validation_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/core/utils/validators.dart';
import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class SignupUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  SignupUseCase({required this.repository});

  Future<AuthEntity> call({
    required String email,
    required String password,
    required String displayName,
  }) async {
    try {
      // ✅ NOVO: Usar validadores centralizados
      final emailError = Validators.validateEmailWithFeedback(email.trim());
      if (emailError != null) {
        _logger.warning('SignupUseCase: Email inválido - $emailError');
        throw AppValidationException(
          message: emailError,
          code: 'INVALID_EMAIL',
        );
      }

      final passwordError = Validators.validatePassword(password);
      if (passwordError != null) {
        _logger.warning('SignupUseCase: Senha inválida');
        throw AppValidationException(
          message: passwordError,
          code: 'INVALID_PASSWORD',
        );
      }

      final displayNameError =
          Validators.validateDisplayNameStrict(displayName.trim());
      if (displayNameError != null) {
        _logger.warning('SignupUseCase: Nome inválido - $displayNameError');
        throw AppValidationException(
          message: displayNameError,
          code: 'INVALID_DISPLAY_NAME',
        );
      }

      // ✅ NOVO: Log do início
      _logger.info('SignupUseCase: Iniciando signup para ${email.trim()}');

      // Sanitiza inputs
      final sanitizedEmail = email.trim().toLowerCase();
      final sanitizedDisplayName = displayName.trim();

      // Call repository
      final result = await repository.signup(
        email: sanitizedEmail,
        password: password,
        displayName: sanitizedDisplayName,
      );

      // ✅ NOVO: Log de sucesso
      _logger.info('SignupUseCase: Signup bem-sucedido para ${result.id}');

      return result;
    } catch (e, st) {
      // ✅ NOVO: Log de erro
      _logger.error(
        'SignupUseCase: Erro ao fazer signup',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}
