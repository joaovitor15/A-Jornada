import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:myapp/core/utils/validators.dart';
import 'package:myapp/core/exceptions/app_validation_exception.dart';

part 'reset_password_request_model.freezed.dart';
part 'reset_password_request_model.g.dart';

@freezed
class ResetPasswordRequestModel with _$ResetPasswordRequestModel {
  const ResetPasswordRequestModel._(); // ✅ NOVO: Constructor privado

  const factory ResetPasswordRequestModel({
    required String email,
  }) = _ResetPasswordRequestModel;

  factory ResetPasswordRequestModel.fromJson(Map<String, dynamic> json) =>
      _$ResetPasswordRequestModelFromJson(json);

  // ✅ NOVO: Factory com validação
  factory ResetPasswordRequestModel.validated({
    required String email,
  }) {
    // Sanitiza input
    final sanitizedEmail = email.trim().toLowerCase();

    // Valida email
    final emailError = Validators.validateEmailWithFeedback(sanitizedEmail);
    if (emailError != null) {
      throw AppValidationException(
        message: emailError,
        code: 'INVALID_EMAIL',
      );
    }

    return ResetPasswordRequestModel(email: sanitizedEmail);
  }

  // ✅ NOVO: Getters para validação
  bool get isEmailValid => AppValidators.isValidEmail(email);

  bool get isValid => isEmailValid;

  // ✅ NOVO: Método para validar com throw
  void validate() {
    if (!isEmailValid) {
      throw AppValidationException(
        message: 'Email inválido',
        code: 'INVALID_EMAIL',
      );
    }
  }
}
