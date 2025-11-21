import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/shared/themes/app_colors.dart';
import 'package:myapp/shared/themes/app_text_styles.dart';
import 'package:myapp/core/utils/validators.dart';
import '../controllers/auth_controller.dart';

class ForgotPasswordPage extends ConsumerStatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  ConsumerState<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends ConsumerState<ForgotPasswordPage> {
  late TextEditingController _emailController;
  late FocusNode _emailFocus;

  String? _emailError;
  bool _emailSent = false;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _emailFocus = FocusNode();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _emailFocus.dispose();
    super.dispose();
  }

  void _validateEmail() {
    final email = _emailController.text;
    setState(() {
      _emailError = Validators.validateEmail(email);
    });
  }

  void _handleResetPassword() {
    _validateEmail();

    if (_emailError == null) {
      ref.read(authProvider.notifier).resetPassword(_emailController.text);
    }
  }

  void _handleNavigation() {
    if (_emailSent) {
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          Navigator.of(context).pop();
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // ✅ CORRETO: Observar sucesso com whenData()
    authState.whenData((_) {
      if (!_emailSent && mounted) {
        setState(() {
          _emailSent = true;
        });

        if (mounted) {
          ScaffoldMessenger.of(context).clearSnackBars();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Email de recuperação enviado com sucesso!'),
              backgroundColor: AppColors.success,
              duration: const Duration(seconds: 2),
            ),
          );
        }

        _handleNavigation();
      }
    });

    // ✅ CORRETO: Observar erros com when()
    authState.when(
      data: (_) {},
      loading: () {},
      error: (error, stackTrace) {
        if (mounted) {
          ScaffoldMessenger.of(context).clearSnackBars();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                ref.read(authProvider.notifier).errorMessage ??
                    'Erro ao enviar email',
              ),
              backgroundColor: AppColors.error,
              duration: const Duration(seconds: 3),
            ),
          );
        }
      },
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Recuperar Senha'),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 60),
            Text(
              'Esqueceu sua senha?',
              style: AppTextStyles.displayLarge.copyWith(
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              'Não se preocupe! Digite seu email para receber um link de recuperação',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),

            // ✅ Email Field
            if (!_emailSent)
              TextField(
                controller: _emailController,
                focusNode: _emailFocus,
                keyboardType: TextInputType.emailAddress,
                enabled: authState.maybeWhen(
                  loading: () => false,
                  orElse: () => true,
                ),
                onChanged: (_) {
                  if (_emailError != null) {
                    _validateEmail();
                  }
                },
                onEditingComplete: _validateEmail,
                decoration: InputDecoration(
                  labelText: 'Email',
                  hintText: 'seu@email.com',
                  prefixIcon: const Icon(Icons.email),
                  errorText: _emailError,
                  errorMaxLines: 2,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(
                      color: AppColors.primary,
                      width: 2,
                    ),
                  ),
                ),
              ),

            // ✅ Success Message
            if (_emailSent)
              Column(
                children: [
                  Icon(
                    Icons.check_circle,
                    size: 80,
                    color: AppColors.success,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Email enviado com sucesso!',
                    style: AppTextStyles.headlineSmall.copyWith(
                      color: AppColors.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Verifique sua caixa de entrada para o link de recuperação',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Redirecionando em breve...',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),

            const SizedBox(height: 24),

            // ✅ Botões (apenas renderizar, sem context access)
            if (!_emailSent)
              authState.when(
                data: (_) => SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _handleResetPassword,
                    child: const Text('Enviar Email de Recuperação'),
                  ),
                ),
                loading: () => SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: null,
                    child: const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                      ),
                    ),
                  ),
                ),
                error: (error, stack) => SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _handleResetPassword,
                    child: const Text('Tentar Novamente'),
                  ),
                ),
              ),

            const SizedBox(height: 16),

            // ✅ Back to Login Link
            if (!_emailSent)
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text(
                  'Voltar para login',
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