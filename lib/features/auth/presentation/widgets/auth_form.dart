import 'package:flutter/material.dart';

class AuthForm extends StatefulWidget {
  final String email;
  final String password;
  final bool isPasswordVisible;
  final Function(String) onEmailChanged;
  final Function(String) onPasswordChanged;
  final Function() onPasswordVisibilityToggled;
  final String? error;

  const AuthForm({
    super.key,
    required this.email,
    required this.password,
    required this.isPasswordVisible,
    required this.onEmailChanged,
    required this.onPasswordChanged,
    required this.onPasswordVisibilityToggled,
    this.error,
  });

  @override
  State<AuthForm> createState() => _AuthFormState();
}

class _AuthFormState extends State<AuthForm> {
  late TextEditingController _emailController;
  late TextEditingController _passwordController;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController(text: widget.email);
    _passwordController = TextEditingController(text: widget.password);
  }

  @override
  void didUpdateWidget(AuthForm oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.email != widget.email) {
      _emailController.text = widget.email;
    }
    if (oldWidget.password != widget.password) {
      _passwordController.text = widget.password;
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          controller: _emailController,
          onChanged: widget.onEmailChanged,
          decoration: InputDecoration(
            labelText: 'Email',
            hintText: 'seu@email.com',
            prefixIcon: const Icon(Icons.email_outlined),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            errorText: widget.error,
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _passwordController,
          onChanged: widget.onPasswordChanged,
          decoration: InputDecoration(
            labelText: 'Senha',
            hintText: '••••••••',
            prefixIcon: const Icon(Icons.lock_outlined),
            suffixIcon: IconButton(
              icon: Icon(
                widget.isPasswordVisible
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
              ),
              onPressed: widget.onPasswordVisibilityToggled,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          obscureText: !widget.isPasswordVisible,
        ),
      ],
    );
  }
}
