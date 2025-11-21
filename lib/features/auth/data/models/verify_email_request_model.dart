import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:myapp/core/utils/validators.dart';
import 'package:myapp/core/exceptions/app_validation_exception.dart';

part 'verify_email_request_model.freezed.dart';
part 'verify_email_request_model.g.dart';

@freezed
class VerifyEmailRequestModel with _$VerifyEmailRequestModel {
  const VerifyEmailRequestModel._(); // ✅ NOVO: Constructor privado

  const factory VerifyEmailRequestModel({
    required String email,
    required String code,
  }) = _VerifyEmailRequestModel;

  factory VerifyEmailRequestModel.fromJson(Map<String, dynamic> json) =>
      _$VerifyEmailRequestModelFromJson(json);

  // ✅ NOVO: Factory com validação
  factory VerifyEmailRequestModel.validated({
    required String email,
    required String code,
  }) {
    // Sanitiza inputs
    final sanitizedEmail = email.trim().toLowerCase();
    final sanitizedCode = code.trim();

    // Valida email
    final emailError = Validators.validateEmailWithFeedback(sanitizedEmail);
    if (emailError != null) {
      throw AppValidationException(
        message: emailError,
        code: 'INVALID_EMAIL',
      );
    }

    // Valida código (6 dígitos)
    if (sanitizedCode.isEmpty || sanitizedCode.length != 6) {
      throw AppValidationException(
        message: 'Código deve ter 6 dígitos',
        code: 'INVALID_CODE',
      );
    }

    if (!AppValidators.isValidInteger(sanitizedCode)) {
      throw AppValidationException(
        message: 'Código deve conter apenas números',
        code: 'INVALID_CODE_FORMAT',
      );
    }

    return VerifyEmailRequestModel(
      email: sanitizedEmail,
      code: sanitizedCode,
    );
  }

  // ✅ NOVO: Getters para validação
  bool get isEmailValid => AppValidators.isValidEmail(email);

  bool get isCodeValid =>
      code.length == 6 && AppValidators.isValidInteger(code);

  bool get isValid => isEmailValid && isCodeValid;

  // ✅ NOVO: Método para validar com throw
  void validate() {
    if (!isEmailValid) {
      throw AppValidationException(
        message: 'Email inválido',
        code: 'INVALID_EMAIL',
      );
    }

    if (!isCodeValid) {
      throw AppValidationException(
        message: 'Código de verificação inválido',
        code: 'INVALID_CODE',
      );
    }
  }
}