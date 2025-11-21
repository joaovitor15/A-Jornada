import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/shared/themes/app_colors.dart';
import 'package:myapp/shared/themes/app_text_styles.dart';
import '../controllers/auth_controller.dart';

class VerificationPage extends ConsumerStatefulWidget {
  final String email;

  const VerificationPage({
    super.key,
    required this.email,
  });

  @override
  ConsumerState<VerificationPage> createState() => _VerificationPageState();
}

class _VerificationPageState extends ConsumerState<VerificationPage> {
  late List<TextEditingController> _codeControllers;
  late List<FocusNode> _codeFocusNodes;

  @override
  void initState() {
    super.initState();
    _codeControllers = List.generate(6, (_) => TextEditingController());
    _codeFocusNodes = List.generate(6, (_) => FocusNode());
  }

  @override
  void dispose() {
    for (var controller in _codeControllers) {
      controller.dispose();
    }
    for (var focusNode in _codeFocusNodes) {
      focusNode.dispose();
    }
    super.dispose();
  }

  String _getCode() {
    return _codeControllers.map((c) => c.text).join();
  }

  void _handleCodeInput(int index, String value) {
    if (value.length == 1) {
      if (index < 5) {
        _codeFocusNodes[index + 1].requestFocus();
      } else {
        _codeFocusNodes[index].unfocus();
        _handleVerification();
      }
    }
  }

  void _handleBackspace(int index, String value) {
    if (value.isEmpty && index > 0) {
      _codeFocusNodes[index - 1].requestFocus();
    }
  }

  void _handleVerification() {
    final code = _getCode();
    if (code.length == 6) {
      ref.read(authProvider.notifier).verifyEmail(
            email: widget.email,
            code: code,
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // ✅ CORRIGIDO: Usar when() ao invés de whenData/whenError

    return Scaffold(
      appBar: AppBar(
        title: const Text('Verificar Email'),
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
              'Verifique seu email',
              style: AppTextStyles.displayLarge.copyWith(
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              'Digite o código de 6 dígitos enviado para\n${widget.email}',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),

            // ✅ Code Input Fields
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                6,
                (index) => SizedBox(
                  width: 50,
                  height: 60,
                  child: TextField(
                    controller: _codeControllers[index],
                    focusNode: _codeFocusNodes[index],
                    maxLength: 1,
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    enabled: authState.maybeWhen(
                      loading: () => false,
                      orElse: () => true,
                    ),
                    onChanged: (value) {
                      if (value.isNotEmpty) {
                        _handleCodeInput(index, value);
                      } else {
                        _handleBackspace(index, value);
                      }
                    },
                    decoration: InputDecoration(
                      counterText: '',
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
                ),
              ),
            ),
            const SizedBox(height: 32),

            // ✅ CORRIGIDO: Usar when() ao invés de whenData/whenError
            authState.when(
              data: (user) {
                // ✅ Sucesso - navegar
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Text('Email verificado com sucesso!'),
                      backgroundColor: AppColors.success,
                    ),
                  );
                  if (mounted) {
                    Navigator.of(context).pushReplacementNamed('/home');
                  }
                });

                return SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _handleVerification,
                    child: const Text('Verificar'),
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
                // ✅ Erro - mostrar mensagem
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        ref.read(authProvider.notifier).errorMessage ??
                            'Erro ao verificar email',
                      ),
                      backgroundColor: AppColors.error,
                    ),
                  );
                });

                return SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _handleVerification,
                    child: const Text('Tentar Novamente'),
                  ),
                );
              },
            ),
            const SizedBox(height: 16),

            // ✅ Resend Code Link
            TextButton(
              onPressed: () {
                // TODO: Implementar resend code
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Código reenviado!'),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
              child: Text(
                'Não recebeu o código? Reenviar',
                style: AppTextStyles.bodySmall.copyWith(
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