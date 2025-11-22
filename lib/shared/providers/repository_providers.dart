// lib/shared/providers/repository_providers.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:myapp/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:myapp/features/auth/data/datasources/auth_remote_datasource_impl.dart';
import 'package:myapp/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:myapp/features/auth/domain/repositories/auth_repository.dart';
import 'package:myapp/features/categories/data/datasources/category_remote_datasource.dart';
import 'package:myapp/features/categories/data/datasources/category_remote_datasource_impl.dart';
import 'package:myapp/features/categories/data/repositories/category_repository_impl.dart';
import 'package:myapp/features/categories/domain/repositories/category_repository.dart';
import 'package:myapp/features/transactions/data/datasources/transaction_remote_datasource.dart';
import 'package:myapp/features/transactions/data/datasources/transaction_remote_datasource_impl.dart';
import 'package:myapp/features/transactions/data/repositories/transaction_repository_impl.dart';
import 'package:myapp/features/transactions/domain/repositories/transaction_repository.dart';
import 'package:myapp/features/tags/data/datasources/tag_remote_datasource.dart';
import 'package:myapp/features/tags/data/datasources/tag_remote_datasource_impl.dart';
import 'package:myapp/features/tags/data/repositories/tag_repository_impl.dart';
import 'package:myapp/features/tags/domain/repositories/tag_repository.dart';
import 'package:myapp/features/user_profiles/data/datasources/user_profile_remote_datasource.dart';
import 'package:myapp/features/user_profiles/data/datasources/user_profile_remote_datasource_impl.dart';
import 'package:myapp/features/user_profiles/data/repositories/user_profile_repository_impl.dart';
import 'package:myapp/features/user_profiles/domain/repositories/user_profile_repository.dart';

/// ============ DATASOURCES ============

/// ✅ AuthRemoteDataSource Provider (Singleton)
final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  final supabaseClient = Supabase.instance.client;
  return AuthRemoteDataSourceImpl(supabaseClient: supabaseClient);
});

/// ✅ CategoryRemoteDataSource Provider (Singleton)
final categoryRemoteDataSourceProvider = Provider<CategoryRemoteDataSource>((ref) {
  final supabaseClient = Supabase.instance.client;
  return CategoryRemoteDataSourceImpl(supabaseClient: supabaseClient);
});

/// ✅ TransactionRemoteDataSource Provider (Singleton)
final transactionRemoteDataSourceProvider = Provider<TransactionRemoteDataSource>((ref) {
  final supabaseClient = Supabase.instance.client;
  return TransactionRemoteDataSourceImpl(supabaseClient: supabaseClient);
});

/// ✅ TagRemoteDataSource Provider (Singleton)
final tagRemoteDataSourceProvider = Provider<TagRemoteDataSource>((ref) {
  final supabaseClient = Supabase.instance.client;
  return TagRemoteDataSourceImpl(supabaseClient: supabaseClient);
});

/// ============ REPOSITORIES ============

/// ✅ AuthRepository Provider (Singleton)
/// Depende de: authRemoteDataSourceProvider
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final remoteDataSource = ref.watch(authRemoteDataSourceProvider);
  return AuthRepositoryImpl(remoteDataSource: remoteDataSource);
});

/// ✅ CategoryRepository Provider (Singleton)
/// Depende de: categoryRemoteDataSourceProvider
final categoryRepositoryProvider = Provider<CategoryRepository>((ref) {
  final remoteDataSource = ref.watch(categoryRemoteDataSourceProvider);
  return CategoryRepositoryImpl(remoteDataSource: remoteDataSource);
});

/// ✅ TransactionRepository Provider (Singleton)
/// Depende de: transactionRemoteDataSourceProvider
final transactionRepositoryProvider = Provider<TransactionRepository>((ref) {
  final remoteDataSource = ref.watch(transactionRemoteDataSourceProvider);
  return TransactionRepositoryImpl(remoteDataSource: remoteDataSource);
});

/// ✅ TagRepository Provider (Singleton)
/// Depende de: tagRemoteDataSourceProvider
final tagRepositoryProvider = Provider<TagRepository>((ref) {
  final remoteDataSource = ref.watch(tagRemoteDataSourceProvider);
  return TagRepositoryImpl(remoteDataSource: remoteDataSource);
});
final userProfileRemoteDataSourceProvider = Provider<UserProfileRemoteDataSource>((ref) {
  final supabaseClient = Supabase.instance.client;
  return UserProfileRemoteDataSourceImpl(supabaseClient: supabaseClient);
});

/// ✅ UserProfileRepository Provider (Singleton)
/// Depende de: userProfileRemoteDataSourceProvider
final userProfileRepositoryProvider = Provider<UserProfileRepository>((ref) {
  final remoteDataSource = ref.watch(userProfileRemoteDataSourceProvider);
  return UserProfileRepositoryImpl(remoteDataSource: remoteDataSource);
});