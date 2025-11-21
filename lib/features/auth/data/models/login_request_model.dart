import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:myapp/core/utils/validators.dart';
import 'package:myapp/core/exceptions/app_validation_exception.dart';

part 'login_request_model.freezed.dart';
part 'login_request_model.g.dart';

@freezed
class LoginRequestModel with _$LoginRequestModel {
  const LoginRequestModel._(); // ✅ NOVO: Constructor privado

  const factory LoginRequestModel({
    required String email,
    required String password,
  }) = _LoginRequestModel;

  factory LoginRequestModel.fromJson(Map<String, dynamic> json) =>
      _$LoginRequestModelFromJson(json);

  // ✅ NOVO: Factory com validação
  factory LoginRequestModel.validated({
    required String email,
    required String password,
  }) {
    // Sanitiza inputs
    final sanitizedEmail = email.trim().toLowerCase();
    final sanitizedPassword = password;

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

    return LoginRequestModel(
      email: sanitizedEmail,
      password: sanitizedPassword,
    );
  }

  // ✅ NOVO: Getters para validação
  bool get isEmailValid => AppValidators.isValidEmail(email);

  bool get isPasswordValid => AppValidators.isValidPassword(password);

  bool get isValid => isEmailValid && isPasswordValid;

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
  }
}