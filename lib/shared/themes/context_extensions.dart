import 'package:flutter/material.dart';

extension BuildContextExtensions on BuildContext {
  // Media query
  Size get screenSize => MediaQuery.of(this).size;
  double get screenWidth => screenSize.width;
  double get screenHeight => screenSize.height;
  bool get isPortrait => MediaQuery.of(this).orientation == Orientation.portrait;
  bool get isLandscape => MediaQuery.of(this).orientation == Orientation.landscape;
  
  // Device type
  bool get isMobile => screenWidth < 600;
  bool get isTablet => screenWidth >= 600 && screenWidth < 900;
  bool get isDesktop => screenWidth >= 900;

  // Padding and insets
  EdgeInsets get viewPadding => MediaQuery.of(this).viewPadding;
  EdgeInsets get viewInsets => MediaQuery.of(this).viewInsets;
  double get topPadding => viewPadding.top;
  double get bottomPadding => viewPadding.bottom;

  // Theme
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => theme.textTheme;
  ColorScheme get colorScheme => theme.colorScheme;

  // Navigation
  NavigatorState get navigator => Navigator.of(this);
  
  void push(Widget page) {
    navigator.push(MaterialPageRoute(builder: (_) => page));
  }

  void pushReplacement(Widget page) {
    navigator.pushReplacement(MaterialPageRoute(builder: (_) => page));
  }

  void pop([dynamic result]) {
    navigator.pop(result);
  }

  // Dialogs
  Future<T?> showDialog<T>(
    Widget dialog, {
    bool barrierDismissible = true,
  }) {
    return showAdaptiveDialog<T>(
      context: this,
      barrierDismissible: barrierDismissible,
      builder: (_) => dialog,
    );
  }

  Future<T?> showBottomSheet<T>(Widget sheet) {
    return showModalBottomSheet<T>(
      context: this,
      builder: (_) => sheet,
    );
  }

  // SnackBar
  void showSnackBar(String message, {Duration duration = const Duration(seconds: 2)}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: duration,
      ),
    );
  }

  void showErrorSnackBar(String message) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: theme.colorScheme.error,
        duration: Duration(seconds: 3),
      ),
    );
  }

  void showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }
}