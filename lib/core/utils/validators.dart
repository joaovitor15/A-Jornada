/// Validadores com retorno booleano (lógica pura)
class AppValidators {
  // Email validation
  static bool isValidEmail(String email) {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(email);
  }

  // ✅ NOVO: Email único (placeholder para depois integrar BD)
  static bool isEmailFormat(String email) {
    return isValidEmail(email);
  }

  // Password validation (mínimo 6 caracteres)
  static bool isValidPassword(String password) {
    return password.length >= 6;
  }

  // ✅ NOVO: Password forte (para futuro)
  static bool isStrongPassword(String password) {
    // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
    final strongRegex = RegExp(
      r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
    );
    return strongRegex.hasMatch(password);
  }

  // Non-empty validation
  static bool isNotEmpty(String value) {
    return value.trim().isNotEmpty;
  }

  // Name validation
  static bool isValidName(String name) {
    final trimmedName = name.trim();
    return trimmedName.isNotEmpty && trimmedName.length <= 255;
  }

  // ✅ NOVO: Display name mais rigoroso (sem caracteres perigosos)
  static bool isValidDisplayName(String name) {
    final trimmedName = name.trim();
    // Apenas letras, números, espaços, hífen e underscore
    final nameRegex = RegExp(r'^[a-zA-Z0-9\s\-_]{2,255}$');
    return nameRegex.hasMatch(trimmedName);
  }

  // Amount validation (maior que 0)
  static bool isValidAmount(double amount) {
    return amount > 0 && amount <= 999999.99;
  }

  // Category name validation
  static bool isValidCategoryName(String name) {
    final trimmedName = name.trim();
    return trimmedName.isNotEmpty && trimmedName.length <= 255;
  }

  // Tag validation
  static bool isValidTag(String tag) {
    final trimmedTag = tag.trim();
    return trimmedTag.isNotEmpty && trimmedTag.length <= 255;
  }

  // Description validation (opcional, máximo 500)
  static bool isValidDescription(String? description) {
    if (description == null || description.isEmpty) return true;
    return description.length <= 500;
  }

  // Color validation (formato #RRGGBB)
  static bool isValidColor(String color) {
    final colorRegex = RegExp(r'^#[0-9A-Fa-f]{6}$');
    return colorRegex.hasMatch(color);
  }

  // Date validation (não no futuro)
  static bool isValidDate(DateTime date) {
    return date.isBefore(DateTime.now().add(const Duration(days: 1)));
  }

  // ✅ NOVO: URL validation
  static bool isValidUrl(String url) {
    try {
      Uri.parse(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // ✅ NOVO: Phone validation (Brasil)
  static bool isValidPhoneBR(String phone) {
    final phoneRegex = RegExp(r'^(?:\+55\s?)?(?:\(?\d{2}\)?[\s\-]?)?9?\d{4}[\s\-]?\d{4}$');
    return phoneRegex.hasMatch(phone.replaceAll(RegExp(r'\D'), ''));
  }

  // ✅ NOVO: CPF validation (Brasil - básico)
  static bool isValidCPF(String cpf) {
    final cpfClean = cpf.replaceAll(RegExp(r'\D'), '');
    return cpfClean.length == 11 && cpfClean != '00000000000';
  }

  // ✅ NOVO: UUID validation
  static bool isValidUUID(String uuid) {
    final uuidRegex = RegExp(
      r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
      caseSensitive: false,
    );
    return uuidRegex.hasMatch(uuid);
  }

  // ✅ NOVO: Validação genérica de comprimento
  static bool isLengthBetween(String value, int min, int max) {
    final length = value.trim().length;
    return length >= min && length <= max;
  }

  // ✅ NOVO: Validação de campo numérico inteiro
  static bool isValidInteger(String value) {
    try {
      int.parse(value);
      return true;
    } catch (_) {
      return false;
    }
  }

  // ✅ NOVO: Validação de campo numérico decimal
  static bool isValidDecimal(String value) {
    try {
      double.parse(value);
      return true;
    } catch (_) {
      return false;
    }
  }
}

/// Validadores com retorno de mensagem de erro (para UI)
class Validators {
  /// Valida email
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email é obrigatório';
    }

    if (!AppValidators.isValidEmail(value)) {
      return 'Digite um email válido';
    }

    return null;
  }

  /// ✅ NOVO: Valida email com mais detalhes
  static String? validateEmailWithFeedback(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email é obrigatório';
    }

    final trimmed = value.trim();
    if (trimmed.length > 254) {
      return 'Email muito longo (máximo 254 caracteres)';
    }

    if (!AppValidators.isValidEmail(trimmed)) {
      return 'Digite um email válido (ex: usuario@exemplo.com)';
    }

    return null;
  }

