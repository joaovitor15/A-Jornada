import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:myapp/shared/themes/app_colors.dart';
import 'package:myapp/shared/themes/app_text_styles.dart';
import 'package:myapp/core/utils/validators.dart';
import '../controllers/auth_controller.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  late TextEditingController _emailController;
  late TextEditingController _passwordController;
  late FocusNode _emailFocus;
  late FocusNode _passwordFocus;

  bool _isPasswordVisible = false;
  String? _emailError;
  String? _passwordError;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
    _emailFocus = FocusNode();
    _passwordFocus = FocusNode();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  void _validateEmail() {
    final email = _emailController.text;
    setState(() {
      _emailError = Validators.validateEmail(email);
    });
  }

  void _validatePassword() {
    final password = _passwordController.text;
    setState(() {
      _passwordError = Validators.validatePassword(password);
    });
  }

  void _handleLogin() {
    _validateEmail();
    _validatePassword();

    if (_emailError == null && _passwordError == null) {
      ref.read(authProvider.notifier).login(
            _emailController.text,
            _passwordController.text,
          );
    }
  }

  void _handleGoogleSignIn() {
    // ✅ PLACEHOLDER: Implementar signInWithGoogle() no controller depois
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Google Sign-In - Em desenvolvimento'),
        backgroundColor: AppColors.warning,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // ✅ CORRIGIDO: Usar when() ao invés de ref.listen com BuildContext
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

            // ✅ Email Field
            TextField(
              controller: _emailController,
              focusNode: _emailFocus,
              keyboardType: TextInputType.emailAddress,
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
            const SizedBox(height: 16),

            // ✅ Password Field
            TextField(
              controller: _passwordController,
              focusNode: _passwordFocus,
              obscureText: !_isPasswordVisible,
              onChanged: (_) {
                if (_passwordError != null) {
                  _validatePassword();
                }
              },
              onEditingComplete: _validatePassword,
              decoration: InputDecoration(
                labelText: 'Senha',
                hintText: '••••••••',
                prefixIcon: const Icon(Icons.lock),
                suffixIcon: IconButton(
                  icon: Icon(
                    _isPasswordVisible
                        ? Icons.visibility
                        : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      _isPasswordVisible = !_isPasswordVisible;
                    });
                  },
                ),
                errorText: _passwordError,
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
            const SizedBox(height: 24),

            // ✅ Login Button with State Handling
            authState.when(
              data: (user) {
                return SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _handleLogin,
                    child: const Text('Entrar'),
                  ),
                );
              },
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
              error: (error, stack) {
                return SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _handleLogin,
                    child: const Text('Tentar Novamente'),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // ✅ Divider com "OU"
            Row(
              children: [
                Expanded(
                  child: Divider(
                    color: AppColors.textSecondary.withValues(alpha: 0.3),
                    height: 1,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'OU',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
                Expanded(
                  child: Divider(
                    color: AppColors.textSecondary.withValues(alpha: 0.3),
                    height: 1,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // ✅ Google Sign-In Button
            SizedBox(
              height: 56,
              child: OutlinedButton.icon(
                onPressed: _handleGoogleSignIn,
                icon: const Icon(Icons.login),
                label: const Text('Continuar com Google'),
              ),
            ),
            const SizedBox(height: 16),

            // ✅ Signup Link - CORRIGIDO
            TextButton(
              onPressed: () {
                context.go('/signup');
              },
              child: Text(
                'Não tem conta? Cadastre-se',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.primary,
                ),
              ),
            ),
            const SizedBox(height: 8),

            // ✅ Forgot Password Link - CORRIGIDO
            TextButton(
              onPressed: () {
                context.go('/forgot-password');
              },
              child: Text(
                'Esqueceu a senha?',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}