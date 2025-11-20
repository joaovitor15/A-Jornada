import 'package:flutter/material.dart';
import '../../core/constants/error_messages.dart';
import '../../shared/themes/app_colors.dart';
import '../../shared/themes/app_text_styles.dart';

class ErrorDisplayWidget extends StatelessWidget {
  final String? message;
  final VoidCallback? onRetry;
  final bool showRetryButton;

  const ErrorDisplayWidget({
    super.key,
    this.message,
    this.onRetry,
    this.showRetryButton = true,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Error icon
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.error.withValues(alpha: 0.1),
              ),
              child: Icon(
                Icons.error_outline,
                size: 40,
                color: AppColors.error,
              ),
            ),
            SizedBox(height: 24),

            // Error message
            Text(
              'Oops!',
              style: AppTextStyles.headlineMedium.copyWith(
                color: AppColors.error,
              ),
            ),
            SizedBox(height: 8),

            // Error description
            Text(
              message ?? ErrorMessages.genericError,
              textAlign: TextAlign.center,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            SizedBox(height: 32),

            // Retry button
            if (showRetryButton && onRetry != null)
              ElevatedButton(
                onPressed: onRetry,
                child: Text('Tentar novamente'),
              ),
          ],
        ),
      ),
    );
  }
}