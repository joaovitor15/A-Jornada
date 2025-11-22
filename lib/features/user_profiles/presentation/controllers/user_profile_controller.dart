// lib/features/user_profiles/presentation/controllers/user_profile_controller.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/features/user_profiles/domain/entities/user_profile_entity.dart';
import 'package:myapp/features/user_profiles/domain/repositories/user_profile_repository.dart';
import 'package:myapp/shared/providers/repository_providers.dart';

/// ============ USER PROFILE STATE NOTIFIER ============

/// ✅ AsyncNotifier para gerenciar estado de perfis do usuário
class UserProfileNotifier extends AsyncNotifier<List<UserProfileEntity>> {
  final Logger _logger = Logger();

  late UserProfileRepository _repository;

  @override
  Future<List<UserProfileEntity>> build() async {
    // Inicializa com lista vazia
    _repository = ref.watch(userProfileRepositoryProvider);
    return [];
  }

  /// ✅ Carregar todos os perfis do usuário logado
  Future<void> loadByUser(String userId) async {
    state = const AsyncValue.loading();

    state = await AsyncValue.guard(() async {
      _logger.info('UserProfileNotifier: Carregando perfis do usuário $userId');

      final profiles = await _repository.getAllByUser(userId);

      _logger.info('UserProfileNotifier: ${profiles.length} perfis carregados');

      return profiles;
    });
  }

  /// ✅ Obter apenas perfis ativos
  List<UserProfileEntity> getActiveProfiles() {
    final currentProfiles = state.value ?? [];
    return currentProfiles.where((p) => p.active).toList();
  }

