import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/features/auth/presentation/pages/login_page.dart';
import 'package:myapp/features/auth/presentation/pages/signup_page.dart';
import 'package:myapp/shared/providers/shared_providers.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(currentUserProvider);

  return GoRouter(
    debugLogDiagnostics: true,
    redirect: (context, state) {
      logger.info('🔀 Navigating to: ${state.fullPath}');

      // Se está carregando, não redireciona
      if (authState.isLoading) {
        logger.info('⏳ Auth state loading...');
        return null;
      }

      // ✅ NOVO: Se teve erro ao carregar auth (token expirado, etc)
      if (authState.hasError) {
        logger.error('❌ Auth error detected: ${authState.error}');
        // Se não está em login/signup, força voltar pro login
        if (state.fullPath != '/login' && state.fullPath != '/signup') {
          return '/login';
        }
      }

      // Se não tem usuário autenticado
      if (authState.value == null) {
        // Se já está em login/signup, deixa passar
        if (state.fullPath == '/login' || state.fullPath == '/signup') {
          logger.info('✅ User on auth page');
          return null;
        }
        // Redireciona para login
        logger.info('🔐 No auth - Redirecting to login');
        return '/login';
      }

      // Se tem usuário e está em login/signup, redireciona para dashboard
      if (state.fullPath == '/login' || state.fullPath == '/signup') {
        logger.info('✅ Already authenticated - Redirecting to dashboard');
        return '/dashboard';
      }

      logger.info('✅ Route allowed: ${state.fullPath}');
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignupPage(),
      ),
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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Rota não encontrada',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Caminho: ${state.fullPath}',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
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
  );
});