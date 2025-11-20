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
    return date.isBefore(DateTime.now().add(Duration(days: 1)));
  }
}