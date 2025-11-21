import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:myapp/core/utils/validators.dart';
import 'package:myapp/core/exceptions/app_validation_exception.dart';

part 'signup_request_model.freezed.dart';
part 'signup_request_model.g.dart';

@freezed
class SignupRequestModel with _$SignupRequestModel {
  const SignupRequestModel._(); // ✅ NOVO: Constructor privado

  const factory SignupRequestModel({
    required String email,
    required String password,
    required String displayName,
  }) = _SignupRequestModel;

  factory SignupRequestModel.fromJson(Map<String, dynamic> json) =>
      _$SignupRequestModelFromJson(json);

  // ✅ NOVO: Factory com validação completa
  factory SignupRequestModel.validated({
    required String email,
    required String password,
    required String displayName,
  }) {
    // Sanitiza inputs
    final sanitizedEmail = email.trim().toLowerCase();
    final sanitizedPassword = password;
    final sanitizedDisplayName = displayName.trim();

    // Valida email
    final emailError = Validators.validateEmailWithFeedback(sanitizedEmail);
    if (emailError != null) {
      throw AppValidationException(
        message: emailError,
        code: 'INVALID_EMAIL',
      );
    }

    // Valida senha
    final passwordError = Validators.validatePassword(sanitizedPassword);
    if (passwordError != null) {
      throw AppValidationException(
        message: passwordError,
        code: 'INVALID_PASSWORD',
      );
    }

    // Valida display name
    final displayNameError =
        Validators.validateDisplayNameStrict(sanitizedDisplayName);
    if (displayNameError != null) {
      throw AppValidationException(
        message: displayNameError,
        code: 'INVALID_DISPLAY_NAME',
      );
    }

    return SignupRequestModel(
      email: sanitizedEmail,
      password: sanitizedPassword,
      displayName: sanitizedDisplayName,
    );
  }

  // ✅ NOVO: Getters para validação
  bool get isEmailValid => AppValidators.isValidEmail(email);

  bool get isPasswordValid => AppValidators.isValidPassword(password);

  bool get isDisplayNameValid =>
      AppValidators.isValidDisplayName(displayName);

  bool get isValid => isEmailValid && isPasswordValid && isDisplayNameValid;

  // ✅ NOVO: Método para validar com throw
  void validate() {
    if (!isEmailValid) {
      throw AppValidationException(
        message: 'Email inválido',
        code: 'INVALID_EMAIL',
      );
    }

    if (!isPasswordValid) {
      throw AppValidationException(
        message: 'Senha inválida',
        code: 'INVALID_PASSWORD',
      );
    }

    if (!isDisplayNameValid) {
      throw AppValidationException(
        message: 'Nome inválido',
        code: 'INVALID_DISPLAY_NAME',
      );
    }
  }
}