  /// ✅ Buscar perfil por ID
  Future<UserProfileEntity?> getById(String profileId) async {
    try {
      _logger.info('UserProfileNotifier: Buscando perfil $profileId');

      final profile = await _repository.getById(profileId);

      if (profile != null) {
        _logger.info('UserProfileNotifier: Perfil encontrado: ${profile.name}');
      }

      return profile;
    } catch (e, st) {
      _logger.error(
        'UserProfileNotifier: Erro ao buscar perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Criar novo perfil
  Future<UserProfileEntity> createProfile({
    required String userId,
    required String name,
    required String type,
    String? icon,
    String? color,
  }) async {
    try {
      _logger.info('UserProfileNotifier: Criando novo perfil "$name"');

      final created = await _repository.create(
        userId: userId,
        name: name,
        type: type,
        icon: icon,
        color: color,
        sortOrder: (state.value?.length ?? 0) + 1,
      );

      _logger.info('UserProfileNotifier: Perfil criado com sucesso: ${created.id}');

      // ✅ Atualizar estado adicionando o novo perfil
      state = AsyncValue.data([...state.value ?? [], created]);

      return created;
    } catch (e, st) {
      _logger.error(
        'UserProfileNotifier: Erro ao criar perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Atualizar perfil (renomeado para evitar conflito)
  Future<UserProfileEntity> updateProfile({
    required String id,
    String? name,
    String? type,
    String? icon,
    String? color,
    bool? active,
  }) async {
    try {
      _logger.info('UserProfileNotifier: Atualizando perfil $id');

      final updated = await _repository.update(
        id: id,
        name: name,
        type: type,
        icon: icon,
        color: color,
        active: active,
      );

      _logger.info('UserProfileNotifier: Perfil atualizado com sucesso');

      // ✅ Atualizar estado substituindo o perfil
      final currentProfiles = state.value ?? [];
      final updatedList = currentProfiles.map((profile) {
        return profile.id == id ? updated : profile;
      }).toList();

      state = AsyncValue.data(updatedList);

      return updated;
    } catch (e, st) {
      _logger.error(
        'UserProfileNotifier: Erro ao atualizar perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Deletar perfil
  Future<void> deleteProfile(String profileId) async {
    try {
      _logger.info('UserProfileNotifier: Deletando perfil $profileId');

      await _repository.delete(profileId);

      _logger.info('UserProfileNotifier: Perfil deletado com sucesso');

      // ✅ Atualizar estado removendo o perfil
      final currentProfiles = state.value ?? [];
      final updatedList = currentProfiles
          .where((profile) => profile.id != profileId)
          .toList();

      state = AsyncValue.data(updatedList);
    } catch (e, st) {
      _logger.error(
        'UserProfileNotifier: Erro ao deletar perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Alternar ativo/inativo do perfil
  Future<UserProfileEntity> toggleProfileActive(String profileId) async {
    try {
      _logger.info('UserProfileNotifier: Alternando ativo do perfil $profileId');

      final updated = await _repository.toggleActive(profileId);

      _logger.info('UserProfileNotifier: Status alternado com sucesso');

      // ✅ Atualizar estado substituindo o perfil
      final currentProfiles = state.value ?? [];
      final updatedList = currentProfiles.map((profile) {
        return profile.id == profileId ? updated : profile;
      }).toList();

      state = AsyncValue.data(updatedList);

      return updated;
    } catch (e, st) {
      _logger.error(
        'UserProfileNotifier: Erro ao alternar ativo',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Contar perfis do usuário
  Future<int> countByUser(String userId) async {
    try {
      _logger.info('UserProfileNotifier: Contando perfis do usuário $userId');

      final count = await _repository.countByUser(userId);

      _logger.info('UserProfileNotifier: Total de perfis: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'UserProfileNotifier: Erro ao contar perfis',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}

/// ============ SELECTED PROFILE PROVIDER ============

/// ✅ StateProvider para rastrear qual perfil está selecionado AGORA
/// Importante: Quando muda, vai recarregar categories, transactions, tags
final selectedProfileProvider = StateProvider<String?>((ref) {
  return null; // Inicializa sem seleção
});

/// ============ PROVIDERS ============

/// ✅ UserProfileProvider (AsyncNotifierProvider)
/// Expõe List<UserProfileEntity> com estado e métodos
final userProfileProvider =
    AsyncNotifierProvider<UserProfileNotifier, List<UserProfileEntity>>(
  () => UserProfileNotifier(),
);

/// ✅ Provider para buscar perfis por usuário (com parâmetro)
/// Uso: `ref.watch(userProfilesByUserProvider('user-123'))`
final userProfilesByUserProvider =
    FutureProvider.family<List<UserProfileEntity>, String>((ref, userId) async {
  final repository = ref.watch(userProfileRepositoryProvider);
  return await repository.getAllByUser(userId);
});

/// ✅ Provider para obter perfis ativos (com parâmetro)
/// Filtra apenas perfis com active = true
/// Uso: `ref.watch(activeUserProfilesProvider('user-123'))`
final activeUserProfilesProvider =
    FutureProvider.family<List<UserProfileEntity>, String>((ref, userId) async {
  final repository = ref.watch(userProfileRepositoryProvider);
  final allProfiles = await repository.getAllByUser(userId);
  return allProfiles.where((p) => p.active).toList();
});

/// ✅ Provider para contar perfis (com parâmetro)
/// Uso: `ref.watch(userProfileCountProvider('user-123'))`
final userProfileCountProvider =
    FutureProvider.family<int, String>((ref, userId) async {
  final repository = ref.watch(userProfileRepositoryProvider);
  return await repository.countByUser(userId);
});

/// ✅ Provider para obter perfil selecionado (computed)
/// Depende de: selectedProfileProvider e userProfileProvider
/// Retorna o perfil atualmente selecionado ou null
final currentSelectedProfileProvider =
    FutureProvider<UserProfileEntity?>((ref) async {
  final selectedProfileId = ref.watch(selectedProfileProvider);

  if (selectedProfileId == null) {
    return null;
  }

  final repository = ref.watch(userProfileRepositoryProvider);
  return await repository.getById(selectedProfileId);
});