/// Validadores com retorno booleano (lógica pura)
class AppValidators {
  // Email validation
  static bool isValidEmail(String email) {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(email);
  }

  // Password validation (mínimo 6 caracteres)
  static bool isValidPassword(String password) {
    return password.length >= 6;
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
}