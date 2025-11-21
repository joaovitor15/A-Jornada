import 'package:myapp/core/exceptions/app_validation_exception.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/core/utils/validators.dart';
import '../entities/auth_entity.dart';
import '../repositories/auth_repository.dart';

class LoginUseCase {
  final AuthRepository repository;
  final Logger _logger = Logger();

  LoginUseCase({required this.repository});

  Future<AuthEntity> call({
    required String email,
    required String password,
  }) async {
    try {
      // ✅ NOVO: Usar validadores centralizados
      final emailError = Validators.validateEmailWithFeedback(email.trim());
      if (emailError != null) {
        _logger.warning('LoginUseCase: Email inválido - $emailError');
        throw AppValidationException(
          message: emailError,
          code: 'INVALID_EMAIL',
        );
      }

      final passwordError = Validators.validatePassword(password);
      if (passwordError != null) {
        _logger.warning('LoginUseCase: Senha inválida');
        throw AppValidationException(
          message: passwordError,
          code: 'INVALID_PASSWORD',
        );
      }

      // ✅ NOVO: Log do início da operação
      _logger.info('LoginUseCase: Iniciando login para ${email.trim()}');

      // Sanitiza email
      final sanitizedEmail = email.trim().toLowerCase();

      // Call repository
      final result = await repository.login(
        email: sanitizedEmail,
        password: password,
      );

      // ✅ NOVO: Log de sucesso
      _logger.info('LoginUseCase: Login bem-sucedido para ${result.id}');

      return result;
    } catch (e, st) {
      // ✅ NOVO: Log de erro
      _logger.error('LoginUseCase: Erro ao fazer login', err: e, stackTrace: st);
      rethrow;
    }
  }
}