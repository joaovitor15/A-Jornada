import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/shared/themes/app_colors.dart';
import 'package:myapp/shared/themes/app_text_styles.dart';
import '../controllers/auth_controller.dart';
import '../controllers/auth_form_controller.dart';
import '../widgets/auth_form.dart';

class LoginPage extends ConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final formState = ref.watch(authFormProvider);

    ref.listen(authProvider, (previous, next) {
      next.whenData((user) {
        if (user != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Login realizado com sucesso!')),
          );
          Navigator.of(context).pushReplacementNamed('/home');
        }
      });
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 40),
            Text(
              'Bem-vindo',
              style: AppTextStyles.displayLarge.copyWith(
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              'Faça login em sua conta',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),
            AuthForm(
              email: formState.email,
              password: formState.password,
              isPasswordVisible: formState.isPasswordVisible,
              onEmailChanged: (value) {
                ref.read(authFormProvider.notifier).setEmail(value);
              },
              onPasswordChanged: (value) {
                ref.read(authFormProvider.notifier).setPassword(value);
              },
              onPasswordVisibilityToggled: () {
                ref.read(authFormProvider.notifier).togglePasswordVisibility();
              },
              error: formState.error,
            ),
            const SizedBox(height: 24),
            authState.when(
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              data: (_) => ElevatedButton(
                onPressed: () {
                  ref.read(authProvider.notifier).login(
                    formState.email,
                    formState.password,
                  );
                },
                child: const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Text('Entrar'),
                ),
              ),
              error: (error, stack) => Column(
                children: [
                  ElevatedButton(
                    onPressed: () {
                      ref.read(authProvider.notifier).login(
                        formState.email,
                        formState.password,
                      );
                    },
                    child: const Padding(
                      padding: EdgeInsets.symmetric(vertical: 16),
                      child: Text('Entrar'),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Erro: ${error.toString()}',
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                Navigator.of(context).pushNamed('/signup');
              },
              child: Text(
                'Não tem conta? Cadastre-se',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}