  /// Valida senha (mínimo 6 caracteres)
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Senha é obrigatória';
    }

    if (!AppValidators.isValidPassword(value)) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }

    return null;
  }

  /// ✅ NOVO: Valida senha forte (para futuro)
  static String? validatePasswordStrong(String? value) {
    if (value == null || value.isEmpty) {
      return 'Senha é obrigatória';
    }

    if (value.length < 8) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }

    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Senha deve conter pelo menos 1 letra maiúscula';
    }

    if (!RegExp(r'[a-z]').hasMatch(value)) {
      return 'Senha deve conter pelo menos 1 letra minúscula';
    }

    if (!RegExp(r'\d').hasMatch(value)) {
      return 'Senha deve conter pelo menos 1 número';
    }

    if (!RegExp(r'[@$!%*?&]').hasMatch(value)) {
      return 'Senha deve conter pelo menos 1 caractere especial (@\$!%*?&)';
    }

    return null;
  }

  /// Valida nome de exibição
  static String? validateDisplayName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Nome é obrigatório';
    }

    if (!AppValidators.isValidName(value)) {
      return 'Nome inválido (máximo 255 caracteres)';
    }

    return null;
  }

  /// ✅ NOVO: Valida display name com sanitização
  static String? validateDisplayNameStrict(String? value) {
    if (value == null || value.isEmpty) {
      return 'Nome é obrigatório';
    }

    final trimmed = value.trim();

    if (trimmed.length < 2) {
      return 'Nome deve ter no mínimo 2 caracteres';
    }

    if (trimmed.length > 255) {
      return 'Nome deve ter no máximo 255 caracteres';
    }

    if (!AppValidators.isValidDisplayName(trimmed)) {
      return 'Nome contém caracteres inválidos';
    }

    return null;
  }

  /// Valida nome de categoria
  static String? validateCategoryName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Nome da categoria é obrigatório';
    }

    if (!AppValidators.isValidCategoryName(value)) {
      return 'Nome inválido (máximo 255 caracteres)';
    }

    return null;
  }

  /// Valida descrição (opcional)
  static String? validateDescription(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Opcional
    }

    if (!AppValidators.isValidDescription(value)) {
      return 'Descrição deve ter no máximo 500 caracteres';
    }

    return null;
  }

  /// Valida valor monetário
  static String? validateAmount(String? value) {
    if (value == null || value.isEmpty) {
      return 'Valor é obrigatório';
    }

    final amount = double.tryParse(value);
    if (amount == null) {
      return 'Digite um valor válido';
    }

    if (!AppValidators.isValidAmount(amount)) {
      return 'Valor deve estar entre 0 e 999.999,99';
    }

    return null;
  }

  /// Valida tag
  static String? validateTag(String? value) {
    if (value == null || value.isEmpty) {
      return 'Tag é obrigatória';
    }

    if (!AppValidators.isValidTag(value)) {
      return 'Tag inválida (máximo 255 caracteres)';
    }

    return null;
  }

  /// Valida cor (#RRGGBB)
  static String? validateColor(String? value) {
    if (value == null || value.isEmpty) {
      return 'Cor é obrigatória';
    }

    if (!AppValidators.isValidColor(value)) {
      return 'Digite uma cor válida (formato: #RRGGBB)';
    }

    return null;
  }

  /// Valida data (não no futuro)
  static String? validateDate(DateTime? value) {
    if (value == null) {
      return 'Data é obrigatória';
    }

    if (!AppValidators.isValidDate(value)) {
      return 'A data não pode ser no futuro';
    }

    return null;
  }

  /// Valida campo obrigatório genérico
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || !AppValidators.isNotEmpty(value)) {
      return '$fieldName é obrigatório';
    }
    return null;
  }

  /// Valida igualdade entre dois valores (senhas, por exemplo)
  static String? validateMatch(
    String? value,
    String? match,
    String fieldName,
  ) {
    if (value == null || match == null) {
      return '$fieldName é obrigatório';
    }

    if (value != match) {
      return 'Os valores não correspondem';
    }

    return null;
  }

  /// ✅ NOVO: Valida URL
  static String? validateUrl(String? value) {
    if (value == null || value.isEmpty) {
      return 'URL é obrigatória';
    }

    if (!AppValidators.isValidUrl(value)) {
      return 'Digite uma URL válida';
    }

    return null;
  }

  /// ✅ NOVO: Valida telefone Brasil
  static String? validatePhoneBR(String? value) {
    if (value == null || value.isEmpty) {
      return 'Telefone é obrigatório';
    }

    if (!AppValidators.isValidPhoneBR(value)) {
      return 'Digite um telefone válido';
    }

    return null;
  }

  /// ✅ NOVO: Valida CPF Brasil
  static String? validateCPF(String? value) {
    if (value == null || value.isEmpty) {
      return 'CPF é obrigatório';
    }

    if (!AppValidators.isValidCPF(value)) {
      return 'Digite um CPF válido';
    }

    return null;
  }

  /// ✅ NOVO: Valida comprimento entre min e max
  static String? validateLength(
    String? value,
    int min,
    int max,
    String fieldName,
  ) {
    if (value == null || value.isEmpty) {
      return '$fieldName é obrigatório';
    }

    if (!AppValidators.isLengthBetween(value, min, max)) {
      return '$fieldName deve ter entre $min e $max caracteres';
    }

    return null;
  }

  /// ✅ NOVO: Valida número inteiro
  static String? validateInteger(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName é obrigatório';
    }

    if (!AppValidators.isValidInteger(value)) {
      return '$fieldName deve ser um número inteiro';
    }

    return null;
  }

  /// ✅ NOVO: Valida número decimal
  static String? validateDecimal(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName é obrigatório';
    }

    if (!AppValidators.isValidDecimal(value)) {
      return '$fieldName deve ser um número válido';
    }

    return null;
  }
}