
// lib/features/tags/presentation/controllers/tag_controller.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myapp/core/utils/logger.dart';
import 'package:myapp/features/tags/domain/entities/tag_entity.dart';
import 'package:myapp/features/tags/domain/repositories/tag_repository.dart';
import 'package:myapp/shared/providers/repository_providers.dart';

/// ============ TAG STATE NOTIFIER ============

/// ✅ AsyncNotifier para gerenciar estado de tags
class TagNotifier extends AsyncNotifier<List<TagEntity>> {
  final Logger _logger = Logger();

  late TagRepository _repository;

  @override
  Future<List<TagEntity>> build() async {
    // Inicializa com lista vazia
    _repository = ref.watch(tagRepositoryProvider);
    return [];
  }

  /// ✅ Buscar tags por perfil
  Future<void> getByProfile(String profileId) async {
    state = const AsyncValue.loading();

    state = await AsyncValue.guard(() async {
      _logger.info('TagNotifier: Buscando tags do perfil $profileId');

      final tags = await _repository.getByProfile(profileId);

      _logger.info('TagNotifier: ${tags.length} tags encontradas');

      return tags;
    });
  }

  /// ✅ Buscar tags por nome (busca parcial)
  Future<List<TagEntity>> searchByName(String profileId, String searchText) async {
    try {
      _logger.info(
        'TagNotifier: Buscando tags com nome contendo "$searchText"',
      );

      final tags = await _repository.searchByName(profileId, searchText);

      _logger.info('TagNotifier: ${tags.length} tags encontradas na busca');

      return tags;
    } catch (e, st) {
      _logger.error(
        'TagNotifier: Erro ao buscar tags por nome',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Criar nova tag
  Future<TagEntity> createTag({
    required String profileId,
    required String name,
    String? color,
    int sortOrder = 0,
  }) async {
    try {
      _logger.info('TagNotifier: Criando tag "$name" no perfil $profileId');

      final created = await _repository.create(
        profileId: profileId,
        name: name,
        color: color,
        sortOrder: sortOrder,
      );

      _logger.info('TagNotifier: Tag criada com sucesso: ${created.id}');

      // ✅ Atualizar estado adicionando a nova tag
      state = AsyncValue.data([...state.value ?? [], created]);

      return created;
    } catch (e, st) {
      _logger.error(
        'TagNotifier: Erro ao criar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Atualizar tag (renomeado para evitar conflito)
  Future<TagEntity> updateTag({
    required String id,
    String? name,
    String? color,
    int? sortOrder,
  }) async {
    try {
      _logger.info('TagNotifier: Atualizando tag $id');

      final updated = await _repository.update(
        id: id,
        name: name,
        color: color,
        sortOrder: sortOrder,
      );

      _logger.info('TagNotifier: Tag atualizada com sucesso: ${updated.id}');

      // ✅ Atualizar estado substituindo a tag
      final currentTags = state.value ?? [];
      final updatedList = currentTags.map((tag) {
        return tag.id == id ? updated : tag;
      }).toList();

      state = AsyncValue.data(updatedList);

      return updated;
    } catch (e, st) {
      _logger.error(
        'TagNotifier: Erro ao atualizar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Deletar tag
  Future<void> deleteTag(String tagId) async {
    try {
      _logger.info('TagNotifier: Deletando tag $tagId');

      await _repository.delete(tagId);

      _logger.info('TagNotifier: Tag deletada com sucesso: $tagId');

      // ✅ Atualizar estado removendo a tag
      final currentTags = state.value ?? [];
      final updatedList = currentTags
          .where((tag) => tag.id != tagId)
          .toList();

      state = AsyncValue.data(updatedList);
    } catch (e, st) {
      _logger.error(
        'TagNotifier: Erro ao deletar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Contar tags de um perfil
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info('TagNotifier: Contando tags do perfil $profileId');

      final count = await _repository.countByProfile(profileId);

      _logger.info('TagNotifier: Total de tags: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'TagNotifier: Erro ao contar tags',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  /// ✅ Obter tags mais usadas
  Future<List<TagEntity>> getMostUsed(String profileId, {int limit = 10}) async {
    try {
      _logger.info('TagNotifier: Buscando $limit tags mais usadas do perfil $profileId');

      final tags = await _repository.getMostUsed(profileId);

      _logger.info('TagNotifier: ${tags.length} tags mais usadas encontradas');

      return tags;
    } catch (e, st) {
      _logger.error(
        'TagNotifier: Erro ao buscar tags mais usadas',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}

/// ============ PROVIDERS ============

/// ✅ TagProvider (AsyncNotifierProvider)
/// Expõe List<TagEntity> com estado e métodos
final tagProvider = AsyncNotifierProvider<TagNotifier, List<TagEntity>>(
  () => TagNotifier(),
);

/// ✅ Provider para buscar tags por perfil (com parâmetro)
/// Uso: `ref.watch(tagsByProfileProvider('profile-123'))`
final tagsByProfileProvider =
    FutureProvider.family<List<TagEntity>, String>((ref, profileId) async {
  final repository = ref.watch(tagRepositoryProvider);
  return await repository.getByProfile(profileId);
});

/// ✅ Provider para buscar tags por nome (com parâmetros)
/// Uso: `ref.watch(tagsBySearchProvider(('profile-123', 'work')))`
final tagsBySearchProvider = FutureProvider.family<List<TagEntity>, (String, String)>(
  (ref, params) async {
    final repository = ref.watch(tagRepositoryProvider);
    final (profileId, searchText) = params;
    return await repository.searchByName(profileId, searchText);
  },
);

/// ✅ Provider para contar tags (com parâmetro)
/// Uso: `ref.watch(tagCountProvider('profile-123'))`
final tagCountProvider =
    FutureProvider.family<int, String>((ref, profileId) async {
  final repository = ref.watch(tagRepositoryProvider);
  return await repository.countByProfile(profileId);
});

/// ✅ Provider para obter tags mais usadas (com parâmetro)
/// Uso: `ref.watch(mostUsedTagsProvider('profile-123'))`
final mostUsedTagsProvider =
    FutureProvider.family<List<TagEntity>, String>((ref, profileId) async {
  final repository = ref.watch(tagRepositoryProvider);
  return await repository.getMostUsed(profileId);
});