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
      logger.info('Navigating to: ${state.fullPath}');

      // Se está carregando, não redireciona
      if (authState.isLoading) {
        return null;
      }

      // Se não tem usuário autenticado
      if (authState.value == null) {
        // Se já está em login/signup, deixa passar
        if (state.fullPath == '/login' || state.fullPath == '/signup') {
          return null;
        }
        // Redireciona para login
        return '/login';
      }

      // Se tem usuário e está em login/signup, redireciona para dashboard
      if (state.fullPath == '/login' || state.fullPath == '/signup') {
        return '/dashboard';
      }

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
      body: Center(
        child: Text('Rota não encontrada: ${state.fullPath}'),
      ),
    ),
  );
});