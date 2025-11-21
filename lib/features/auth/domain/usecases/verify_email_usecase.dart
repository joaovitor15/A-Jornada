import 'package:myapp/core/exceptions/app_validation_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/core/utils/validators.dart';
import '../repositories/auth_repository.dart';

class VerifyEmailUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  VerifyEmailUseCase({required this.repository});

  Future<void> call({
    required String email,
    required String code,
  }) async {
    try {
      // ✅ NOVO: Usar validadores centralizados
      final emailError = Validators.validateEmailWithFeedback(email.trim());
      if (emailError != null) {
        _logger.warning('VerifyEmailUseCase: Email inválido - $emailError');
        throw AppValidationException(
          message: emailError,
          code: 'INVALID_EMAIL',
        );
      }

      // ✅ NOVO: Validar código (6 dígitos)
      if (code.trim().isEmpty || code.trim().length != 6) {
        _logger.warning(
          'VerifyEmailUseCase: Código inválido - comprimento incorreto',
        );
        throw AppValidationException(
          message: 'Código deve ter 6 dígitos',
          code: 'INVALID_CODE',
        );
      }

      if (!AppValidators.isValidInteger(code.trim())) {
        _logger.warning(
          'VerifyEmailUseCase: Código contém caracteres não-numéricos',
        );
        throw AppValidationException(
          message: 'Código deve conter apenas números',
          code: 'INVALID_CODE_FORMAT',
        );
      }

      // ✅ NOVO: Log do início
      _logger.info('VerifyEmailUseCase: Verificando email ${email.trim()}');

      // Sanitiza inputs
      final sanitizedEmail = email.trim().toLowerCase();
      final sanitizedCode = code.trim();

      await repository.verifyEmail(sanitizedEmail, sanitizedCode);

      // ✅ NOVO: Log de sucesso
      _logger.info('VerifyEmailUseCase: Email verificado com sucesso');
    } catch (e, st) {
      // ✅ NOVO: Log de erro
      _logger.error(
        'VerifyEmailUseCase: Erro ao verificar email',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}