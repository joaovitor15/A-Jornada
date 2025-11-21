import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/features/auth/presentation/pages/login_page.dart';
import 'package:myapp/features/auth/presentation/pages/signup_page.dart';
import 'package:myapp/features/auth/presentation/pages/forgot_password_page.dart';
import 'package:myapp/features/auth/presentation/pages/verification_page.dart';
import 'package:myapp/features/auth/presentation/providers/auth_providers.dart';

/// ✅ Provider para GoRouter
final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(currentAuthUserProvider);

  return GoRouter(
    debugLogDiagnostics: true,
    redirect: (context, state) {
      logger.info('🔀 Navigating to: ${state.fullPath}');

      return authState.when(
        // 1️⃣ LOADING: Não redireciona (aguarda auth)
        loading: () {
          logger.info('⏳ Auth state loading...');
          return null;
        },

        // 2️⃣ ERROR: Redireciona para login (exceto se já está em auth pages)
        error: (error, stackTrace) {
          logger.error('❌ Auth error detected: $error');
          if (state.fullPath != '/login' &&
              state.fullPath != '/signup' &&
              state.fullPath != '/forgot-password' &&
              state.fullPath != '/verification') {
            return '/login';
          }
          return null;
        },

        // 3️⃣ DATA: Verifica se tem usuário
        data: (user) {
          // Se não tem usuário autenticado
          if (user == null) {
            // Se já está em auth page, deixa passar
            if (state.fullPath == '/login' ||
                state.fullPath == '/signup' ||
                state.fullPath == '/forgot-password' ||
                state.fullPath == '/verification') {
              logger.info('✅ User on auth page');
              return null;
            }
            // Redireciona para login
            logger.info('🔐 No auth - Redirecting to login');
            return '/login';
          }

          // Se tem usuário autenticado e está em auth page, redireciona para dashboard
          if (state.fullPath == '/login' ||
              state.fullPath == '/signup' ||
              state.fullPath == '/forgot-password') {
            logger.info('✅ Already authenticated - Redirecting to dashboard');
            return '/dashboard';
          }

          logger.info('✅ Route allowed: ${state.fullPath}');
          return null;
        },
      );
    },
    routes: [
      // ✅ Login Route
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),

      // ✅ Signup Route
      GoRoute(
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignupPage(),
      ),

      // ✅ Forgot Password Route
      GoRoute(
        path: '/forgot-password',
        name: 'forgot-password',
        builder: (context, state) => const ForgotPasswordPage(),
      ),

      // ✅ Verification Route
      GoRoute(
        path: '/verification',
        name: 'verification',
        builder: (context, state) {
          final email = state.uri.queryParameters['email'] ?? '';
          return VerificationPage(email: email);
        },
      ),

      // ✅ Dashboard Route
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('Dashboard - Em Construção'),
          ),
        ),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(
        title: const Text('Erro'),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                'Rota não encontrada',
                style: Theme.of(context).textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  'Caminho: ${state.fullPath}',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                child: const Text('Voltar para Login'),
              ),
            ],
          ),
        ),
      ),
    ),
  );
});
