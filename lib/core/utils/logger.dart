import 'package:logger/logger.dart' as logger_pkg;

class Logger {
  static final Logger _instance = Logger._internal();
  late final logger_pkg.Logger _logger;

  factory Logger() {
    return _instance;
  }

  Logger._internal() {
    _logger = logger_pkg.Logger(
      printer: logger_pkg.PrettyPrinter(
        methodCount: 2,
        errorMethodCount: 8,
        lineLength: 120,
        colors: true,
        printEmojis: true,
      ),
    );
  }

  void debug(String message, {dynamic err, StackTrace? stackTrace}) {
    _logger.d(message, error: err, stackTrace: stackTrace);
  }

  void info(String message) {
    _logger.i(message);
  }

  void warning(String message, {dynamic err, StackTrace? stackTrace}) {
    _logger.w(message, error: err, stackTrace: stackTrace);
  }

  void error(String message, {dynamic err, StackTrace? stackTrace}) {
    _logger.e(message, error: err, stackTrace: stackTrace);
  }
}

final logger = Logger();