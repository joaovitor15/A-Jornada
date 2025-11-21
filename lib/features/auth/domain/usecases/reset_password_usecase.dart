import 'package:myapp/core/exceptions/app_validation_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/core/utils/validators.dart';
import '../repositories/auth_repository.dart';

class ResetPasswordUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  ResetPasswordUseCase({required this.repository});

  Future<void> call({required String email}) async {
    try {
      // ✅ NOVO: Usar validadores centralizados
      final emailError = Validators.validateEmailWithFeedback(email.trim());
      if (emailError != null) {
        _logger.warning('ResetPasswordUseCase: Email inválido - $emailError');
        throw AppValidationException(
          message: emailError,
          code: 'INVALID_EMAIL',
        );
      }

      // ✅ NOVO: Log do início
      _logger.info('ResetPasswordUseCase: Solicitando reset para ${email.trim()}');

      // Sanitiza email
      final sanitizedEmail = email.trim().toLowerCase();

      await repository.resetPassword(sanitizedEmail);

      // ✅ NOVO: Log de sucesso
      _logger.info(
        'ResetPasswordUseCase: Email de reset enviado para $sanitizedEmail',
      );
    } catch (e, st) {
      // ✅ NOVO: Log de erro
      _logger.error(
        'ResetPasswordUseCase: Erro ao resetar senha',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}