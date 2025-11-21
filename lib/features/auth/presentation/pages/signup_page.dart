import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:myapp/shared/themes/app_colors.dart';
import 'package:myapp/shared/themes/app_text_styles.dart';
import 'package:myapp/core/utils/validators.dart';
import '../controllers/auth_controller.dart';
import 'package:myapp/features/auth/domain/entities/auth_entity.dart';

class SignupPage extends ConsumerStatefulWidget {
  const SignupPage({super.key});

  @override
  ConsumerState<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends ConsumerState<SignupPage> {
  late TextEditingController _displayNameController;
  late TextEditingController _emailController;
  late TextEditingController _passwordController;
  late TextEditingController _confirmPasswordController;
  late FocusNode _displayNameFocus;
  late FocusNode _emailFocus;
  late FocusNode _passwordFocus;
  late FocusNode _confirmPasswordFocus;

  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _agreedToTerms = false;

  String? _displayNameError;
  String? _emailError;
  String? _passwordError;
  String? _confirmPasswordError;

  @override
  void initState() {
    super.initState();
    _displayNameController = TextEditingController();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
    _confirmPasswordController = TextEditingController();
    _displayNameFocus = FocusNode();
    _emailFocus = FocusNode();
    _passwordFocus = FocusNode();
    _confirmPasswordFocus = FocusNode();
  }

  @override
  void dispose() {
    _displayNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _displayNameFocus.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    _confirmPasswordFocus.dispose();
    super.dispose();
  }

  void _validateDisplayName() {
    final displayName = _displayNameController.text;
    setState(() {
      _displayNameError = Validators.validateDisplayName(displayName);
    });
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

  void _validateConfirmPassword() {
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;
    setState(() {
      if (confirmPassword.isEmpty) {
        _confirmPasswordError = 'Confirme a senha';
      } else if (confirmPassword != password) {
        _confirmPasswordError = 'As senhas não correspondem';
      } else {
        _confirmPasswordError = null;
      }
    });
  }

  void _handleSignup() {
    _validateDisplayName();
    _validateEmail();
    _validatePassword();
    _validateConfirmPassword();

    if (_displayNameError == null &&
        _emailError == null &&
        _passwordError == null &&
        _confirmPasswordError == null &&
        _agreedToTerms) {
      ref.read(authProvider.notifier).signup(
            email: _emailController.text,
            password: _passwordController.text,
            displayName: _displayNameController.text,
          );
    } else if (!_agreedToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Você deve concordar com os termos'),
          backgroundColor: AppColors.warning,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    ref.listen<AsyncValue<AuthEntity?>>(authProvider, (previous, next) {
      if (previous != null && previous.isLoading && next.hasValue) {
        final user = next.value;
        if (user != null && user.isAuthenticated) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Conta criada com sucesso!'),
              backgroundColor: AppColors.success,
            ),
          );
          context.go('/dashboard');
        }
      }

      if (next.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(ref.read(authProvider.notifier).errorMessage ??
                'Erro ao criar conta'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Criar Conta'),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 32),
            Text(
              'Criar Conta',
              style: AppTextStyles.displayLarge.copyWith(
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              'Preencha os dados para começar',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            TextField(
              controller: _displayNameController,
              focusNode: _displayNameFocus,
              onChanged: (_) {
                if (_displayNameError != null) {
                  _validateDisplayName();
                }
              },
              onEditingComplete: _validateDisplayName,
              decoration: InputDecoration(
                labelText: 'Nome Completo',
                hintText: 'João Silva',
                prefixIcon: const Icon(Icons.person),
                errorText: _displayNameError,
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
            TextField(
              controller: _passwordController,
              focusNode: _passwordFocus,
              obscureText: !_isPasswordVisible,
              onChanged: (_) {
                if (_passwordError != null) {
                  _validatePassword();
                }
                if (_confirmPasswordError != null) {
                  _validateConfirmPassword();
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
            const SizedBox(height: 16),
            TextField(
              controller: _confirmPasswordController,
              focusNode: _confirmPasswordFocus,
              obscureText: !_isConfirmPasswordVisible,
              onChanged: (_) {
                if (_confirmPasswordError != null) {
                  _validateConfirmPassword();
                }
              },
              onEditingComplete: _validateConfirmPassword,
              decoration: InputDecoration(
                labelText: 'Confirmar Senha',
                hintText: '••••••••',
                prefixIcon: const Icon(Icons.lock),
                suffixIcon: IconButton(
                  icon: Icon(
                    _isConfirmPasswordVisible
                        ? Icons.visibility
                        : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                    });
                  },
                ),
                errorText: _confirmPasswordError,
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
            const SizedBox(height: 20),
            Row(
              children: [
                Checkbox(
                  value: _agreedToTerms,
                  onChanged: (value) {
                    setState(() {
                      _agreedToTerms = value ?? false;
                    });
                  },
                ),
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _agreedToTerms = !_agreedToTerms;
                      });
                    },
                    child: Text(
                      'Concordo com os Termos de Serviço',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            authState.when(
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
              data: (_) => SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: _handleSignup,
                  child: const Text('Criar Conta'),
                ),
              ),
              error: (error, stack) => SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: _handleSignup,
                  child: const Text('Tentar Novamente'),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                context.go('/login');
              },
              child: Text(
                'Já tem conta? Faça login',
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
