class AppConstants {
  // App info
  static const String appName = 'Controle Financeiro';
  static const String appVersion = '1.0.0';

  // API timeouts (em segundos)
  static const int apiTimeoutSeconds = 30;
  static const int shortTimeoutSeconds = 10;

  // Pagination
  static const int pageSize = 20;
  static const int initialPage = 0;

  // Validation constraints
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 128;
  static const int minNameLength = 2;
  static const int maxNameLength = 255;
  static const int maxDescriptionLength = 500;
  static const int maxTagLength = 255;

  // Amount constraints
  static const double minAmount = 0.01;
  static const double maxAmount = 999999.99;

  // Profile types
  static const List<String> profileTypes = [
    'Farmácia',
    'Casa',
    'Pessoal',
    'Negócio',
    'Outro',
  ];

  // Transaction types
  static const List<String> transactionTypes = [
    'Income',
    'Expense',
    'Transfer',
  ];

  // Categories depth (hierarquia máxima)
  static const int maxCategoryDepth = 3;

  // Cache duration
  static const Duration cacheDuration = Duration(hours: 1);
  static const Duration shortCacheDuration = Duration(minutes: 5);

  // Animation durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 500);
  static const Duration longAnimationDuration = Duration(milliseconds: 800);

  // Retry policy
  static const int maxRetryAttempts = 3;
  static const Duration retryDelay = Duration(seconds: 2);
}
